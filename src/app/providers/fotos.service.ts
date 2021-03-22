import { HttpClient, HttpParams } from '@angular/common/http';
import { identifierModuleUrl } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { Foto } from '../interfaces/foto.interface';

@Injectable({
  providedIn: 'root'
})
export class FotosService {

private url = `${environment.url}/fotos`;

  

  constructor( private http: HttpClient ) { }

  subirImagen( img: File, tipo: string){

    const formData: FormData = new FormData();
    
    formData.append('foto', img);
    formData.append('tipo', tipo);
  
    
    return this.http.post(`${this.url}/subir_foto`, formData); 

  }

  borrarImagen(tipo: string, id: string, publicId: string){


    let cadena = publicId.split('/');

    let params = {  "tipo": tipo,
                    "idString": id,
                    "org": cadena[0],
                    "folder": cadena[1],
                    "numero": cadena[2]
                  }

    return this.http.delete(`${this.url}/borrar_foto`, { params: params } ); 
  }
}
