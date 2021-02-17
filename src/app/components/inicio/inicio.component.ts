import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/providers/auth.service';
import { ConveniosService } from 'src/app/providers/convenios.service';
import { DescuentosService } from 'src/app/providers/descuentos.service';
import { SociosService } from 'src/app/providers/socios.service';
import { TokenService } from 'src/app/providers/token.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  totalConvenios!: number;
  totalSocios!: number;
  totalRecaudado!: number;
  info: any = {};

  constructor(  private conveniosService: ConveniosService,
                private sociosService: SociosService,
                private descuentosService: DescuentosService,
                private tokenService: TokenService,
                private auth: AuthService) { }

  ngOnInit(): void {
    this.conveniosService.contarConvenios().subscribe(res => this.totalConvenios = res);
    this.sociosService.contarSocios().subscribe(res => this.totalSocios = res);
    this.descuentosService.sumarTotalRecaudado().subscribe(res => this.totalRecaudado = res);

    this.info = {
      token: this.tokenService.getToken(),
      nombreUsuario: this.tokenService.getUserName(),
      authorities: this.tokenService.getAuthorities()
    };
   
  }

}
