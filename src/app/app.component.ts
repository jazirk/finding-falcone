import {Component, EventEmitter, Output} from '@angular/core';
import {NavigateService} from './services/navigate.service';

@Component({
  selector: 'ff-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'findTheFalcon';

  constructor(private navigateService: NavigateService) {
  }

  reset() {
    this.navigateService.resetSubject.next(true);
  }
}
