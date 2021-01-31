import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rol } from '../interfaces/rol.interface';
import { environment } from "../../environments/environment";
import { Usuario } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private url = `${environment.url}/usuarios`;

  

  constructor( private http: HttpClient ) { }


  getRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(`${this.url}/roles`);          
  }

  getRol(id: number): Observable<Rol> {
    return this.http.get<Rol>(`${this.url}/roles/${id}`);
  }

  getUsuarios() {
    return this.http.get<Usuario[]>(`${this.url}`);
  }

  getUsuario(id: number){
    return this.http.get<Usuario>(`${this.url}/editar/${id}`);
  }

  crearUsuario( usuario: Usuario ) {
    return this.http.post<Usuario>(`${this.url}/crear`, usuario);
  }
  editarUsuario( usuario: Usuario ) {
    return this.http.put<Usuario>(`${this.url}/editar`, usuario);
  }
}
