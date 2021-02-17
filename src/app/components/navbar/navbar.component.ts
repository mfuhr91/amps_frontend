
import { resolve } from '@angular/compiler-cli/src/ngtsc/file_system';
import { AfterViewChecked, Component, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Convenio } from 'src/app/interfaces/convenios/convenio.interface';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { LoginUsuario } from 'src/app/models/login-usuario';
import { AuthService } from 'src/app/providers/auth.service';
import { ConveniosService } from 'src/app/providers/convenios.service';
import { TokenService } from 'src/app/providers/token.service';
import { UsuariosService } from 'src/app/providers/usuarios.service';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{


  usuario!: Usuario;
  convenio!: Convenio;
  loginUsuario!: LoginUsuario;
  rolComercio = false;
  rol = '';
  nombreUsuario: string | null = '';

  

  constructor(  private tokenService: TokenService,
                private router: Router,
                private authService: AuthService,
                private usuariosService: UsuariosService,
                private conveniosService: ConveniosService ) { 

                  
                  
  }
  
  
 

  ngOnInit(): void {

    /* this.isLogin = this.authService.isLogin; */
  
  
    this.authService.loginUsuario$.subscribe((res : LoginUsuario) => {

      this.loginUsuario = res;
      if(res){
        if( res.rol == 'comercio'){
          this.rolComercio = true;
        }else {
          this.rolComercio = false;
        }
      }
    }); 
    this.rol = this.tokenService.getAuthorities()[0];
  

    this.nombreUsuario = this.tokenService.getUserName();

    if(this.rol === 'comercio'){
      this.rolComercio = true;
    }else {
      this.rolComercio = false;
    }5
    
    
  }

  logout(): void {
  
    this.tokenService.logout();
    this.router.navigate(['login']);
    this.rol = '';
    this.loginUsuario = {nombreUsuario : '', contrasena: ''};
    
  }

}
