import { Routes } from '@angular/router';
import { AuthCallBackComponent } from './auth-call-back/auth-call-back.component';
import { MainComponent } from './main/main.component';
import { FooterComponent } from './footer/footer.component';

export const routes: Routes = [

    { path: 'main', component: MainComponent },
    { path: 'auth-callback', component: AuthCallBackComponent },
    { path: '', component: MainComponent },
];
