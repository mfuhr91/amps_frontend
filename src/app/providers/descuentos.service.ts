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

  crearDescuento( descuento: Descuento ) {
    return this.http.post<Descuento>(`${this.url}/crear`, descuento);
  }

  getDescuentosDelMes(mes: string){
    return this.http.get<Descuento[]>(`${this.url}/liquidar/${mes}`);
  }

  getDescuento( id: number ) {
    return this.http.get<Descuento>(`${this.url}/editar/${id}`);
  }

  editarDescuento( descuento: Descuento ) {
    return this.http.put<Descuento>(`${this.url}/editar`, descuento);
  }
  eliminarDescuento( id: number){
    return this.http.delete(`${this.url}/eliminar/${id}`);
  }

  sumarTotalRecaudado(){
    return this.http.get<number>(`${this.url}/total`);
  }
  sumarTotalRecaudadoMes(){
    return this.http.get<number>(`${this.url}/totalMes`);
  }

  exportar(mes: string){
    return this.http.get(`${this.url}/descargar/${mes}`,
    {
      responseType: 'blob',
    });
  }
  exportarXLSX(mes: string){
    return this.http.get(`${this.url}/exportar/${mes}`,
    {
      responseType: 'blob',
    });
  }
}
