import { Component, OnInit } from '@angular/core';

import { Descuento } from 'src/app/interfaces/descuentos/descuento.interface';
import { DescuentosService } from 'src/app/providers/descuentos.service';

@Component({
  selector: 'app-listar-descuentos',
  templateUrl: './listar-descuentos.component.html',
  styleUrls: ['./listar-descuentos.component.scss']
})
export class ListarDescuentosComponent implements OnInit {

  descuentos: Descuento[] = [];

  constructor( private descuentosService: DescuentosService ) { }

  ngOnInit(): void {
    this.getDescuentos();
  }

  private getDescuentos(){
    this.descuentosService.getDescuentos().subscribe( res => console.log(res));
  }
  

  borrarDescuento(descuento: Descuento) {
    console.log('borrado');
    
  }
}
