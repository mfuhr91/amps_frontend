import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Convenio } from '../interfaces/convenios/convenio.interface';
import { environment } from "../../environments/environment";
import { Categoria } from '../interfaces/convenios/categoria.interface';

@Injectable({
  providedIn: 'root'
})
export class ConveniosService {

private url = `${environment.url}/convenios`;


  constructor( private http: HttpClient ) { }



  getConvenios(): Observable<Convenio[]> {
    return this.http.get<Convenio[]>(this.url);
  }
  getConveniosNoBaja(): Observable<Convenio[]> {
    return this.http.get<Convenio[]>(`${this.url}/todos-no-baja`);
  }

  getConvenio(id: number) {
    return this.http.get<Convenio>(`${this.url}/editar/${id}`);
  }

  crearConvenio( convenio: Convenio ) {
    return this.http.post<Convenio>(`${this.url}/crear`, convenio);
  }
  editarConvenio( convenio: Convenio ) {
    return this.http.put<Convenio>(`${this.url}/editar`, convenio);
  }
  eliminarConvenio( id: number){
    return this.http.delete(`${this.url}/eliminar/${id}`);
  }

  buscarConvenios(param: string): Observable<Convenio[]> {
    return this.http.get<Convenio[]>(`${this.url}/buscar/${param}`)
  }

  buscarConvenioPorUsuario(nombreUsuario: string): Observable<Convenio> {
    return this.http.get<Convenio>(`${this.url}/buscarPorUsuario/${nombreUsuario}`)
  }

  buscarPorCategoria(nombreCategoria: string) {
    return this.http.get<Convenio[]>(`${this.url}/categoria/${nombreCategoria}`);
  }

  contarConvenios(){
    return this.http.get<number>(`${this.url}/contar`);
  }
}
