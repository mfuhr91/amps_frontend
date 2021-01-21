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
    this.conveniosService.getConvenios().subscribe(res => this.convenios = res );
   }

  ngOnInit(): void {
  }


  borrarConvenio(convenio: Convenio){}
}
