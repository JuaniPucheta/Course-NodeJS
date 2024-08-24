import mysql from 'mysql2/promise'

const config = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: 'root',
    database: 'moviesdb'
}

const connection = await mysql.createConnection(config)

export class MovieModel {
    static async getAll({ genre }) {
        if (genre) {
            const lowerCaseGenre = genre.toLowerCase();
    
            // Obtener el ID del género según el nombre proporcionado
            const [genres] = await connection.query(
                'SELECT id FROM genre WHERE LOWER(name) = ?;', [lowerCaseGenre]
            );
    
            if (!genres.length) {
                return [];
            }
    
            const [{ id }] = genres;
    
            // Obtener todas las películas que correspondan a ese género
            const [movies] = await connection.query(
                `SELECT 
                    BIN_TO_UUID(m.id) as id,
                    m.title, 
                    m.year, 
                    m.director, 
                    m.duration, 
                    m.poster, 
                    m.rate, 
                    GROUP_CONCAT(g.name) as genres 
                FROM movies m
                INNER JOIN movie_genres mg ON m.id = mg.movie_id
                INNER JOIN genre g ON mg.genre_id = g.id
                WHERE mg.genre_id = ?
                GROUP BY m.id;`,
                [id]
            );
    
            return movies.map(movie => ({
                ...movie,
                genre: movie.genres.split(',')
            }));
        }
    
        // Obtener todas las películas con sus géneros
        const [movies] = await connection.query(
            `SELECT 
                BIN_TO_UUID(m.id) as id,
                m.title, 
                m.year, 
                m.director, 
                m.duration, 
                m.poster, 
                m.rate, 
                GROUP_CONCAT(g.name) as genres 
            FROM movies m
            LEFT JOIN movie_genres mg ON m.id = mg.movie_id
            LEFT JOIN genre g ON mg.genre_id = g.id
            GROUP BY m.id;`
        );
    
        return movies.map(movie => ({
            ...movie,
            genre: movie.genres ? movie.genres.split(',') : []
        }));
    }
    
    static async getById({ id }) {
        const [movies] = await connection.query(
            `SELECT 
                BIN_TO_UUID(m.id) as id,
                m.title, 
                m.year, 
                m.director, 
                m.duration, 
                m.poster, 
                m.rate, 
                GROUP_CONCAT(g.name) as genres 
            FROM movies m
            LEFT JOIN movie_genres mg ON m.id = mg.movie_id
            LEFT JOIN genre g ON mg.genre_id = g.id
            WHERE m.id = UUID_TO_BIN(?)
            GROUP BY m.id;`,
            [id]
        );
    
        if (!movies.length) {
            return null;
        }
    
        return {
            ...movies[0],
            genre: movies[0].genres ? movies[0].genres.split(',') : []
        };
    }    

    static async create(input) {
        console.log('Input recibido en el modelo:', input)  // Log the received input

        const {
            genre: genreInput = [], // Default to an empty array for `genre`
            title,
            year,
            duration,
            director,
            rate,
            poster
        } = input

        if (!title) {
            throw new Error("Title is required and cannot be null")
        }

        // Generate UUID for the new movie
        const [uuidResult] = await connection.query('SELECT UUID() uuid;')
        const [{ uuid }] = uuidResult

        try {
            // Insert the movie into the 'movies' table
            await connection.query(
                `INSERT INTO movies (id, title, year, director, duration, poster, rate)
                  VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?);`,
                [uuid, title, year, director, duration, poster, rate]
            )

            // Create the genre connection
            for (let genreName of genreInput) {
                // Check if the genre already exists
                let [genreResult] = await connection.query('SELECT id FROM genre WHERE LOWER(name) = LOWER(?);', [genreName])

                let genreId;
                if (genreResult.length === 0) {
                    // If it doesn't exist, insert it
                    const [insertGenreResult] = await connection.query('INSERT INTO genre (name) VALUES (?);', [genreName])
                    genreId = insertGenreResult.insertId
                } else {
                    // If it exists, get the ID
                    genreId = genreResult[0].id
                }

                // Insert into the 'movie_genres' table
                await connection.query(
                    'INSERT INTO movie_genres (movie_id, genre_id) VALUES (UUID_TO_BIN(?), ?);',
                    [uuid, genreId]
                );
            }

        } catch (e) {
            // Error handling
            throw new Error(`Error creating movie and assigning genres: ${e.message}`)
        }

        const [movies] = await connection.query(
            `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
                FROM movies WHERE id = UUID_TO_BIN(?);`,
            [uuid]
        );

        return {
            ...movies[0],
            genre: genreInput // Return the associated genres
        };
    }
    
    static async delete({ id }) {
        if (!id) {
            throw new Error("La ID es requerida para eliminar una película")
        }

        try {
            //? eliminar la película de la tabla 'movies'
            await connection.query(
                `DELETE FROM movies WHERE id = UUID_TO_BIN(?);`,
                [id]
            )

            //? opcionalmente, eliminar la conexión de género
            await connection.query(
                `DELETE FROM movie_genres WHERE movie_id = UUID_TO_BIN(?);`,
                [id]
            )

            return { message: "Pelicula eliminada correctamente" }
        } catch (e) {
            //? manejo de errores
            throw new Error(`Error al eliminar la película: ${e.message}`)
        }
    }

    static async update ({ id, input }) {
        if (!id) {
            throw new Error("ID es requerido para actualizar una película");
        }

        const fields = [];
        const values = [];

        for (const [key, value] of Object.entries(input)) {
            fields.push(`${key} = ?`);
            values.push(value);
        }

        if (fields.length === 0) {
            throw new Error("No hay campos para actualizar");
        }

        values.push(id);

        try {
            const [result] = await connection.query(
                `UPDATE movies SET ${fields.join(', ')} WHERE id = UUID_TO_BIN(?);`,
                values
            );

            if (result.affectedRows === 0) {
                return null; // Película no encontrada
            }

            // Obtener la película actualizada
            const [movies] = await connection.query(
                `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
                 FROM movies WHERE id = UUID_TO_BIN(?);`,
                [id]
            );

            if (movies.length === 0) {
                return null; // Película no encontrada
            }

            // Obtener los géneros asociados
            const [genres] = await connection.query(
                `SELECT g.name
                 FROM genre g
                 JOIN movie_genres mg ON g.id = mg.genre_id
                 WHERE mg.movie_id = UUID_TO_BIN(?);`,
                [id]
            );

            const genreNames = genres.map(genre => genre.name);

            return {
                ...movies[0],
                genre: genreNames
            };
        } catch (e) {
            // Manejo de errores
            throw new Error(`Error al actualizar la película: ${e.message}`);
        }
    }
}

