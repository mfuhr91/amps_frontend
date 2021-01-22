import { Component, OnInit } from '@angular/core';
import { Convenio } from 'src/app/interfaces/convenios/convenio.interface';
import { ConveniosService } from 'src/app/providers/convenios.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-listar-convenios',
  templateUrl: './listar-convenios.component.html',
  styleUrls: ['./listar-convenios.component.scss']
})
export class ListarConveniosComponent implements OnInit {

  convenios: Convenio[] = [];

  convenio!: Convenio;

  constructor(private conveniosService: ConveniosService ) {
    
   }

  ngOnInit(): void {
    this.getConvenios();
  }

  getConvenios(){
    this.conveniosService.getConvenios().subscribe(res => this.convenios = res );
  }


  borrarConvenio(convenio: Convenio){
    Swal.fire({
      title: `Está seguro que desea eliminar el convenio con ${convenio.nombre}?`,
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
        
        this.conveniosService.eliminarConvenio(convenio.id).subscribe( res => {
        
          Swal.fire({
            title: `El convenio ${convenio.nombre} se ha eliminado!`,
            icon: 'success',
            confirmButtonText: 'OK',
            buttonsStyling: false,
            customClass: {
              confirmButton: 'btn btn-outline-primary me-1',
            }
          })
          this.getConvenios();
        });
      }
    })
  }
}
