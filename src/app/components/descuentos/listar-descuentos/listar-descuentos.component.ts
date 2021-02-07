import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Descuento } from 'src/app/interfaces/descuentos/descuento.interface';
import { DescuentosService } from 'src/app/providers/descuentos.service';
import { SociosService } from 'src/app/providers/socios.service';
import { VariablesService } from 'src/app/providers/variables.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listar-descuentos',
  templateUrl: './listar-descuentos.component.html',
  styleUrls: ['./listar-descuentos.component.scss']
})
export class ListarDescuentosComponent implements OnInit {

  descuentos: Descuento[] = [];

  valorCuota!: number;

  comision!: number;

  constructor(  private descuentosService: DescuentosService,
                private route: ActivatedRoute,
                private variablesService: VariablesService ) { }

  ngOnInit(): void {

   
    this.getDescuentos();

    this.getVariables();
    
    const { param } = this.route.snapshot.params;

  }

  private getDescuentos(){
    this.descuentosService.getDescuentos().subscribe( res => {  
      this.descuentos = res
    });
  }
  getVariables(){
    this.variablesService.getVariables().subscribe(res => {
    
      this.comision = (res[1].valor / 100) + 1 ;
      
    })
  }
  

  borrarDescuento( descuento: Descuento ) {

    Swal.fire({
      title: `¿Está seguro que desea eliminar el descuento de $${descuento.valorTotal} del socio ${descuento.socio.apellido}, ${descuento.socio.nombre}?`,
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
        if(descuento.id){
          this.descuentosService.eliminarDescuento(descuento.id).subscribe(res => {
          
            Swal.fire({
              title: `El descuento se ha eliminado!`,
              icon: 'success',
              confirmButtonText: 'OK',
              buttonsStyling: false,
              customClass: {
                confirmButton: 'btn btn-outline-primary me-1',
              }
            })
            this.getDescuentos();
          });
        }
      }
    })
    
    
  }

  buscar(param: string){
    if(param.length > 0){
      
    }else {
      
    }
  }
}
