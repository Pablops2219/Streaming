import { Component } from '@angular/core';
import { TmdbAuthService } from '../services/tmdb-auth.service';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { FooterComponent } from '@coreui/angular';
import { CommonModule, NgIf } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  imports: [RouterLink, RouterModule, NgIf,CommonModule, NgbDropdownModule],
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  isAuthenticated: boolean = !!localStorage.getItem('tmdb_session_id');


  constructor(
    private tmdbAuthService: TmdbAuthService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['request_token']) {
        this.tmdbAuthService.handleAuthCallback(params['request_token'])
        this.isAuthenticated = true; // Actualizar autenticación después del login

      }
    });

    const sessionId = localStorage.getItem('tmdb_session_id');
    if (sessionId) {
      
      this.isAuthenticated = true;
    }

  }

  loginWithTMDB() {
    this.tmdbAuthService.authenticateUser();
  }
}
