import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as scannerActions from './scanner.actions';
import { mergeMap, map, scan, catchError, switchMap } from 'rxjs/operators';
import { ScannerService } from 'src/app/services/scanner.service';
import { StorageService } from '../../services/storage.service';
import { of } from 'rxjs';
import { FileService } from '../../services/file.service';
import { EmailService } from 'src/app/services/email.service';

@Injectable()
export class ScannerEffects{

  startScanner$ = createEffect(
    () => this.actions$.pipe(
      ofType(scannerActions.StartScanner),
      mergeMap(
        () => this.scannerService.openScanner().pipe(
          map( ({content}) => scannerActions.SuccessScan({scanText: content}) )
        )
      )
    )
  );

  success$ = createEffect(
    () => this.actions$.pipe(
      ofType(scannerActions.SuccessScan),
      mergeMap(
        () => of(scannerActions.StopScanner())
      )
    )
  );

  close$ = createEffect(
    () => this.actions$.pipe(
      ofType(scannerActions.CloseScanner),
      mergeMap(
        () => this.scannerService.closeScanner().pipe(
          map(({close}) => close ? scannerActions.StopScanner() : scannerActions.ErrorScan({error: 'No se pudo cerrar el scanner'}))
        )
      )
    )
  );

  save$ = createEffect(
    () => this.actions$.pipe(
      ofType(scannerActions.SaveHistory),
      mergeMap(
        ({history}) => this.storageService.set('history', history).pipe(
          map( ({status}) => status ? scannerActions.SaveHistorySuccess() : scannerActions.SaveHistoryError({dbError: 'Sucedio un error al guardar'}) )
        )
      )
    )
  );

  init$ = createEffect(
    () => this.actions$.pipe(
      ofType(scannerActions.InitHistory),
      mergeMap(
        () => this.storageService.init().pipe(
          mergeMap(({status}) => {
            if(status){
              return this.storageService.get('history').pipe(
                map(({value}) => scannerActions.InitHistorySuccess({history: value ? value : []})),
                catchError((error) => of(scannerActions.InitHistoryError({dbError: error})))
              );
            }else{
              console.error('La base de datos no fue inicializada corectamente');
              of(scannerActions.InitHistoryError({dbError: 'La base de datos no fue inicializada corectamente'}))
            }
          })
        )
      )
    )
  );

  saveFile$ = createEffect(
    () => this.actions$.pipe(
      ofType(scannerActions.CreatingFile),
      mergeMap(
        ({dataFile, nameFile, typeFile}) => this.fileService.saveFile(dataFile, typeFile, nameFile).pipe(
          map(({path, fileError}) => path ? scannerActions.CreatingFileSuccess({uri: path}) : scannerActions.CreatingFileError({fileError}))
        )
      )
    )
  );

  sendEmail$ = createEffect(
    () => this.actions$.pipe(
      ofType(scannerActions.CreatingFileSuccess),
      mergeMap(
        ({uri}) => of(scannerActions.SendingEmail({uri}))
      )
    )
  );

  emailStatus$ = createEffect(
    () => this.actions$.pipe(
      ofType(scannerActions.SendingEmail),
      mergeMap(
        ({uri}) => this.emailService.sendEmail(uri).pipe(
          map(() => scannerActions.SendingEmailSuccess()),
          catchError((emailError) => of(scannerActions.SendingEmailError({emailError})))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private scannerService: ScannerService,
    private storageService: StorageService,
    private fileService: FileService,
    private emailService: EmailService
  ){}
}
