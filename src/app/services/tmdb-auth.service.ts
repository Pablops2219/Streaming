import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TmdbAuthService {
  private apiKey: string = '6e87c3c07b000342a50d24e85226247d';
  private apiUrl: string = 'https://api.themoviedb.org/3/authentication';

  constructor(private http: HttpClient, private router: Router) {}

  createRequestToken(): Observable<any> {
    return this.http.get(`${this.apiUrl}/token/new?api_key=${this.apiKey}`);
  }

  createSession(requestToken: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/session/new?api_key=${this.apiKey}`, {
      request_token: requestToken,
    });
  }

  // Iniciar el proceso de autenticación 
  authenticateUser(): void {
    this.createRequestToken().subscribe((response: any) => {
      const requestToken = response.request_token;
      const redirectUrl = encodeURIComponent(
        window.location.origin + '/auth-callback'
      );
      window.location.href = `https://www.themoviedb.org/authenticate/${requestToken}?redirect_to=${redirectUrl}`;
    });
  }

  // Manejar el callback después de autenticación
  handleAuthCallback(requestToken: string): void {
    this.createSession(requestToken).subscribe((response: any) => {
      localStorage.setItem('tmdb_session_id', response.session_id);
      this.router.navigate(['/']); // Redirigir al home u otra página de tu app
    });
  }

  markAsFavorite(
    mediaId: number,
    mediaType: 'movie' | 'tv',
    favorite: boolean
  ): Observable<any> {
    const sessionId = localStorage.getItem('tmdb_session_id');
    const accountId = this.http.get(
      `https://api.themoviedb.org/3/account?api_key=${this.apiKey}&session_id=${sessionId}`
    );
    const url = `https://api.themoviedb.org/3/account/${accountId}/favorite?api_key=${this.apiKey}&session_id=${sessionId}`;

    const body = {
      media_type: mediaType,
      media_id: mediaId,
      favorite: favorite,
    };

    return this.http.post(url, body);
  }

  getFavoriteMovies(): Observable<any> {
    const sessionId = localStorage.getItem('tmdb_session_id');
    const accountId = this.http.get(
      `https://api.themoviedb.org/3/account?api_key=${this.apiKey}&session_id=${sessionId}`
    );
    return this.http.get(
      `https://api.themoviedb.org/3/account/${accountId}/favorite/movies?api_key=${this.apiKey}&session_id=${sessionId}`
    );
  }

  getFavoriteTVShows(): Observable<any> {
    const sessionId = localStorage.getItem('tmdb_session_id');
    const accountId = this.http.get(
      `https://api.themoviedb.org/3/account?api_key=${this.apiKey}&session_id=${sessionId}`
    );
    return this.http.get(
      `https://api.themoviedb.org/3/account/${accountId}/favorite/tv?api_key=${this.apiKey}&session_id=${sessionId}`
    );
  }

  getWatchlistMovies(): Observable<any> {
    const sessionId = localStorage.getItem('tmdb_session_id');
    const accountId = this.http.get(
      `https://api.themoviedb.org/3/account?api_key=${this.apiKey}&session_id=${sessionId}`
    );
    return this.http.get(
      `https://api.themoviedb.org/3/account/${accountId}/watchlist/movies?api_key=${this.apiKey}&session_id=${sessionId}`
    );
  }

  getWatchlistTVShows(): Observable<any> {
    const sessionId = localStorage.getItem('tmdb_session_id');
    const accountId = this.http.get(
      `https://api.themoviedb.org/3/account?api_key=${this.apiKey}&session_id=${sessionId}`
    );
    return this.http.get(
      `https://api.themoviedb.org/3/account/${accountId}/watchlist/tv?api_key=${this.apiKey}&session_id=${sessionId}`
    );
  }

  markAs(
    mediaId: number,
    mediaType: 'movie' | 'series',
    mark: boolean,
    action: 'favorite' | 'watchlist'
  ): Observable<any> {
    const sessionId = localStorage.getItem('tmdb_session_id');
    const accountId = this.http.get(
      `https://api.themoviedb.org/3/account?api_key=${this.apiKey}&session_id=${sessionId}`
    );

    // Cambiar 'series' a 'tv' en la URL
    const adjustedMediaType = mediaType === 'series' ? 'tv' : 'movie';

    const body = {
      media_type: adjustedMediaType,
      media_id: mediaId,
      [action]: mark,
    };

    return this.http.post(
      `https://api.themoviedb.org/3/account/${accountId}/${action}?api_key=${this.apiKey}&session_id=${sessionId}`,
      body
    );
  }

  logout() {
    localStorage.removeItem('tmdb_session_id'); // Elimina cualquier token o datos de sesión
    this.router.navigate(['/main']);
    console.log('Sesión cerrada');
  }
}
