import { Component, OnInit } from '@angular/core';
import { ConveniosService } from 'src/app/providers/convenios.service';
import { DescuentosService } from 'src/app/providers/descuentos.service';
import { SociosService } from 'src/app/providers/socios.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  totalConvenios!: number;
  totalSocios!: number;
  totalRecaudado!: number;

  constructor(  private conveniosService: ConveniosService,
                private sociosService: SociosService,
                private descuentosService: DescuentosService ) { }

  ngOnInit(): void {
    this.conveniosService.contarConvenios().subscribe(res => this.totalConvenios = res);
    this.sociosService.contarSocios().subscribe(res => this.totalSocios = res);
    this.descuentosService.sumarTotalRecaudado().subscribe(res => this.totalRecaudado = res);
  }

}
