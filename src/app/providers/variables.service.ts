import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Variable } from '../interfaces/variable.interface';

@Injectable({
  providedIn: 'root'
})
export class VariablesService {

  private url = `${environment.url}/variables`;

  constructor( private http: HttpClient ) { }


  getVariables(){
    return this.http.get<Variable[]>(`${this.url}`);
  }
  getVariable(id: number){
    return this.http.get<Variable>(`${this.url}/${id}`);
  }
  
}
