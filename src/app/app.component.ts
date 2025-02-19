import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NgFor } from '@angular/common';
import { MovieslidesComponent } from "./movieslides/movieslides.component";
import { TheMovieDBService } from './services/the-movie-db.service';
import { MainComponent } from './main/main.component';

@Component({
  selector: 'app-root',
  imports: [FooterComponent, HeaderComponent, RouterOutlet, MovieslidesComponent, MainComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'app';
  constructor(private tmdbService: TheMovieDBService) { }

  // ngOnInit(): void {
  //   this.tmdbService.getAuthentication().subscribe({
  //     next: (data) => console.log('Datos de la API:', data),
  //     error: (err) => console.error('Error en la petición:', err)
  //   });

  // }
}
