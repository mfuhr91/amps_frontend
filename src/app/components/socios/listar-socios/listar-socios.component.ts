import { Component, OnInit } from '@angular/core';
import { Socio } from 'src/app/interfaces/socios/socio.interface';
import { SociosService } from 'src/app/providers/socios.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-listar-socios',
  templateUrl: './listar-socios.component.html',
  styleUrls: ['./listar-socios.component.scss']
})
export class ListarSociosComponent implements OnInit {

  socios: Socio[] = [];

 
  constructor( private sociosService: SociosService ) { }
  
  ngOnInit(): void {
    
  
    this.getSocios();

    
          

  }

  getSocios(){
    this.sociosService.getSocios().subscribe( res => {this.socios = res; console.log(res);
    });
  }

  borrarSocio(socio: Socio, idx: number){
    console.log(socio.id);
    
    Swal.fire({
      title: `Está seguro que desea eliminar el socio ${socio.apellido}, ${socio.nombre}?`,
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
        this.sociosService.eliminarSocio(socio.id).subscribe( res => {
        
          Swal.fire({
            title: `El socio ${socio.apellido}, ${socio.nombre} se ha eliminado!`,
            icon: 'success',
            confirmButtonText: 'OK',
            buttonsStyling: false,
            customClass: {
              confirmButton: 'btn btn-outline-primary me-1',
            }
          })
          this.getSocios();
        });
      }
    })
  }
}
