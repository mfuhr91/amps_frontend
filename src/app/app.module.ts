import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import '@angular/common/locales/global/es';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ComponentsModule } from './components/components.module';
import { HttpClientModule } from "@angular/common/http";
import { interceptorProvider } from './providers/interceptor.service';
import { errorInterceptorProvider } from './providers/error-interceptor.service';








@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ComponentsModule,
    HttpClientModule,
    
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es' }, interceptorProvider, errorInterceptorProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
