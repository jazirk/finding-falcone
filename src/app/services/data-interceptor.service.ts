import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataInterceptorService implements HttpInterceptor {

  constructor() {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.includes('assets')) {
      req = req.clone({
        url: `${environment.apiUrl}/${req.url}`
      });
    }
    return next.handle(req).pipe(
      catchError(error => {
        if (error.status === 401 || error.status === 403) {
          // handle error
        }
        return throwError(error);
      })
    );
  }
}
