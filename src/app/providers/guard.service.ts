import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {

  constructor(private tokenService: TokenService, private router: Router, private location: Location) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRol = route.data.expectedRol;
    const roles = this.tokenService.getAuthorities();
  
    if (!this.tokenService.getToken()) {
      this.router.navigate(['login']);
      return false;
    } else if(expectedRol.indexOf(roles.toString()) === -1){
      return false;
    }
    return true;
  }

  
}
