import { Injectable } from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { from, Observable, of } from 'rxjs';
import { catchError, delay, mergeMap, switchMap } from 'rxjs/operators';
import { Registro } from '../models/registro.model';
import { Browser } from '@capacitor/browser';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  constructor(
    private platform: Platform,
    private navController: NavController,
    private alertController: AlertController
  ) { }

  verifyPermission(): Promise<boolean> {
    if(this.platform.is('ios') ){
      return new Promise((resolve, _)=>{resolve(true)});
    }

    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({force: true});
      if(status.granted){
        resolve(true);
      }else if(status.denied){
        const alert = await  this.alertController.create({
          header: 'Permisos no aceptados',
          message: 'Debe aceptar los permisos para poder usar el escaner',
          buttons: [
            {
              text: 'Aceptar',
              handler: () => {
                resolve(false);
                BarcodeScanner.openAppSettings();
              }
            },
            {
              text: 'Rechazar',
              role: 'cancel',
              handler: () => {
                console.error('Permisos no aceptados');
                resolve(false);
              }
            }
          ]
        });
        await alert.present();
      }else{
        resolve(false);
      }
    });
  }

  closeScanner(): Observable<{close: boolean}>{
    if(this.platform.is('ios')){
      return of({close: true});
    }
    return from(BarcodeScanner.stopScan()).pipe(
      mergeMap(() => of({close: true}) ),
      catchError(() => of({close: false}))
    );
  }

  openScanner(): Observable<{content: string}> {
    if(this.platform.is('ios')){
      return of({content: /*`${Math.random() * 1000} cosa` 'https://www.asus.com/latin/'*/ 'geo:40.73151796986687,-74.06087294062502'}).pipe(
        delay(3000)
      );
    }
    return from(BarcodeScanner.startScan()).pipe(
      switchMap( ({hasContent, content}) => {
        if(hasContent){
          return of({content});
        }
      })
    );
  }

  async openRecord(registro: Registro){
    switch (registro.type) {
      case 'http':
        this.navController.navigateForward(`/tabs/tab2`);
        await Browser.open({
          url: registro.text,
          windowName: '_blank'
        });
        break;
      case 'geo':
        this.navController.navigateForward(`/tabs/tab2/map/${registro.text}`);
        break;
      default:
        console.info('no se puede abrir este tipo en especifico');
        break;
    }
  }
}
