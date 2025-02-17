import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CarouselComponent, CarouselControlComponent, CarouselIndicatorsComponent, CarouselInnerComponent, CarouselItemComponent, ThemeDirective } from '@coreui/angular';

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
// Datos ficticios para los slides
  slides = [
    {
      title: 'Stranger Things',
      duration: '4 temporadas',
      releaseDate: '2016',
      synopsis: 'Cuando un niño desaparece misteriosamente, sus amigos descubren fuerzas sobrenaturales.',
      src: 'https://placehold.co/600x400'
    },
    {
      title: 'Game of Thrones',
      duration: '8 temporadas',
      releaseDate: '2011',
      synopsis: 'Conspiraciones políticas y batallas épicas en el mundo de Poniente.',
      src: 'https://placehold.co/600x400'
    },
    {
      title: 'Breaking Bad',
      duration: '5 temporadas',
      releaseDate: '2008',
      synopsis: 'Un profesor de química se convierte en un poderoso narcotraficante.',
      src: 'https://placehold.co/600x400'
    }
  ];

  // Manejar el cambio de slide
  onItemChange(event: any): void {
    console.log('Slide cambiado:', event);
    // Aquí puedes agregar lógica adicional si es necesario
  }
}
