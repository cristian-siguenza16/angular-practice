import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environments';
import { TokenStorageService } from './token-storage.ts';

export interface Token {
  access_token: string,
  expires_in: number,
  refresh_expires_in: number,
  refresh_token: string,
  token_type: string,
  'not-before-policy': number,
  session_state: string,
  scope: string,
}

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private readonly clientId = environment.clientId;
  private readonly clientSecret = environment.clientSecret;
  private readonly urlApi = environment.apiBaseKeycloakUrl;

  constructor (private http: HttpClient, private tokenStorage: TokenStorageService) {}

  public login(username: string, password: string): Observable<Token> {
    const body = new URLSearchParams();
    body.set('client_id', this.clientId);
    body.set('grant_type', 'password');
    body.set('username', username);
    body.set('password', password);
    body.set('client_secret', this.clientSecret);
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json'
    });

    return this.http.post<Token>(
      `${this.urlApi}/token`,
      body.toString(),
      { headers: headers }
    ).pipe(
      tap(response => {
        this.tokenStorage.saveToken(response.access_token);
      })
    );
  }

  public logout(): void {
    this.tokenStorage.signOut()
  }
}
