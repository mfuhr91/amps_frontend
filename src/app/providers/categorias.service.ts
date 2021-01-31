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

  getCategoria(id: number) {
    return this.http.get<Categoria>(`${this.url}/editar/${id}`);
  }

  crearCategoria( Categoria: Categoria ) {
    return this.http.post<Categoria>(`${this.url}/crear`, Categoria);
  }
  editarCategoria( Categoria: Categoria ) {
    return this.http.put<Categoria>(`${this.url}/editar`, Categoria);
  }
  eliminarCategoria( id: number){
    return this.http.delete(`${this.url}/eliminar/${id}`);
  }

  buscarCategorias(param: string): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.url}/buscar/${param}`)
  }

}
