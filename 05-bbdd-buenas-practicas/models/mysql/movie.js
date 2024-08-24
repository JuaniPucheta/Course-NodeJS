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

    static async create ({ input }) {
        const {
        //   genre: genreInpuat, // genre is an array
          title,
          year,
          duration,
          director,
          rate,
          poster
        } = input
    
        // todo: crear la conexión de genre
    
        // crypto.randomUUID()
        const [uuidResult] = await connection.query('SELECT UUID() uuid;')
        const [{ uuid }] = uuidResult
    
        try {
          await connection.query(
            `INSERT INTO movie (id, title, year, director, duration, poster, rate)
              VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
            [title, year, director, duration, poster, rate]
          )
        } catch (e) {
          // puede enviarle información sensible
          throw new Error('Error creating movie')
          // enviar la traza a un servicio interno
          // sendLog(e)
        }
    
        const [movies] = await connection.query(
          `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
            FROM movie WHERE id = UUID_TO_BIN(?);`,
          [uuid]
        )
    
        return movies[0]
    }
    
    static async delete ({ id }) {
        
    }

    static async update ({ id, input }) {
        
    }
}

