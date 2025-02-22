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

  public isAuthenticated: boolean = false;


  constructor(
    private tmdbAuthService: TmdbAuthService,
    private route: ActivatedRoute
  ) { }

  private intervalId: any;
  count = 1;


  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId); // Evita fugas de memoria
    }
  }

  ngOnInit() {

    this.intervalId = setInterval(() => {
      console.log(`Valor: ${this.isAuthenticated}`);
      this.count++;
      localStorage.getItem('tmdb_session_id')!==null?this.isAuthenticated=true:this.isAuthenticated=false;
    }, 1000);

    this.route.queryParams.subscribe(params => {
      if (params['request_token']) {
        this.tmdbAuthService.handleAuthCallback(params['request_token'])
        this.isAuthenticated = true; // Actualizar autenticación después del login

      }
    });

  }

  logout() {
    this.isAuthenticated = false;
  }

  loginWithTMDB() {
    this.tmdbAuthService.authenticateUser();
  }
}
