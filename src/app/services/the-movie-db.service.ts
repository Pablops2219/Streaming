import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';

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
  providedIn: 'root',
})
export class TheMovieDBService {
  private readonly API_URL = 'https://api.themoviedb.org/3'; // URL base de la API
  private readonly IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'; // URL base para imágenes
  private readonly API_KEY = '6e87c3c07b000342a50d24e85226247d'; // Clave de TMDB
  private readonly BEARER_TOKEN =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZTg3YzNjMDdiMDAwMzQyYTUwZDI0ZTg1MjI2MjQ3ZCIsIm5iZiI6MTczOTg3MDMyOS4xMTYsInN1YiI6IjY3YjQ1MDc5ZDQ0ZGNhZmUwZjlmOWViMCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Kzim2VPPXQpwuREhPmce0XBbKqI9Jn-oSloXA5_e1_A'; // Token de autenticación

  constructor(private http: HttpClient) {}

  /**
   * Realiza una solicitud GET con autenticación por token Bearer.
   * @param endpoint Endpoint de la API
   * @returns Observable con la respuesta de la API
   */
  private get<T>(endpoint: string): Observable<T> {
    const headers = new HttpHeaders({
      accept: 'application/json',
      Authorization: `Bearer ${this.BEARER_TOKEN}`,
    });
    return this.http.get<T>(`${this.API_URL}/${endpoint}?language=es-ES`, {
      headers,
    });
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
          stars: Math.round(movie.vote_average / 2),
          voteCount: movie.vote_count,
          popularity: movie.popularity,
          genreIds: movie.genre_ids,
          originalLanguage: movie.original_language,
          originalTitle: movie.original_title,
          adultContent: movie.adult,
          videoAvailable: movie.video,
        }));
      })
    );
  }

  /**
   * Filtra películas por datos faltantes.
   * @param filterBy Tipo de filtro ('title', 'description' o 'both')
   * @param movies Lista de películas a filtrar
   * @returns Observable con la lista de películas filtradas
   */
  filterMoviesByMissingData(
    filterBy: 'title' | 'description' | 'both',
    movies: any[] = []
  ): Observable<Movie[]> {
    return new Observable((observer) => {
      const filteredData = movies.filter((element) => {
        // Verificar si se debe filtrar por título
        if (filterBy === 'title' || filterBy === 'both') {
          if (!element.title || element.title.trim() === '') {
            //console.log('No hay título', element.id);
            return false; // Excluir este elemento
          }
        }

        // Verificar si se debe filtrar por descripción
        if (filterBy === 'description' || filterBy === 'both') {
          if (!element.overview || element.overview.trim() === '') {
            //console.log('No hay descripción', element.id);
            return false; // Excluir este elemento
          }
        }

        return true; // Mantener el elemento
      });

      observer.next(filteredData);
      observer.complete();
    });
  }

  getTrendingSeries(): Observable<Movie[]> {
    return this.get<ApiResponse>('/trending/tv/day?language=es-ES').pipe(
      map((response: ApiResponse) => {
        return response.results.map((series: any) => ({
          id: series.id,
          title: series.name,
          overview: series.overview,
          posterUrl: `https://image.tmdb.org/t/p/original${series.poster_path}`,
          backdropUrl: `https://image.tmdb.org/t/p/original${series.backdrop_path}`,
          releaseDate: series.first_air_date,
          voteAverage: series.vote_average,
          stars: Math.round(series.vote_average / 2),
          voteCount: series.vote_count,
          popularity: series.popularity,
          genreIds: series.genre_ids,
          originalLanguage: series.original_language,
          originalTitle: series.original_name,
          adultContent: series.adult,
          videoAvailable: series.video,
        }));
      })
    );
  }

  /**
   * Obtiene un video de una película por su ID.
   * @param movieId ID de la película
   * @param index Índice del video a obtener (opcional)
   * @returns Observable con la información
   */
  getVideoByMovieId(movieId: number, index?: number): Observable<Map<string, any>> {
    return this.get<any>(`movie/${movieId}/videos`).pipe(
      map((data) => {
        //console.log('Respuesta completa de la API:', data);
        const videoMap = new Map<string, any>();
  
        // Si no hay resultados, devolver un mapa con la clave "404"
        if (!data || !Array.isArray(data.results) || data.results.length === 0) {
          console.warn('No se encontraron videos para esta película.');
          videoMap.set("404", {
            name: 'Video no encontrado',
            url: 'https://www.youtube.com/404'
          });
          return videoMap;
        }
  
        const videosWithUrl = data.results.map((video: any) => ({
          ...video,
          url: `https://www.youtube.com/embed/${video.key}`,
        }));
  
        //console.log('Videos transformados:', videosWithUrl);
  
        // Si no hay índice, buscar el primer video de tipo "Trailer"
        if (index === undefined) {
          const trailer = videosWithUrl.find((video: { type: string }) => video.type === "Trailer");
          if (trailer) {
            console.log('Devolviendo primer trailer:', trailer);
            videoMap.set("video", trailer);
            return videoMap;
          } else {
            console.warn('No se encontraron trailers.');
            videoMap.set("404", {
              name: 'Video no encontrado',
              url: 'https://www.youtube.com/404'
            });
            return videoMap;
          }
        }
  
        // Convertir index a número (por si viene como string)
        index = Number(index);
  
        if (isNaN(index) || index < 0 || index >= videosWithUrl.length) {
          console.error(`Índice fuera de rango: index=${index}, length=${videosWithUrl.length}`);
          videoMap.set("404", {
            name: 'Video no encontrado',
            url: 'https://www.youtube.com/404'
          });
          return videoMap;
        }
  
        console.log(`Devolviendo el video en la posición ${index}:`, videosWithUrl[index]);
        videoMap.set("video", videosWithUrl[index]);
        return videoMap;
      }),
      catchError((err) => {
        console.error('Error al obtener el video:', err);
        const errorMap = new Map<string, any>();
        errorMap.set("404", {
          name: 'Error al cargar el video',
          url: 'https://www.youtube.com/404'
        });
        return of(errorMap); // 🔥 Asegura que siempre devuelve un Observable válido
      })
    );
  }
  
  
}
