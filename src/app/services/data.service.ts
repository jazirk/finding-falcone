import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Planet} from '../models/planet.model';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Vehicle} from '../models/vehicle.model';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {
  }

  getPlanets(): Observable<Planet[]> {
    return this.http.get<Planet[]>('planets')
      .pipe(
        map(response => {
          return response;
        }),
        catchError(_ => {
          return new Observable<Planet[]>(observer => {
            observer.next([
              {'name': 'Donlon', 'distance': 100},
              {'name': 'Enchai', 'distance': 200},
              {'name': 'Jebing', 'distance': 300},
              {'name': 'Sapir', 'distance': 400},
              {'name': 'Lerbin', 'distance': 500},
              {'name': 'Pingasor', 'distance': 600}
            ]);
            observer.complete();
          });
        })
      );
  }

  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>('vehicles')
      .pipe(
        map(response => {
          return response;
        }),
        catchError(_ => {
          return new Observable<Vehicle[]>(observer => {
            observer.next([
              {'name': 'Space pod', 'total_no': 2, 'max_distance': 200, 'speed': 2},
              {'name': 'Space rocket', 'total_no': 1, 'max_distance': 300, 'speed': 4},
              {'name': 'Space shuttle', 'total_no': 1, 'max_distance': 400, 'speed': 5},
              {'name': 'Space ship', 'total_no': 2, 'max_distance': 600, 'speed': 10}
            ]);
            observer.complete();
          });
        })
      );
  }

  getToken(): Observable<any> {
    return this.http.post('token', null);
  }

  findFalcone(body): Observable<any> {

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      })
    };

    return this.http.post('token', body, httpOptions);
  }
}
