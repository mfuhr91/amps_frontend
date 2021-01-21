import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rol } from '../interfaces/rol.interface';
import { environment } from "../../environments/environment";

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
}
