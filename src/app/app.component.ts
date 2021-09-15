import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AppState } from './state/app.model';
import * as scannerActions from './state/scanner/scanner.actions';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(
    public platform: Platform,
    private store: Store<AppState>,
  ) {
    this.platform.ready().then((readySource) => {
      // Platform now ready, execute any required native code
      console.log('Platform ready from', readySource);
    });
    this.store.dispatch(scannerActions.InitHistory());
  }
}
