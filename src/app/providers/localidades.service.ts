import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Localidad } from '../interfaces/localidad.interface';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LocalidadesService {

  private url = `${environment.url}/localidades`;


  constructor( private http: HttpClient ) { }


  getLocalidades() {
     return this.http.get<Localidad[]>(this.url);
  }
}
