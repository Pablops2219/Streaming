import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselComponent, CarouselControlComponent, CarouselIndicatorsComponent, CarouselInnerComponent, CarouselItemComponent, ThemeDirective } from '@coreui/angular';
import { TheMovieDBService } from '../services/the-movie-db.service';

@Component({
  selector: 'app-movieslides',
  imports: [
    ThemeDirective,
    CarouselComponent,
    CarouselIndicatorsComponent,
    CarouselInnerComponent,
    NgFor,
    CarouselItemComponent,
    CarouselControlComponent,
    RouterLink,
    CarouselComponent,],
  templateUrl: './movieslides.component.html',
  styleUrl: './movieslides.component.css'
})


export class MovieslidesComponent {
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


  movie: any;

  constructor(private tmdbService: TheMovieDBService) { }

  ngOnInit(): void {

    this.tmdbService.getAuthentication().subscribe({
      next: (data) => console.log('Datos de la API:', data),
      error: (err) => console.error('Error en la petición:', err)
    });

    this.tmdbService.getDiscoverMovies().subscribe({
      next: (data) => {
        console.log('Películas descubiertas:', data);
        this.movies = data; // Asignamos las películas a la variable 'movies'
      },
      error: (err) => console.error('Error al obtener las películas:', err)
    });


    this.tmdbService.getMovieByID(603).subscribe({
      next: (data) => {
        console.log('Detalles de la película:', data);
        this.movie = data;
      },
      error: (err) => console.error('Error:', err)
    });


  }

  // Manejar el cambio de slide
  onItemChange(event: any): void {
    console.log('Slide cambiado:', event);
    // Aquí puedes agregar lógica adicional si es necesario
  }
}
