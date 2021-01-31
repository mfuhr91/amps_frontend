import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { UsuariosService } from 'src/app/providers/usuarios.service';

@Component({
  selector: 'app-listar-usuarios',
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.scss']
})
export class ListarUsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];

  constructor( private usuariosService: UsuariosService ) { }

  ngOnInit(): void {

    this.getUsuarios();
  }

  getUsuarios(){
    this.usuariosService.getUsuarios().subscribe(res => {
      
      console.log(res);
      
      this.usuarios = res});
  }

  buscar(param: string) {

  }

  borrarUsuario(usuario: Usuario){
    
  }

}
