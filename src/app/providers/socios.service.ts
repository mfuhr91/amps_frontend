import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Socio } from '../interfaces/socios/socio.interface';
import { Observable } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';
import { map, tap } from 'rxjs/operators';
import { TipoDocumento } from '../interfaces/socios/tipo-documento.interface';
import { EstadoCivil } from '../interfaces/socios/estado-civil.interface';
import { Tipo } from '../interfaces/socios/tipo.interface';
import { environment } from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class SociosService {

  private url = `${environment.url}/socios`;

  constructor( private http: HttpClient ) { }



  getSociosNoBaja(): Observable<Socio[]> {
    return this.http.get<Socio[]>(`${this.url}/todos-no-baja`);          
  }

  getSocios(): Observable<Socio[]> {
    return this.http.get<Socio[]>(this.url);          
  }

  getSocio( id: number) {

    return this.http.get<Socio>(`${this.url}/editar/${id}`)
  }

  crearSocio( socio: Socio ) {
    return this.http.post<Socio>(`${this.url}/crear`, socio);
  }
  editarSocio( socio: Socio ) {
    return this.http.put<Socio>(`${this.url}/editar`, socio);
  }
  eliminarSocio( id: number){
    return this.http.delete(`${this.url}/eliminar/${id}`);
  }
  confirmarEliminarSocio( id: number){
    return this.http.delete(`${this.url}/confirmar-eliminar/${id}`);
  }

  getTiposDocumentos(){
    return this.http.get<TipoDocumento[]>(`${this.url}/tipos_docs`);
  }
  getEstadosCiviles(){
    return this.http.get<EstadoCivil[]>(`${this.url}/estados_civiles`);
  }

  getTipos(): Observable<Tipo[]>{
    return this.http.get<Tipo[]>(`${this.url}/tipos`);
  }

  buscarSocios(param: string): Observable<Socio[]> {
    return this.http.get<Socio[]>(`${this.url}/buscar/${param}`)
  }
  buscarSocioPorDoc(param: string): Observable<Socio> {
    return this.http.get<Socio>(`${this.url}/buscarPorDoc/${param}`)
  }

  contarSocios(){
    return this.http.get<number>(`${this.url}/contar`);
  }

  exportarXLS(){
    return this.http.get(`${this.url}/exportar`,
    {
      responseType: 'blob',
    });
  }
  
}
