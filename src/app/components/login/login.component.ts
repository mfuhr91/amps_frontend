
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Rol } from 'src/app/interfaces/rol.interface';
import { Usuario } from 'src/app/interfaces/usuario.interface';
import { LoginUsuario } from 'src/app/models/login-usuario';
import { AuthService } from 'src/app/providers/auth.service';
import { TokenService } from 'src/app/providers/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  
  form: any = {};
  usuario!: LoginUsuario;
  isLogin = false;
  isLoginFail = false;
  roles: string[] = [];
  errorMsg = '';

  constructor(private authService: AuthService, private tokenService: TokenService, private router: Router) { }

  ngOnInit() {
    if(this.isLogin){
      this.router.navigate(['inicio']);
    }
    if (this.tokenService.getToken()) {
      this.isLoginFail = false;
      this.roles = this.tokenService.getAuthorities();
    }

    if(!this.isLogin){
      this.authService.loginUsuario$.emit(undefined);
    }

  }

  login(): void {

    
    this.usuario = new LoginUsuario(this.form.nombreUsuario, this.form.contrasena);
    
    
    
    this.authService.login(this.usuario).subscribe((data: any)=> {
      if(data.authorities[0].authority === 'socio') {
        this.router.navigate(['login']); 
      }else{

        
        this.tokenService.setToken(data.token);
        this.tokenService.setUserName(data.nombreUsuario);
        this.tokenService.setAuthorities(data.authorities);
        
        this.roles = this.tokenService.getAuthorities();
        
        if(this.roles.includes("comercio")){
          this.router.navigate(['/descuentos/crear']);
        }else {
          this.router.navigate(['inicio']);
        }
        let rol = this.roles.find(rol => rol != '');
        this.usuario.rol = rol;
        this.authService.loginUsuario$.emit(this.usuario);
    
        

      }
        
     
    },
      (err: any) => {
      
        this.isLoginFail = true;
        /* this.errorMsg = err.error.message;
        this.authService.loginUsuario$.emit(undefined); */
      }
    );
  }

  

}
