import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Drivers } from '@ionic/storage';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { appEffects } from './state';
import { appReducers } from './state/app.reducer';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot({
      name: '__mydb',
      driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
    }),
    AppRoutingModule,
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot(appEffects),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production
    })
  ],
  providers: [
    EmailComposer,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
