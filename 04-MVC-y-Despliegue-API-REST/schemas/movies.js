import z from 'zod'

const movieSchema = z.object({
    title: z.string({
        invalid_type_error: 'Movie title must be a string.',
        required_error: 'Movie title is required.'
    }),
    year: z.number().int().min(1895).max(2025),
    director: z.string(),
    duration: z.number().int().positive(),
    rate: z.number().min(0).max(10).default(5.5),
    poster: z.string().url({
        message: 'Poster must be a valid URL.'
    }),
    genre: z.array(
        z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Thriller', 'Western', 'Science Fiction', 'Animation', 'Family', 'Romance', 'Documentary', 'Music', 'War', 'History', 'Crime', 'TV Movie', 'Foreign']),
        {
            invalid_type_error: 'Genre must be an array of strings.',
            required_error: 'Genre is required.',
        }
    )
})

export function validateMovie (input) {
    return movieSchema.safeParse(input) // { data: { title: '...', ... }, error: null }
}

export function validatePartialMovie (input) {
    return movieSchema.partial().safeParse(input)
}

