import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import {
  CarouselComponent,
  CarouselControlComponent,
  CarouselIndicatorsComponent,
  CarouselInnerComponent,
  CarouselItemComponent,
  ThemeDirective,
} from '@coreui/angular';
import { TheMovieDBService } from '../services/the-movie-db.service';
import {
  NgbCarouselConfig,
  NgbCarouselModule,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-movieslides',
  imports: [ RouterModule, NgFor, NgbCarouselModule],
  templateUrl: './movieslides.component.html',
  styleUrl: './movieslides.component.css',
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
  

  constructor(
    private router: Router,
    public tmdbService: TheMovieDBService,
    config: NgbCarouselConfig
  ) {
    config.interval = 7000;
    config.wrap = false;
    config.showNavigationArrows = false;
    config.showNavigationIndicators = false;
  }

  ngOnInit(): void {
    this.tmdbService.getAuthentication().subscribe({
      //next: (data) => console.log('Datos de la API:', data),
      error: (err) => console.error('Error en la petición:', err),
    });

    this.tmdbService.getTrendingMovies('day').subscribe({
      next: (data) => {
        //console.log('Películas recomendadas:', data);

        // Filtrar las películas usando el servicio
        this.tmdbService.filterMoviesByMissingData('both', data).subscribe({
          next: (filteredData) => {
            //console.log('Películas recomendadas y filtradas:', filteredData);
            this.movies = filteredData; // Asignar las películas filtradas
          },
          error: (err) => console.error('Error al filtrar las películas:', err),
        });
      },
      error: (err) => console.error('Error al obtener las películas:', err),
    });
  }

  // Manejar el cambio de slide
  onItemChange(event: any): void {
    console.log('Slide cambiado:', event);
    // Aquí puedes agregar lógica adicional si es necesario
  }

}
