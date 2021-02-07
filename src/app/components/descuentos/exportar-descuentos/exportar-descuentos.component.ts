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
import * as fileSaver from 'file-saver';


@Component({
  selector: 'app-exportar-descuentos',
  templateUrl: './exportar-descuentos.component.html',
  styleUrls: ['./exportar-descuentos.component.scss']
})
export class ExportarDescuentosComponent implements OnInit {

  descuentos: Descuento[] = [];

  socio!: Socio;

  items: Item[] = [];

  itemsListados: boolean = false;

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
    
  }

  exportar( param: string ) {
    let arreglo = param.split('/');
    arreglo.reverse();
    param = arreglo.join('-');
    var downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);
    /* downloadLink.cl('display', 'none'); */
    this.descuentosService.exportar(param).subscribe( res => {

      let blob: any = res;

      let fecha = this.fechaHoy?.toString().replace("-", "").replace("-", "");

      const url= window.URL.createObjectURL(blob);
			//window.open(url);
			//window.location.href = url;
			fileSaver.saveAs(blob, `126-${fecha}.prn`);
    

    
    
    
    })

    
  }

  getVariables(){
    this.variablesService.getVariables().subscribe(res => {

      let variables: Variable[] = res;
      this.diaCierre = res[2].valor.toString();

      let arr = this.fechaHoy?.split('-');
      arr?.splice(0,1, this.diaCierre);
      if(arr){

        this.fechaCierre = new Date(Date.parse(arr.reverse().join('/')));
      }

    

     /*  console.log(arr?.join('-')); */
      
    
      this.cuotaSocial = variables[0].valor;
      this.comision = (variables[1].valor / 100) + 1 ;
     
      
    })
  }

  buscar(param: string){

    if(param){

      let arreglo = param.split('/');
      arreglo.reverse();
      param = arreglo.join('-');
      
      this.items = [];
      this.descuentosService.getDescuentosDelMes(param).subscribe(res => {
        
    
        let arreglo: Item[] = [];
        
        
        res.forEach(descuento => {

          descuento.items.forEach(element => {
              element.descuento = descuento;
              arreglo.push(element);
          });
            
            
        });
  
        this.items = arreglo;
        

        let subtotal = 0;
        let total = 0;
        this.items.forEach(element => {
          
          subtotal += element.valorSubTotal;
          total += element.valorTotal;
          
        });
        this.subTotal = subtotal;
        this.total = total;
        if(res.length > 0){
          this.itemsListados = true;
        }
      });
    }

      
        
    
  }

  escribiendo(){
    this.itemsListados = false;
  }

  volver(){

    this.location.back();
  }


}
