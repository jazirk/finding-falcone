import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavigateService {
  resetSubject = new Subject();
  constructor() { }
}
