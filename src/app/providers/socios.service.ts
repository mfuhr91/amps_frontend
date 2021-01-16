import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Socio } from '../interfaces/socio.interface';
import { Observable } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';
import { map, tap } from 'rxjs/operators';
import { TipoDocumento } from '../interfaces/tipo-documento.interface';
import { EstadoCivil } from '../interfaces/estado-civil.interface';
import { Categoria } from '../interfaces/categoria.interface';


@Injectable({
  providedIn: 'root'
})
export class SociosService {

  socio!: Socio;

  formData: FormData = new FormData();

  foto!: WebcamImage;

  socios: Socio[] = [];

  private url = 'http://localhost:8080/socios';

  constructor( private http: HttpClient ) { }



  getSocios(): Observable<Socio[]> {
    return this.http.get<Socio[]>(this.url);          
  }

  getSocio( id: number) {

    return this.http.get<Socio>(`${this.url}/editar/${id}`)
  }

  crearSocio( socio: Socio ) {
    return this.http.post<Socio[]>(`${this.url}/crear`, socio);
  }
  editarSocio( socio: Socio ) {
    return this.http.put<Socio[]>(`${this.url}/editar`, socio);
  }

  getTiposDocumentos(){
    return this.http.get<TipoDocumento[]>(`${this.url}/tipos_docs`);
  }
  getEstadosCiviles(){
    return this.http.get<EstadoCivil[]>(`${this.url}/estados_civiles`);
  }
  getCategorias(){
    return this.http.get<Categoria[]>(`${this.url}/categorias`);
  }


  subirImagen( img: File){
    
      this.formData.append('foto', img)
      
      return this.http.post(`${this.url}/subir_foto`, this.formData); 

  }

  getFoto() {
    return this.foto;
  }


  
}
