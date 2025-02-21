
import { Component } from '@angular/core';
import { TheMovieDBService } from '../services/the-movie-db.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { TmdbAuthService } from '../services/tmdb-auth.service';
import { MovieslidesComponent } from "../movieslides/movieslides.component";
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-watch-now',
  imports: [NgbRatingModule, NgIf, NgClass, RouterModule],
  templateUrl: './watch-now.component.html',
  styleUrl: './watch-now.component.css',
  providers: [NgbRatingConfig],
})
export class WatchNowComponent {
  content:any = [];
  selectedMovie: any = null;
  showVideo: boolean = false;
  safeVideoUrl: SafeResourceUrl | null = null;
  urlSafe: SafeResourceUrl | undefined;
  isMovieSelected: boolean = false;

  // Cambia 'tv' por 'series' aquí
  contentType: 'movie' | 'series' = 'movie'; // Cambia el tipo a 'series'

  watchlistMovies: Set<number> = new Set();
  watchlistSeries: Set<number> = new Set();
  favoriteMovies: Set<number> = new Set();
  favoriteSeries: Set<number> = new Set();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public tmdbService: TheMovieDBService,
    config: NgbRatingConfig,
    private sanitizer: DomSanitizer,
    public tmdbAuthService: TmdbAuthService
  ) {
    config.max = 5;
    config.readonly = true;
  }

  ngOnInit(): void {

    
    this.route.paramMap.subscribe(params => {
      const type = params.get('type'); // Obtiene 'movie' o 'series' de la URL
      this.contentType = type === 'movie' ? 'movie' : 'series'; // Establece el tipo de contenido
  
      const id = params.get('id'); // Obtiene el ID de la película o serie de la URL
      if (id) {
        if (this.contentType === 'movie') {
          this.loadSpecificMovie(+id); // Carga la película específica
          this.loadMovieVideo(+id); 
        } else {
          this.loadSpecificSeries(+id); // Carga la serie específica
          this.loadSerieVideo(+id); 
        }
      }
    });
  

    
    if (localStorage.getItem('tmdb_session_id')) {
      this.loadUserData();
    }

  }
  
  
  
  private loadSpecificSeries(id: number): void {
    this.tmdbService.getSeriesByID(id).subscribe({
      next: (data) => {
        this.selectedMovie = data; // Reutiliza selectedMovie para almacenar tanto películas como series
        console.log('Serie cargada:', this.selectedMovie);
      },
      error: (err) => console.error('Error al obtener serie:', err),
    });
  }
   
  private loadSpecificMovie(id: number): void {
    this.tmdbService.getMovieByID(id).subscribe({
      next: (data) =>{
        this.selectedMovie = data;
        console.log('Serie cargada:', this.selectedMovie);
      },
      error: (err) => console.error('Error al obtener película:', err)
    });
  }

  isInWatchlist(mediaId: number): boolean {
    return this.contentType === 'movie' ? this.watchlistMovies.has(mediaId) : this.watchlistSeries.has(mediaId);
  }
  
  isFavorite(mediaId: number): boolean {
    return this.contentType === 'movie' ? this.favoriteMovies.has(mediaId) : this.favoriteSeries.has(mediaId);
  }
 
  viewDetails(item: any): void {
    // Verifica si el item seleccionado es el mismo que el actual
    if (this.selectedMovie === item) {
      this.clearSelection(); // Si es el mismo, limpia la selección
    } else {
      this.selectedMovie = item; // Selecciona el nuevo item
      this.showVideo = true; // Muestra el video
      //console.log("Item:", item);
      // Verifica el tipo de contenido y carga el video correspondiente
      if (this.contentType === 'movie') {
        this.loadMovieVideo(item.id); // Carga video de la película
      } else {
        this.loadSerieVideo(item.id); // Carga video de la serie
      }
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

  toggleWatchList(mediaId: number) {
    const isInWatchlist = this.isInWatchlist(mediaId);
    this.tmdbAuthService.markAs(mediaId, this.contentType, !isInWatchlist, 'watchlist').subscribe(response => {
      if ([1, 12, 13].includes(response.status_code)) {
        console.log('Watchlist actualizado:', !isInWatchlist);
        this.contentType === 'movie' 
          ? this.watchlistMovies.has(mediaId) 
            ? this.watchlistMovies.delete(mediaId) 
            : this.watchlistMovies.add(mediaId)
          : this.watchlistSeries.has(mediaId) 
            ? this.watchlistSeries.delete(mediaId) 
            : this.watchlistSeries.add(mediaId);
      }
    });
  }
  
  toggleFavorite(mediaId: number) {
    const isFavorite = this.isFavorite(mediaId);
    this.tmdbAuthService.markAs(mediaId, this.contentType, !isFavorite, 'favorite').subscribe(response => {
      if ([1, 12, 13].includes(response.status_code)) {
        console.log('Favorito actualizado:', !isFavorite);
        this.contentType === 'movie' 
          ? this.favoriteMovies.has(mediaId) 
            ? this.favoriteMovies.delete(mediaId) 
            : this.favoriteMovies.add(mediaId)
          : this.favoriteSeries.has(mediaId) 
            ? this.favoriteSeries.delete(mediaId) 
            : this.favoriteSeries.add(mediaId);
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

}
