// import { MovieModel } from "../models/local-file-system/movie.js"
// import { MovieModel } from '../models/mysql/movie.js'

import { validateMovie, validatePartialMovie } from '../schemas/movies.js'


export class MovieController {
    constructor ({ movieModel }) {
        this.movieModel = movieModel
    }
    getAll = async (req, res) => {
        const { genre } = req.query
        const movies = await this.movieModel.getAll({ genre })
        // que es lo que renderiza
        res.json(movies)
    }

    getById = async (req, res) => {
        const { id } = req.params
        const movie = await this.movieModel.getById({ id })
        
        if (movie) return res.json(movie)
        
        res.status(404).json({ message: 'Movie not found' })
    }

    create = async (req, res) => {
      console.log('Request body en el controlador:', req.body); // Log the request body

      const result = validateMovie(req.body)
  
      if (!result.success) {
        // 422 Unprocessable Entity
        return res.status(400).json({ error: JSON.parse(result.error.message) })
      }

      console.log('Validando...:', result.data); // Log the validated data
  
      try {
          const newMovie = await this.movieModel.create(result.data) // Pass the validated data
          res.status(201).json(newMovie)
      } catch (e) {
          console.error('Error creating movie:', e.message);
          res.status(500).json({ error: e.message });
      }
  }

    delete = async (req, res) => {
        const { id } = req.params;

        try {
            await this.movieModel.delete({ id });
            res.status(200).json({ message: "Pelicula eliminada correctamente" }); // Enviando respuesta al cliente
        } catch (e) {
            console.error('Error al eliminar la pelicula:', e.message);
            res.status(500).json({ error: e.message });
        }
    }

    update = async (req, res) => {
      const result = validatePartialMovie(req.body)

      if (!result.success) {
          return res.status(400).json({ error: JSON.parse(result.error.message) })
      }

      const { id } = req.params
      try {
          const updatedMovie = await this.movieModel.update({ id, input: result.data })

          if (!updatedMovie) {
              return res.status(404).json({ message: 'Pelicula no encontrada' })
          }

          return res.json(updatedMovie)
      } catch (e) {
          console.error('Error al actualizar la pelicula:', e.message)
          return res.status(500).json({ error: e.message })
      }
  }
}