import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { NgbRating, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { TheMovieDBService } from '../services/the-movie-db.service';
import { TmdbAuthService } from '../services/tmdb-auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuario',
  imports: [CommonModule, NgbRating],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css',
})
export class UsuarioComponent {
  favoriteMovies: any[] = [];
  favoriteSeries: any[] = [];
  watchlistMovies: any[] = [];
  watchlistSeries: any[] = [];

  constructor(
    private router: Router,
    public tmdbService: TheMovieDBService,
    config: NgbRatingConfig,
    private sanitizer: DomSanitizer,
    public tmdbAuthService: TmdbAuthService
  ) {
    config.max = 5;
    config.readonly = true;
  }

  ngOnInit(): void {
    this.loadUserFavorites();
    this.loadUserWatchlist();
  }

  isInWatchlist(mediaId: number): boolean {
    return this.watchlistSeries.some((serie) => serie.id === mediaId);
  }

  isFavorite(mediaId: number): boolean {
    return this.favoriteSeries.some((serie) => serie.id === mediaId);
  }

  isInWatchlistMovie(mediaId: number): boolean {
    return this.watchlistMovies.some((movie) => movie.id === mediaId);
  }

  isFavoriteMovie(mediaId: number): boolean {
    return this.favoriteMovies.some((movie) => movie.id === mediaId);
  }

  toggleWatchList(mediaId: number, isInWatchlist: boolean) {
    this.tmdbAuthService
      .markAs(mediaId, 'series', !isInWatchlist, 'watchlist')
      .subscribe((response) => {
        if ([1, 12, 13].includes(response.status_code)) {
          if (this.isInWatchlist(mediaId)) {
            this.watchlistSeries = this.watchlistSeries.filter(
              (serie) => serie.id !== mediaId
            );
          } else {
            this.watchlistSeries.push({ id: mediaId, name: 'Nombre Temporal' });
          }
        }
      });
  }

  toggleFavorite(mediaId: number, isFavorite: boolean) {
    this.tmdbAuthService
      .markAs(mediaId, 'series', !isFavorite, 'favorite')
      .subscribe((response) => {
        if ([1, 12, 13].includes(response.status_code)) {
          if (this.isFavorite(mediaId)) {
            this.favoriteSeries = this.favoriteSeries.filter(
              (serie) => serie.id !== mediaId
            );
          } else {
            this.favoriteSeries.push({ id: mediaId, name: 'Nombre Temporal' });
          }
        }
      });
  }

  
  
  toggleWatchlistMovie(mediaId: number, isInWatchlist: boolean) {
    this.tmdbAuthService.markAs(mediaId, 'movie', !isInWatchlist, 'watchlist').subscribe((response) => {
      if ([1, 12, 13].includes(response.status_code)) {
        if (this.isInWatchlist(mediaId)) {
          this.watchlistMovies = this.watchlistMovies.filter((movie) => movie.id !== mediaId);
        } else {
          this.watchlistMovies.push({ id: mediaId, title: 'Título Temporal' });
        }
      }
    });
  }

  toggleFavoriteMovie(mediaId: number, isFavorite: boolean) {
    this.tmdbAuthService.markAs(mediaId, 'movie', !isFavorite, 'favorite').subscribe((response) => {
      if ([1, 12, 13].includes(response.status_code)) {
        if (this.isFavorite(mediaId)) {
          this.favoriteMovies = this.favoriteMovies.filter((movie) => movie.id !== mediaId);
        } else {
          this.favoriteMovies.push({ id: mediaId, title: 'Título Temporal' });
        }
      }
    });
  }

  loadUserFavorites() {
    this.tmdbAuthService.getFavoriteMovies().subscribe((data) => {
      this.favoriteMovies = data.results.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        posterUrl: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
        backdropUrl: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average,
        stars: Math.round(movie.vote_average / 2),
        voteCount: movie.vote_count,
        popularity: movie.popularity,
        genreIds: movie.genre_ids,
        originalLanguage: movie.original_language,
        originalTitle: movie.original_title,
        adult: movie.adult,
      }));
    });

    this.tmdbAuthService.getFavoriteTVShows().subscribe((data) => {
      this.favoriteSeries = data.results.map((series: any) => ({
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
        originalName: series.original_name,
        inProduction: series.in_production,
        numberOfSeasons: series.number_of_seasons,
        numberOfEpisodes: series.number_of_episodes,
        networks: series.networks,
      }));
    });
  }

  loadUserWatchlist() {
    this.tmdbAuthService.getWatchlistMovies().subscribe((data) => {
      this.watchlistMovies = data.results.map((movie: any) => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        posterUrl: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
        backdropUrl: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
        releaseDate: movie.release_date,
        voteAverage: movie.vote_average,
        stars: Math.round(movie.vote_average / 2),
        voteCount: movie.vote_count,
        popularity: movie.popularity,
        genreIds: movie.genre_ids,
        originalLanguage: movie.original_language,
        originalTitle: movie.original_title,
        adult: movie.adult,
      }));
    });

    this.tmdbAuthService.getWatchlistTVShows().subscribe((data) => {
      this.watchlistSeries = data.results.map((series: any) => ({
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
        originalName: series.original_name,
        inProduction: series.in_production,
        numberOfSeasons: series.number_of_seasons,
        numberOfEpisodes: series.number_of_episodes,
        networks: series.networks,
      }));
    });
  }

  
}
