import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {GalaxyComponent} from './components/galaxy/galaxy.component';
import {ResultComponent} from './components/result/result.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {DataInterceptorService} from './services/data-interceptor.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {DataService} from './services/data.service';
import {NavigateService} from './services/navigate.service';

@NgModule({
  declarations: [
    AppComponent,
    GalaxyComponent,
    ResultComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: DataInterceptorService, multi: true}, DataService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
