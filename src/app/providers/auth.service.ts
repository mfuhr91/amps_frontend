import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../interfaces/usuario.interface';
import { JwtModel } from '../models/jwt-model';
import { LoginUsuario } from '../models/login-usuario';
import { UsuariosService } from './usuarios.service';

const cabecera = {headers: new HttpHeaders({'Content-Type': 'application/json'})};

@Injectable({
  providedIn: 'root'
})
export class AuthService { 
  

  loginUsuario$ = new EventEmitter<LoginUsuario>();

  private url = `${environment.url}/login`;

  constructor(  private httpClient: HttpClient ) { }

  public login(usuario: LoginUsuario): Observable<JwtModel> {
    return this.httpClient.post<JwtModel>(this.url, usuario, cabecera);
  }

}
