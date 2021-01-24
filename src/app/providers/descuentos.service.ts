import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Descuento } from '../interfaces/descuentos/descuento.interface';

@Injectable({
  providedIn: 'root'
})
export class DescuentosService {

  private url = `${environment.url}/descuentos`;


  constructor( private http: HttpClient ) { }

  getDescuentos() {
    return this.http.get<Descuento[]>(`${this.url}`);
  }
}
