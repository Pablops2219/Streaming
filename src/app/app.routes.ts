import { Routes } from '@angular/router';
import { AuthCallBackComponent } from './auth-call-back/auth-call-back.component';
import { MainComponent } from './main/main.component';
import { FooterComponent } from './footer/footer.component';
import { SeriesComponent } from './series/series.component';
import { PeliculasComponent } from './peliculas/peliculas.component';

export const routes: Routes = [

    { path: '', component: MainComponent },
    { path: 'main', component: MainComponent },
    { path: 'series', component: SeriesComponent },
    { path: 'peliculas', component: PeliculasComponent },
    { path: 'auth-callback', component: AuthCallBackComponent },
];
