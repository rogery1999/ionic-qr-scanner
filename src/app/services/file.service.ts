import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { from, Observable, of } from 'rxjs';
import { catchError, switchMap, mergeMap, map } from 'rxjs/operators';

const qrscanner = 'QRScannerIonic';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor() { }

  prepareDataFile(type: string, data: Registro[]): string {
    let createdFile: string = null;
    switch (type) {
      case 'csv':
        const arrayTemp = [];        const titulos = 'Tipo, Creado en, Texto\n';
        arrayTemp.push(titulos);
        data.forEach(({type, created, text}) => {
          const scanConvert = `${type}, ${created}, ${text.replace(',', ' ')} \n`;
          arrayTemp.push(scanConvert);
        });
        createdFile = arrayTemp.join('')
        break;
      default:
        console.error('tipo de archivo no admitido');
        break;
    }
    return createdFile;
  }

  saveFile(data: Registro[], type: string = 'csv', name: string = 'historialScanner'): Observable<{ path: string, fileError: any}> {
    const path = `${qrscanner}/${name}.${type}`;
    const processedData = this.prepareDataFile(type, data);
    return this.readFile(path).pipe(
      switchMap(() => this.deleteFile(path)),
      switchMap(() => this.writeFile(path, processedData)),
      mergeMap(({uri}) => of({path: uri, fileError: false})),
      catchError((error) => {
        if(error.message === 'File does not exist'){
          return this.createDirectory(qrscanner).pipe(
            switchMap(() => this.writeFile(path, processedData)),
            map(({uri}) => ({path: uri, fileError: false})),
            catchError((error) => {
              if(error.message === 'Directory exists'){
                return this.writeFile(path, processedData).pipe(
                  map(({uri}) => ({path: uri, fileError: false})),
                  catchError((error) => of({path: null, fileError: error}))
                );
              }else{
                return of({path: null, fileError: error});
              }
            })
          );
        }else{
          return of({path: null, fileError: error});
        }
      })
    )
  }

  writeFile(path: string, data: string){
    return from(Filesystem.writeFile({
      path,
      data,
      directory: Directory.Documents,
      encoding: Encoding.UTF8
    }));
  }

  readFile(path: string){
    return from(Filesystem.readFile({
      path,
      directory: Directory.Documents,
      encoding: Encoding.UTF8
    }));
  }

  deleteFile(path: string){
    return from(Filesystem.deleteFile({
      path,
      directory: Directory.Documents
    }));
  }

  createDirectory(path: string){
    return from(Filesystem.mkdir({
      path,
      directory: Directory.Documents
    }));
  }

}
