import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { NgbRating, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { TheMovieDBService } from '../services/the-movie-db.service';
import { TmdbAuthService } from '../services/tmdb-auth.service';

@Component({
  selector: 'app-series',
  imports: [NgbRating, CommonModule, RouterModule],
  templateUrl: './series.component.html', // Cambia el nombre del archivo de plantilla
  styleUrls: ['./series.component.css'], // Cambia el nombre del archivo de estilos
})
export class SeriesComponent {
  series: any[] = []; // Cambia movies a series
  orden: string = '';
  currentPage: number = 1; // Variable para controlar la página actual

  watchlistSeries: Set<number> = new Set(); // Cambia watchlistMovies a watchlistSeries
  favoriteSeries: Set<number> = new Set(); // Cambia favoriteMovies a favoriteSeries

  constructor(
    private router: Router,
    public tmdbService: TheMovieDBService,
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
      this.cargarSeries();
    });

    if (localStorage.getItem('tmdb_session_id')) {
      this.loadUserData();
    }
  }

  private loadTrendingSeries(page: number): void { // Cambia el nombre de la función
    this.tmdbService.getTrendingSeries('week', page).subscribe({ // Asegúrate de que este método sea adecuado para series
      next: (data) => {
        this.tmdbService.filterMoviesByMissingData('title', data).subscribe({
          next: (filteredData) => {
            this.series.push(...filteredData); // Agregar nuevas series al array
          },
          error: (err) => console.error('Error al filtrar series:', err),
        });
      },
      error: (err) => console.error('Error al obtener series:', err),
    });
  }

  cargarSeries() { // Cambia el nombre de la función
    console.log(`Cargando series ordenadas por: ${this.orden}`);
    this.loadTrendingSeries(this.currentPage); // Cambia el método llamado
  }

  loadMoreSeries() { // Cambia el nombre de la función
    this.currentPage++; // Incrementar la página actual
    this.loadTrendingSeries(this.currentPage); // Cargar más series
  }

  loadUserData() {
    const sessionId = localStorage.getItem('tmdb_session_id');
    if (!sessionId) {
      console.warn('No hay sesión activa');
      return;
    }
    this.tmdbAuthService
      .getFavoriteTVShows()
      .subscribe(
        (data) =>
          (this.favoriteSeries = new Set( // Cambia a favoriteSeries
            data.results.map((series: { id: any }) => series.id) // Cambia a series
          ))
      );
    this.tmdbAuthService
      .getWatchlistTVShows()
      .subscribe(
        (data) =>
          (this.watchlistSeries = new Set( // Cambia a watchlistSeries
            data.results.map((series: { id: any }) => series.id) // Cambia a series
          ))
      );
  }

  isInWatchlist(mediaId: number): boolean {
    return this.watchlistSeries.has(mediaId); // Cambia a watchlistSeries
  }

  isFavorite(mediaId: number): boolean {
    return this.favoriteSeries.has(mediaId); // Cambia a favoriteSeries
  }

  toggleWatchList(mediaId: number, isInWatchlist: boolean) {
    this.tmdbAuthService
      .markAs(mediaId, 'series', !isInWatchlist, 'watchlist')
      .subscribe((response) => {
        console.log('Respuesta de la API para Watchlist:', response);
        if ([1, 12, 13].includes(response.status_code)) {
          console.log('Watchlist actualizado:', !isInWatchlist);
          if (this.watchlistSeries.has(mediaId)) {
            this.watchlistSeries.delete(mediaId);
            console.log(`Serie ${mediaId} eliminada de la Watchlist.`);
          } else {
            this.watchlistSeries.add(mediaId);
            console.log(`Serie ${mediaId} añadida a la Watchlist.`);
          }
        } else {
          console.warn('Error en la respuesta de la API:', response);
        }
      });
  }
  
  toggleFavorite(mediaId: number, isFavorite: boolean) {
    this.tmdbAuthService
      .markAs(mediaId, 'series', !isFavorite, 'favorite')
      .subscribe((response) => {
        console.log('Respuesta de la API para Favoritos:', response);
        if ([1, 12, 13].includes(response.status_code)) {
          console.log('Favorito actualizado:', !isFavorite);
          if (this.favoriteSeries.has(mediaId)) {
            this.favoriteSeries.delete(mediaId);
            console.log(`Serie ${mediaId} eliminada de Favoritos.`);
          } else {
            this.favoriteSeries.add(mediaId);
            console.log(`Serie ${mediaId} añadida a Favoritos.`);
          }
        } else {
          console.warn('Error en la respuesta de la API:', response);
        }
      });
  }
  
  
}


