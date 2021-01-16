import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Localidad } from '../interfaces/localidad.interface';

@Injectable({
  providedIn: 'root'
})
export class LocalidadesService {

  private url = 'http://localhost:8080/localidades';

  constructor( private http: HttpClient ) { }


  getLocalidades() {
     return this.http.get<Localidad[]>(this.url);
  }
}
