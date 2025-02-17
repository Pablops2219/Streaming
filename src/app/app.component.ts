import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NgFor } from '@angular/common';
import { MovieslidesComponent } from "./movieslides/movieslides.component";

@Component({
  selector: 'app-root',
  imports: [FooterComponent, HeaderComponent, RouterOutlet, MovieslidesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'app';
}
