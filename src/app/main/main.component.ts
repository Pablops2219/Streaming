import { Component } from '@angular/core';
import { TheMovieDBService } from '../services/the-movie-db.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgbRatingConfig, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-main',
  imports: [NgFor, NgbRatingModule, NgIf, NgClass],
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

  constructor(
    private tmdbService: TheMovieDBService,
    config: NgbRatingConfig,
    private sanitizer: DomSanitizer
  ) {
    config.max = 5;
    config.readonly = true;
  }

  ngOnInit(): void {
    this.loadTrendingMovies();
    this.loadTrendingSeries();
    this.loadSpecificMovie(762509);
  }

  private loadTrendingMovies(): void {
    this.tmdbService.getTrendingMovies().subscribe({
      next: (data) => {
        this.tmdbService.filterMoviesByMissingData('title', data).subscribe({
          next: (filteredData) => {
            this.movies = filteredData;
            // this.movies.forEach((movie) => {
            //   console.log(movie.stars);
            // });
          },
          error: (err) => console.error('Error al filtrar películas:', err),
        });
      },
      error: (err) => console.error('Error al obtener películas:', err),
    });
  }

  private loadTrendingSeries(): void {
    this.tmdbService.getTrendingSeries().subscribe({
      next: (data) => (this.series = data),
      error: (err) => console.error('Error al obtener series:', err),
    });
  }

  private loadSpecificMovie(id: number): void {
    this.tmdbService.getMovieByID(id).subscribe({
      next: (data) => (this.selectedMovie = data),
      error: (err) => console.error('Error al obtener película:', err),
    });
  }

  viewDetails(movie: any): void {
    if (this.selectedMovie === movie) {
      this.clearSelection();
    } else {
      this.selectedMovie = movie;
      this.showVideo = true;
      this.loadMovieVideo(movie.id);
    }
  }

  private clearSelection(): void {
    this.selectedMovie = null;
    this.showVideo = false;
    this.safeVideoUrl = null;
  }

  private loadMovieVideo(movieId: number): void {
    this.tmdbService.getVideoByMovieId(movieId).subscribe((videoMap) => {
      if (videoMap.has("404")) {
        console.log("Error:", videoMap.get("404"));
        this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/404");
      } else {
        const video = videoMap.get("video");
        //console.log("Video encontrado:", video);
        this.safeVideoUrl = video?.url
          ? this.sanitizer.bypassSecurityTrustResourceUrl(video.url)
          : null;
      }
    });
  }
  
}
