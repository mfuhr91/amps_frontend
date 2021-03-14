import { Component, OnInit } from '@angular/core';
import { saveAs as fileSaver } from 'file-saver';
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
    this.sociosService.getSocios().subscribe( res => this.socios = res);
  }

  buscar(param: string){
    
    if(param.length > 0){
      this.sociosService.buscarSocios(param).subscribe(res => this.socios = res);
    }else {
     this.getSocios(); 
    }
  }

  exportarXLS() {

    var downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);
    /* downloadLink.cl('display', 'none'); */
    this.sociosService.exportarXLS().subscribe( res => {

      let blob: any = res;
      
      const url = window.URL.createObjectURL(blob);
			fileSaver(blob, `socios.xls`);

    });
    
  }

  borrarSocio(socio: Socio){
    Swal.fire({
      title: `¿Está seguro que desea eliminar el socio ${socio.apellido}, ${socio.nombre}?`,
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
