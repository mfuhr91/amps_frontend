import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Convenio } from '../interfaces/convenios/convenio.interface';
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ConveniosService {

private url = `${environment.url}/convenios`;


  constructor( private http: HttpClient ) { }



  getConvenios(): Observable<Convenio[]> {
    return this.http.get<Convenio[]>(`${this.url}`);
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
}
