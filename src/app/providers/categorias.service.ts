import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from "../interfaces/convenios/categoria.interface";
import { environment } from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private url = `${environment.url}/categorias`;

  constructor( private http: HttpClient ) {}
    
    getCategorias(): Observable<Categoria[]>{
       return this.http.get<Categoria[]>(`${this.url}`);
     }
}
