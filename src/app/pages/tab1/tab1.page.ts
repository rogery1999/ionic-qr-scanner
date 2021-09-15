import { Component, OnDestroy, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { AlertController, IonRouterOutlet, Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from '../../state/app.model';
import * as scannerActions from '../../state/scanner/scanner.actions';
import { ScannerService } from '../../services/scanner.service';
import { Registro } from '../../models/registro.model';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnDestroy {

  scanning: boolean;
  scannerSubscription: Subscription;

  constructor(
    private platform: Platform,
    private routerOutlet: IonRouterOutlet,
    private alertCtrl: AlertController,
    private store: Store<AppState>,
    private scannerService: ScannerService
  ) {
    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      if(this.scanning){
        this.store.dispatch(scannerActions.CloseScanner())
      }else{
        processNextHandler();
      }
    });
    this.platform.backButton.subscribeWithPriority(-1, async () => {
      if(!this.routerOutlet.canGoBack()){
        await this.showAlertlExit();
      }
    });
  }

  ngOnInit(): void {
    this.scannerSubscription = this.store.select('scanner').subscribe(
      ({scanning, scannerResult}) => {
        this.scanning = scanning;
        if(scannerResult){
          this.scannerService.openRecord({...scannerResult} as Registro);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.scannerSubscription.unsubscribe();
  }

  async startScan() {
    const allowed = await this.scannerService.verifyPermission();
    if(allowed){
      this.store.dispatch( scannerActions.StartScanner());
    }
  };

  async showAlertlExit(){
    const alert = await this.alertCtrl.create({
      header: 'App Exit',
      message: '¿Are you sure that you want to exit?',
      buttons: [
        {
          text: 'Stay',
          role: 'cancel'
        },
        {
          text: 'Exit',
          role: 'destructive',
          handler: () => {
            console.log('Salir de la app');
            App.exitApp();
          }
        }
      ]
    });
    alert.present();
  }

  closeScanner(){
    this.store.dispatch(scannerActions.StopScanner());
  }

}
