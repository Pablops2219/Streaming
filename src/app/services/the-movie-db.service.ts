import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

// Interfaces para modelar las respuestas de la API
export interface Movie {
  id: number; // ID único de la película
  title: string; // Título de la película
  overview: string; // Sinopsis o descripción de la película
  posterUrl: string; // URL del póster de la película
  backdropUrl: string; // URL de la imagen de fondo
  releaseDate: string; // Fecha de estreno de la película
  voteAverage: number; // Promedio de votos
  voteCount: number; // Cantidad de votos
  popularity: number; // Nivel de popularidad de la película
  genreIds: number[]; // IDs de géneros de la película
  originalLanguage: string; // Idioma original en el que fue grabada la película
  originalTitle: string; // Título original de la película
  adultContent: boolean; // Indica si el contenido es para adultos
  videoAvailable: boolean; // Indica si hay un video disponible
}

export interface ApiResponse {
  page: number; // Número de página
  results: Movie[]; // Lista de películas
  total_pages: number; // Total de páginas disponibles
  total_results: number; // Total de resultados disponibles
}

@Injectable({
  providedIn: 'root'
})
export class TheMovieDBService {
  private readonly API_URL = 'https://api.themoviedb.org/3'; // URL base de la API
  private readonly IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; // URL base para imágenes
  private readonly API_KEY = '6e87c3c07b000342a50d24e85226247d'; // Clave de TMDB
  private readonly BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZTg3YzNjMDdiMDAwMzQyYTUwZDI0ZTg1MjI2MjQ3ZCIsIm5iZiI6MTczOTg3MDMyOS4xMTYsInN1YiI6IjY3YjQ1MDc5ZDQ0ZGNhZmUwZjlmOWViMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Kzim2VPPXQpwuREhPmce0XBbKqI9Jn-oSloXA5_e1_A'; // Token de autenticación

  constructor(private http: HttpClient) {}

  /**
   * Realiza una solicitud GET con autenticación por token Bearer.
   * @param endpoint Endpoint de la API
   * @returns Observable con la respuesta de la API
   */
  private get<T>(endpoint: string): Observable<T> {
    const headers = new HttpHeaders({
      accept: 'application/json',
      Authorization: `Bearer ${this.BEARER_TOKEN}`
    });
    return this.http.get<T>(`${this.API_URL}/${endpoint}?language=es-ES`, { headers });
  }

  /**
   * Obtiene información de autenticación de la API.
   * @returns Observable con la respuesta de autenticación
   */
  getAuthentication(): Observable<any> {
    return this.get<any>('authentication/token/new');
  }

  /**
   * Obtiene detalles de una película por su ID.
   * @param movieId ID de la película
   * @returns Observable con los detalles de la película
   */
  getMovieByID(movieId: number): Observable<Movie> {
    return this.get<Movie>(`movie/${movieId}`);
  }

  /**
   * Obtiene películas descubiertas (discover).
   * @returns Observable con la lista de películas descubiertas
   */
  //https://api.themoviedb.org/3
  getTrendingMovies(): Observable<Movie[]> {
    return this.get<ApiResponse>('/trending/movie/day?language=es-ES').pipe(
      map((response: ApiResponse) => {
          return response.results.map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            overview: movie.overview,
            posterUrl: `https://image.tmdb.org/t/p/original${movie.poster_path}`, // URL del póster de la película
            backdropUrl: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`, // URL de la imagen de fondo
            releaseDate: movie.release_date,
            voteAverage: movie.vote_average,
            voteCount: movie.vote_count,
            popularity: movie.popularity,
            genreIds: movie.genre_ids,
            originalLanguage: movie.original_language,
            originalTitle: movie.original_title,
            adultContent: movie.adult,
            videoAvailable: movie.video
          }));
        
      })
    );
  }
  
}
