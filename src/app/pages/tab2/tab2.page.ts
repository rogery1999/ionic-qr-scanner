import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../state/app.model';
import { Subscription } from 'rxjs';
import { Registro } from '../../models/registro.model';
import * as scannerActions from '../../state/scanner/scanner.actions';
import { ToastController } from '@ionic/angular';
import { ScannerService } from '../../services/scanner.service';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit, OnDestroy {

  history: Registro[] = [];
  scannerSubscription: Subscription;
  saving: boolean = false;

  constructor(
    private store: Store<AppState>,
    public toastController: ToastController,
    private scannerService: ScannerService,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.scannerSubscription = this.store.select('scanner').subscribe(
      ({history, dbLoading}) => {
        this.history = [...history];
        this.saving = dbLoading;
        if(dbLoading){
          this.showToast();
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.scannerSubscription.unsubscribe();
  }

  enviarCorreo() {
    this.store.dispatch(scannerActions.CreatingFile({dataFile: this.history}))
  }

  abrirRegistro(registro: Registro) {
    this.scannerService.openRecord(registro);
  }

  guardarHistorial(){
    this.store.dispatch(scannerActions.SaveHistory({history: this.history}))
  }

  async showToast(){
    const toast = await this.toastController.create({
      message: 'Guardando historial',
      duration: 2000
    });
    toast.present();
  }
}
