import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TmdbAuthService } from '../services/tmdb-auth.service';

@Component({
  selector: 'app-auth-call-back',
  imports: [],
  templateUrl: './auth-call-back.component.html',
  styleUrl: './auth-call-back.component.css'
})
export class AuthCallBackComponent implements OnInit{

  constructor(
    private route: ActivatedRoute,
    private authService: TmdbAuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['request_token']) {
        this.authService.handleAuthCallback(params['request_token']);
      } else {
        this.router.navigate(['/']);
      }
    });
  }
}
