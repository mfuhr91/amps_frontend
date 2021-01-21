import { Component, OnInit } from '@angular/core';
import { Socio } from 'src/app/interfaces/socios/socio.interface';
import { SociosService } from 'src/app/providers/socios.service';

@Component({
  selector: 'app-socios',
  templateUrl: './socios.component.html',
  styleUrls: ['./socios.component.scss']
})
export class SociosComponent implements OnInit {

  socios: Socio[] = [];

  constructor( private sociosService: SociosService ) { }

  ngOnInit(): void {

    this.sociosService.getSocios().subscribe( res => this.socios = res);
          

  }

}
