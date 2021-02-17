import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { UsuariosService } from 'src/app/providers/usuarios.service';
import Swal from 'sweetalert2';

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

      res.splice(0,1); // no muestra el usuario mfuhr en listado
      
      this.usuarios = res});
  }

  buscar(param: string) {
    if(param.length > 0){
      this.usuariosService.buscarUsuarios(param).subscribe(res => this.usuarios = res);
    }else {
     this.getUsuarios(); 
    }
  }

  borrarUsuario(usuario: Usuario){
    Swal.fire({
      title: `¿Está seguro que desea eliminar el socio ${usuario.nombreUsuario}?`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar',
      buttonsStyling: false,
      focusCancel: true,
      reverseButtons: true,
      customClass: {
        cancelButton: 'btn btn-outline-danger me-1',
        confirmButton: 'btn btn-outline-primary ms-1',
      },
    }).then((result) => {
      
      if (result.isConfirmed) {
        this.usuariosService.eliminarUsuario(usuario.id).subscribe( res => {
        
          Swal.fire({
            title: `¡El socio ${usuario.nombreUsuario} se ha eliminado!`,
            icon: 'success',
            confirmButtonText: 'OK',
            buttonsStyling: false,
            customClass: {
              confirmButton: 'btn btn-outline-primary me-1',
            }
          })
          this.getUsuarios();
        },
        (err : any) => {
          console.log(err);
          
          Swal.fire({
            title: `¡El usuario no puede eliminarse! Primero debe eliminar el socio o convenio correspondiente`,
            icon: 'error',
            confirmButtonText: 'OK',
            buttonsStyling: false,
            customClass: {
              confirmButton: 'btn btn-outline-primary me-1',
            }
          })
        });
      }
    })
  }

}
