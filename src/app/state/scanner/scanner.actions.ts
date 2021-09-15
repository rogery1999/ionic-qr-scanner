import { createAction, props } from "@ngrx/store";
import { Registro } from '../../models/registro.model';

const enum ScanTypeActions {
  StartScanner        = '[Scanner] Start Scanner',
  StopScanner         = '[Scanner] Stop Scanner',
  SuccessScan         = '[Scanner] Success Scan',
  ErrorScan           = '[Scanner] Error Scan',
  CloseScanner        = '[Scanner] Close Scanner',
  InitHistory         = '[Scanner] Init History',
  InitHistorySuccess  = '[Scanner] Init History Success',
  InitHistoryError    = '[Scanner] Init History Error',
  SaveHistory         = '[Scanner] Save History',
  SaveHistorySuccess  = '[Scanner] Save History Success',
  SaveHistoryError    = '[Scanner] Save History Error',
  SendingEmail        = '[Scanner] Sending Email',
  SendingEmailSuccess = '[Scanner] Sending Email Success',
  SendingEmailError   = '[Scanner] Sending Email Error',
  CreatingFile        = '[Scanner] Creating File',
  CreatingFileSuccess = '[Scanner] Creating File Success',
  CreatingFileError   = '[Scanner] Creating File Error'
};

export const StartScanner         = createAction(ScanTypeActions.StartScanner);
export const SuccessScan          = createAction(ScanTypeActions.SuccessScan, props<{scanText: string}>());
export const ErrorScan            = createAction(ScanTypeActions.ErrorScan, props<{error: any}>());
export const CloseScanner         = createAction(ScanTypeActions.CloseScanner);
export const StopScanner          = createAction(ScanTypeActions.StopScanner);
export const InitHistory          = createAction(ScanTypeActions.InitHistory);
export const InitHistorySuccess   = createAction(ScanTypeActions.InitHistorySuccess, props<{history: Registro[]}>());
export const InitHistoryError     = createAction(ScanTypeActions.InitHistoryError, props<{dbError: string}>());
export const SaveHistory          = createAction(ScanTypeActions.SaveHistory, props<{history: Registro[]}>());
export const SaveHistorySuccess   = createAction(ScanTypeActions.SaveHistorySuccess);
export const SaveHistoryError     = createAction(ScanTypeActions.SaveHistoryError, props<{dbError: string}>());
export const CreatingFile         = createAction(ScanTypeActions.CreatingFile, props<{dataFile: Registro[], nameFile?: string, typeFile?: string}>());
export const CreatingFileSuccess  = createAction(ScanTypeActions.CreatingFileSuccess, props<{uri: string}>());
export const CreatingFileError    = createAction(ScanTypeActions.CreatingFileError, props<{fileError: string}>());
export const SendingEmail         = createAction(ScanTypeActions.SendingEmail, props<{uri: string}>());
export const SendingEmailSuccess  = createAction(ScanTypeActions.SendingEmailSuccess);
export const SendingEmailError    = createAction(ScanTypeActions.SendingEmailError, props<{emailError: string}>());
