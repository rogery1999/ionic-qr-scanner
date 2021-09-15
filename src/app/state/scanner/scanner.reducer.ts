import { Action, createReducer, on } from "@ngrx/store";
import * as scanActions from './scanner.actions';
import { defaultScannerState, ScannerAppState } from "./scanner.model";
import { Registro } from '../../models/registro.model';
import { SendingEmail } from './scanner.actions';

// * State Management Functions
function _startScanner() {
  return (state) => ({
    ...state,
    scanning: true,
    error: null
  });
}

function _stopScanner(){
  return (state) => ({
    ...state,
    scanning: false,
    scannerResult: null
  });
}

function _successScan() {
  return (state, {scanText}) => {
    const scannerResult = new Registro(scanText);
    const history = [...state.history];
    history.unshift(scannerResult);
    return ({
      ...state,
      scannerResult,
      history
    });
  }
}

function _errorScan() {
  return (state, {error}) => ({
    ...state,
    error
  });
}

function _closeScanner() {
  return (state) => ({
    ...state,
    error: null
  });
}

function _initHistory() {
  return (state) => ({
    ...state,
    dbLoading: true
  });
}

function _initHistorySuccess() {
  return (state, {history}) => ({
    ...state,
    dbLoading: false,
    history
  });
}

function _initHistoryError() {
  return (state, {dbError}) => ({
    ...state,
    dbLoading: false,
    dbError
  });
}

function _saveHistory() {
  return (state) => ({
    ...state,
    dbLoading: true
  });
}

function _saveHistorySuccess() {
  return (state) => ({
    ...state,
    dbLoading: false,
    dbError: null
  });
}

function _saveHistoryError() {
  return (state, {dbError}) => ({
    ...state,
    dbLoading: false,
    dbError
  });
}

function _creatingFile() {
  return (state) => ({
    ...state,
    sendingEmail: true
  });
}

function _creatingFileSuccess() {
  return (state) => ({
    ...state
  });
}

function _creatingFileError() {
  return (state, {fileError}) => ({
    ...state,
    sendingEmail: false,
    emailError: fileError
  });
}

function _sendingEmail() {
  return (state) => ({
    ...state
  });
}

function _sendingEmailSuccess() {
  return (state) => ({
    ...state,
    sendingEmail: false
  });
}

function _endingEmailError() {
  return (state, {emailError}) => ({
    ...state,
    sendingEmail: false,
    emailError
  });
}

// * Reducer Function
const _scannerReducer = createReducer( defaultScannerState,
  on(scanActions.StartScanner, _startScanner()),
  on(scanActions.StopScanner, _stopScanner()),
  on(scanActions.SuccessScan, _successScan()),
  on(scanActions.ErrorScan, _errorScan()),
  on(scanActions.CloseScanner, _closeScanner()),
  on(scanActions.InitHistory, _initHistory()),
  on(scanActions.InitHistorySuccess, _initHistorySuccess()),
  on(scanActions.InitHistoryError, _initHistoryError()),
  on(scanActions.SaveHistory, _saveHistory()),
  on(scanActions.SaveHistorySuccess, _saveHistorySuccess()),
  on(scanActions.SaveHistoryError, _saveHistoryError()),
  on(scanActions.CreatingFile, _creatingFile()),
  on(scanActions.CreatingFileSuccess, _creatingFileSuccess()),
  on(scanActions.CreatingFileError, _creatingFileError()),
  on(scanActions.SendingEmail, _sendingEmail()),
  on(scanActions.SendingEmailSuccess, _sendingEmailSuccess()),
  on(scanActions.SendingEmailError, _endingEmailError()),
);

export function scannerReducer(state: ScannerAppState, action: Action) {
  return _scannerReducer(state, action);
};
