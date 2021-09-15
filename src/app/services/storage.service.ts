import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { from, Observable, of } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storage: Storage | null = null;

  constructor(
    private storage: Storage
  ) {}

  public init(): Observable<{status: boolean}> {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    return from(this.storage.create()).pipe(
      tap( (storage) => this._storage = storage ),
      switchMap( (_) => of({status: true})),
      catchError((_) => of({status: false}))
    );
  }

  public set<Type>(key: string, value: Type): Observable<{status: boolean, value?: Type}> {
    return from(this._storage?.set(key, value)).pipe(
      switchMap( (value) => of({value, status: true})),
      catchError((_) => of({status: false}))
    );
  }

  public get(key: string): Observable<{value: any}> {
    return from(this._storage?.get(key)).pipe(
      switchMap( (value) => of({value}) )
    );
  }
}
