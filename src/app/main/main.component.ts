import { Component } from '@angular/core';
import { TheMovieDBService } from '../services/the-movie-db.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { TmdbAuthService } from '../services/tmdb-auth.service';
import { MovieslidesComponent } from "../movieslides/movieslides.component";

@Component({
  selector: 'app-main',
  imports: [NgFor, NgbRatingModule, NgIf, NgClass, MovieslidesComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
  providers: [NgbRatingConfig],
})
export class MainComponent {
  movies: any[] = [];
  series: any[] = [];
  selectedMovie: any = null;
  showVideo: boolean = false;
  safeVideoUrl: SafeResourceUrl | null = null;
  urlSafe: SafeResourceUrl | undefined;
  isMovieSelected: boolean = false;

  watchlistMovies: Set<number> = new Set();
  watchlistSeries: Set<number> = new Set();
  favoriteMovies: Set<number> = new Set();
  favoriteSeries: Set<number> = new Set();

  constructor(
    private tmdbService: TheMovieDBService,
    config: NgbRatingConfig,
    private sanitizer: DomSanitizer,
    public tmdbAuthService: TmdbAuthService
  ) {
    config.max = 5;
    config.readonly = true;
  }

  ngOnInit(): void {
    this.loadTrendingMovies();
    this.loadTrendingSeries();
    this.loadSpecificMovie(762509);
    
    if (localStorage.getItem('tmdb_session_id')) {
      this.loadUserData();
    }
  }

  isInWatchlist(mediaId: number, mediaType: 'movie' | 'tv'): boolean {
    return mediaType === 'movie' ? this.watchlistMovies.has(mediaId) : this.watchlistSeries.has(mediaId);
  }
  
  isFavorite(mediaId: number, mediaType: 'movie' | 'tv'): boolean {
    return mediaType === 'movie' ? this.favoriteMovies.has(mediaId) : this.favoriteSeries.has(mediaId);
  }
  

  private loadTrendingMovies(): void {
    this.tmdbService.getTrendingMovies('week').subscribe({
      next: (data) => {
        this.tmdbService.filterMoviesByMissingData('title', data).subscribe({
          next: (filteredData) => this.movies = filteredData,
          error: (err) => console.error('Error al filtrar películas:', err),
        });
      },
      error: (err) => console.error('Error al obtener películas:', err),
    });
  }

  private loadTrendingSeries(): void {
    this.tmdbService.getTrendingSeries('week').subscribe({
      next: (data) => this.series = data,
      error: (err) => console.error('Error al obtener series:', err),
    });
  }

  private loadSpecificMovie(id: number): void {
    this.tmdbService.getMovieByID(id).subscribe({
      next: (data) => this.selectedMovie = data,
      error: (err) => console.error('Error al obtener película:', err),
    });
  }

  viewDetails(item: any, isMovie: boolean): void {
    if (this.selectedMovie === item) {
      this.clearSelection();
    } else {
      this.selectedMovie = item;
      this.showVideo = true;+
      console.log("Item:", item);
      isMovie ? this.loadMovieVideo(item.id) : this.loadSerieVideo(item.id);
    }
  }

  public clearSelection(): void {
    this.selectedMovie = null;
    this.showVideo = false;
    this.safeVideoUrl = null;
    this.isMovieSelected = false;
  }

  private loadMovieVideo(movieId: number): void {
    this.tmdbService.getVideoByMovieId(movieId).subscribe((videoMap) => {
      if (videoMap.has("404")) {
        console.log("Error:", videoMap.get("404"));
        this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/404");
      } else {
        const video = videoMap.get("video");
        this.safeVideoUrl = video?.url ? this.sanitizer.bypassSecurityTrustResourceUrl(video.url) : null;
      }
    });
  }

  private loadSerieVideo(serieId: number): void {
    this.tmdbService.getVideoBySerieId(serieId).subscribe((videoMap) => {
      if (videoMap.has("404")) {
        console.log("Error:", videoMap.get("404"));
        this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/404");
      } else {
        const video = videoMap.get("video");
        this.safeVideoUrl = video?.url ? this.sanitizer.bypassSecurityTrustResourceUrl(video.url) : null;
      }
    });
  }

  public sessionId: any;

  toggleWatchList(mediaId: number, mediaType: 'movie' | 'tv', isInWatchlist: boolean) {
    this.tmdbAuthService.markAs(mediaId, mediaType, !isInWatchlist, 'watchlist').subscribe(response => {
      if ([1, 12, 13].includes(response.status_code)) {
        console.log('Watchlist actualizado:', !isInWatchlist);
        mediaType === 'movie' ? this.watchlistMovies.has(mediaId) ? this.watchlistMovies.delete(mediaId) : this.watchlistMovies.add(mediaId)
                              : this.watchlistSeries.has(mediaId) ? this.watchlistSeries.delete(mediaId) : this.watchlistSeries.add(mediaId);
      }
    });
  }

  toggleFavorite(mediaId: number, mediaType: 'movie' | 'tv', isFavorite: boolean) {
    this.tmdbAuthService.markAs(mediaId, mediaType, !isFavorite, 'favorite').subscribe(response => {
      if ([1, 12, 13].includes(response.status_code)) {
        console.log('Favorito actualizado:', !isFavorite);
        mediaType === 'movie' ? this.favoriteMovies.has(mediaId) ? this.favoriteMovies.delete(mediaId) : this.favoriteMovies.add(mediaId)
                              : this.favoriteSeries.has(mediaId) ? this.favoriteSeries.delete(mediaId) : this.favoriteSeries.add(mediaId);
      }
    });
  }

  loadUserData() {
    const sessionId = localStorage.getItem('tmdb_session_id');
    if (!sessionId) {
      console.warn("No hay sesión activa");
      return;
    }
    this.tmdbAuthService.getFavoriteMovies().subscribe(data => this.favoriteMovies = new Set(data.results.map((movie: { id: any; }) => movie.id)));
    this.tmdbAuthService.getFavoriteTVShows().subscribe(data => this.favoriteSeries = new Set(data.results.map((series: { id: any; }) => series.id)));
    this.tmdbAuthService.getWatchlistMovies().subscribe(data => this.watchlistMovies = new Set(data.results.map((movie: { id: any; }) => movie.id)));
    this.tmdbAuthService.getWatchlistTVShows().subscribe(data => this.watchlistSeries = new Set(data.results.map((series: { id: any; }) => series.id)));
  }
  goToSeries(movieId: number): void {
    
  }

  goToMovie(movieId: number): void {

  }
}
