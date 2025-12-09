import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environments';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { TokenStorageService } from './token-storage.ts';

export interface Certification {
  id?: number;
  type: string;
  organization: string;
  acquired_credential: string;
  year: number;
}

export interface PersonDetail {
  id?: number;
  nit: string;
  name: string;
  address: string;
  phone_number: string;
  educational_credentials: Certification[];
}

interface PageableMetadata {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
    sort: { sorted: boolean; unsorted: boolean; empty: boolean; };
}

interface PersonResponse {
    content: PersonDetail[];
    pageable: PageableMetadata;
    size: number;
    totalElements: number;
    totalPages: number;
}

interface PersonsData {
    people: PersonDetail[];
    totalElements: number;
    totalPages: number;
    size: number;
    page: number;
}

@Injectable({
  providedIn: 'root',
})
export class Persons {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor (private http: HttpClient, private tokenStorage: TokenStorageService) {}
  
  public getPersons(
    page: number, 
    size: number, 
    name: string = '', 
    sort: string = 'id'
  ): Observable<PersonsData> {
    const token = this.tokenStorage.getToken();
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', sort);
      
    if (name) {
      params = params.set('name', name);
    }

    return this.http.get<PersonResponse>(`${this.baseUrl}/person`, { 
        params: params,
        headers: headers
    })
      .pipe(
        map(response => ({
            people: response.content,
            totalElements: response.totalElements,
            totalPages: response.totalPages,
            size: response.size,
            page: response.pageable.pageNumber
        } as PersonsData))
      );
  }
}
