import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenStorageService } from './token-storage.ts';
import { Observable } from 'rxjs';
import { PersonDetail } from './persons';


@Injectable({
  providedIn: 'root',
})
export class PersonService {

  private readonly baseUrl = environment.apiBaseUrl;

  constructor (private http: HttpClient, private tokenStorage: TokenStorageService) {}
  
  public getPerson(id: number): Observable<PersonDetail> {
    const token = this.tokenStorage.getToken();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get<PersonDetail>(`${this.baseUrl}/person/${id}`, { 
        headers: headers
    })
  }

  public createPerson(body: PersonDetail): Observable<PersonDetail> {
    const token = this.tokenStorage.getToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return this.http.post<PersonDetail>(
        `${this.baseUrl}/person`,
        body,
        { headers: headers }
    );
  }

  public updatePerson(id: number, body: PersonDetail): Observable<PersonDetail> {
    const token = this.tokenStorage.getToken();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.put<PersonDetail>(`${this.baseUrl}/person/${id}`, 
      body,
      { headers: headers, }
    );
  }

  public deletePerson(id: number): Observable<PersonDetail> {
    const token = this.tokenStorage.getToken();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.delete<PersonDetail>(`${this.baseUrl}/person/${id}`, { 
        headers: headers
    })
  }
}
