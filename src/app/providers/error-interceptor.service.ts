import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {


  constructor(private tokenService: TokenService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return next.handle(request).pipe(catchError(err => {
          if ([401, 403].includes(err.status) ) {
              // auto logout if 401 or 403 response returned from api
              this.tokenService.logout();
          }
 
          const error = (err && err.error && err.error.message) || err.statusText;
          console.error(err);
          return throwError(error);
      }))
  }
}

export const errorInterceptorProvider = [{provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true}];
