import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { NgbRating, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { TheMovieDBService } from '../services/the-movie-db.service';
import { TmdbAuthService } from '../services/tmdb-auth.service';

@Component({
  selector: 'app-peliculas',
  imports: [NgbRating, CommonModule],
  templateUrl: './peliculas.component.html',
  styleUrl: './peliculas.component.css',
})
export class PeliculasComponent {
  title: string = "";
  movies: any[] = [];
  orden: string = '';
  currentPage: number = 1; // Variable para controlar la página actual

  watchlistMovies: Set<number> = new Set();
  favoriteMovies: Set<number> = new Set();

  constructor(
    private tmdbService: TheMovieDBService,
    config: NgbRatingConfig,
    private sanitizer: DomSanitizer,
    public tmdbAuthService: TmdbAuthService,
    private route: ActivatedRoute
  ) {
    config.max = 5;
    config.readonly = true;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.orden = params['orden'] || 'populares'; // Valor por defecto
      this.cargarPeliculas();
    });

    if (localStorage.getItem('tmdb_session_id')) {
      this.loadUserData();
    }
  }

  private loadTrendingMovies(page: number): void {
    this.tmdbService.getTrendingMovies('week', page).subscribe({
      next: (data) => {
        this.tmdbService.filterMoviesByMissingData('title', data).subscribe({
          next: (filteredData) => {
            this.movies.push(...filteredData); // Agregar nuevas películas al array
          },
          error: (err) => console.error('Error al filtrar películas:', err),
        });
      },
      error: (err) => console.error('Error al obtener películas:', err),
    });
  }

  cargarPeliculas() {
    console.log(`Cargando películas ordenadas por: ${this.orden}`);
    this.loadTrendingMovies(this.currentPage);
  }

  loadMoreMovies() {
    this.currentPage++; // Incrementar la página actual
    this.loadTrendingMovies(this.currentPage); // Cargar más películas
  }

  loadUserData() {
    const sessionId = localStorage.getItem('tmdb_session_id');
    if (!sessionId) {
      console.warn('No hay sesión activa');
      return;
    }
    this.tmdbAuthService
      .getFavoriteMovies()
      .subscribe(
        (data) =>
          (this.favoriteMovies = new Set(
            data.results.map((movie: { id: any }) => movie.id)
          ))
      );
    this.tmdbAuthService
      .getWatchlistMovies()
      .subscribe(
        (data) =>
          (this.watchlistMovies = new Set(
            data.results.map((movie: { id: any }) => movie.id)
          ))
      );
  }

  isInWatchlist(mediaId: number): boolean {
    return this.watchlistMovies.has(mediaId);
  }

  isFavorite(mediaId: number): boolean {
    return this.favoriteMovies.has(mediaId);
  }

  toggleWatchList(mediaId: number, isInWatchlist: boolean) {
    this.tmdbAuthService
      .markAs(mediaId, 'movie', !isInWatchlist, 'watchlist')
      .subscribe((response) => {
        if ([1, 12, 13].includes(response.status_code)) {
          console.log('Watchlist actualizado:', !isInWatchlist);
          this.watchlistMovies.has(mediaId)
            ? this.watchlistMovies.delete(mediaId)
            : this.watchlistMovies.add(mediaId);
        }
      });
  }

  toggleFavorite(mediaId: number, isFavorite: boolean) {
    this.tmdbAuthService
      .markAs(mediaId, 'movie', !isFavorite, 'favorite')
      .subscribe((response) => {
        if ([1, 12, 13].includes(response.status_code)) {
          console.log('Favorito actualizado:', !isFavorite);
          this.favoriteMovies.has(mediaId)
            ? this.favoriteMovies.delete(mediaId)
            : this.favoriteMovies.add(mediaId);
        }
      });
  }
}
