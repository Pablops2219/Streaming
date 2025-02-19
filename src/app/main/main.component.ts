import { Component } from '@angular/core';
import { Movie, TheMovieDBService } from '../services/the-movie-db.service';
import { NgFor } from '@angular/common';


@Component({
  selector: 'app-main',
  imports: [NgFor],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  movies: any[] = [];
  // id: Número único identificador de la película
  // title: Título de la película
  // overview: Sinopsis o descripción de la película
  // posterUrl: URL del póster de la película
  // backdropUrl: URL de la imagen de fondo
  // releaseDate: Fecha de estreno de la película
  // voteAverage: Promedio de votos
  // voteCount: Cantidad de votos
  // popularity: Nivel de popularidad de la película
  // genreIds: IDs de géneros de la película
  // originalLanguage: Idioma original en el que fue grabada la película
  // originalTitle: Título original de la película
  // adultContent: Indica si el contenido es para adultos (true/false)
  // videoAvailable: Indica si hay un video disponible (true/false)

  constructor(private tmdbService: TheMovieDBService) {}

  movie: any;
  ngOnInit(): void {

    this.tmdbService.getTrendingMovies().subscribe({
      next: (data) => {
        console.log('Películas recomendadas:', data);
    
        const filteredData = data.filter(element => {
          if (!element.title) {
            console.log('No hay título', element.id);
            return false; // Excluir este elemento
          }
          if (!element.overview.trim()) {
            console.log('No hay descripción', element.id);
            return false; // Excluir este elemento
          }
          return true; // Mantener el elemento
        });
    
        this.movies = filteredData; // Asignamos solo las películas filtradas
      },
      error: (err) => console.error('Error al obtener las películas:', err),
    });    

    this.tmdbService.getMovieByID(1667).subscribe({
      next: (data) => {
        console.log('La película:', data);
        this.movie = data;
      },
      error: (err) => console.error('Error:', err),
    });
  }

  viewDetails(movie: Movie): void {
    alert(`Mostrando detalles de "${movie.title}"`);
    // Aquí puedes redirigir a otra página o abrir un modal con los detalles
  }
}
