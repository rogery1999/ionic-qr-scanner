import { ActionReducerMap } from "@ngrx/store";
import { AppState } from "./app.model";
import * as fromScanner from './scanner/scanner.reducer';

export const appReducers: ActionReducerMap<AppState> = {
  scanner: fromScanner.scannerReducer
};
