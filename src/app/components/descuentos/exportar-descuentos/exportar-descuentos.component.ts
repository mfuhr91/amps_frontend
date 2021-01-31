import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { elementAt } from 'rxjs/operators';
import { Descuento } from 'src/app/interfaces/descuentos/descuento.interface';
import { Item } from 'src/app/interfaces/descuentos/item.interface';
import { Socio } from 'src/app/interfaces/socios/socio.interface';
import { Variable } from 'src/app/interfaces/variable.interface';
import { DescuentosService } from 'src/app/providers/descuentos.service';
import { SociosService } from 'src/app/providers/socios.service';
import { VariablesService } from 'src/app/providers/variables.service';

@Component({
  selector: 'app-exportar-descuentos',
  templateUrl: './exportar-descuentos.component.html',
  styleUrls: ['./exportar-descuentos.component.scss']
})
export class ExportarDescuentosComponent implements OnInit {

  descuentos: Descuento[] = [];

  socio!: Socio;

  items: Item[] = [];

  variables: Variable[] = [];

  cuotaSocial!: number;

  comision!: number;

  subTotal!: number;
  
  total!: number;

  fechaHoy = new DatePipe('es').transform(new Date(), 'dd-MM-yyyy');

  hoy = new Date;

  fechaCierre!: Date;

  diaCierre!: string;

  constructor(  private descuentosService: DescuentosService,
                private variablesService: VariablesService,
                private sociosService: SociosService,
                private location: Location ) { }

  ngOnInit(): void {
    this.getVariables();
    console.log(this.hoy);
    
    
    
    
  }

  getVariables(){
    this.variablesService.getVariables().subscribe(res => {
      this.diaCierre = res[2].valor.toString();
      console.log(this.fechaHoy);
      let arr = this.fechaHoy?.split('-');
      console.log(arr);
      arr?.splice(0,1, this.diaCierre);
      console.log(arr);
      if(arr){

        this.fechaCierre = new Date(Date.parse(arr.reverse().join('/')));
      }

      if(this.hoy?.getTime() > this.fechaCierre?.getTime()){
        console.log('fecha cierre menor');
        
      }

      console.log(arr?.join('-'));
      console.log(this.fechaCierre);
      

      console.log(res);
      this.variables = res;
      this.variables;
      this.cuotaSocial = this.variables[0].valor;
      this.comision = (this.variables[1].valor / 100) + 1 ;
      console.log(this.cuotaSocial);
      console.log(this.comision);
      
    })
  }

  liquidarCuotaSocial(){

  }

  buscar(param: string){
    let arreglo = param.split('/');
    arreglo.reverse();
    param = arreglo.join('-');
    
    this.items = [];
    this.descuentosService.getDescuentosDelMes(param).subscribe(res => {
      
  
      let arreglo: Item[] = [];
      
      
      res.forEach(descuento => {
        console.log(descuento.items);

       
        descuento.items.forEach(element => {
            element.descuento = descuento;

            console.log(element);
            arreglo.push(element);

            
            
          });
          
          
        });

        this.items = arreglo;
        console.log(this.items);

        let subtotal = 0;
        let total = 0;
        this.items.forEach(element => {
          
          subtotal += element.valorSubTotal;
          total += element.valorTotal;
          
        });
        this.subTotal = subtotal;
        this.total = total;
    });

      
        
    
  }

  volver(){

    this.location.back();
  }

}
