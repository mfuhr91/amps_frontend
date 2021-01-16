import { Component, OnInit } from '@angular/core';
import { Socio } from 'src/app/interfaces/socio.interface';
import { SociosService } from 'src/app/providers/socios.service';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.scss']
})
export class ListarComponent implements OnInit {

  socios: Socio[] = [];

  constructor( private sociosService: SociosService ) { }

  ngOnInit(): void {

    this.sociosService.getSocios().subscribe( res => this.socios = res);
          

  }
}
