import { Registro } from '../../models/registro.model';

export interface ScannerAppState{
  scanning      : boolean;
  scannerResult : Registro;
  error         : any;
  history       : Registro[];
  dbError       : any;
  dbLoading     : boolean;
  emailError    : any;
  sendingEmail  : boolean;
}

export const defaultScannerState: ScannerAppState = {
  error         : null,
  scannerResult : null,
  scanning      : false,
  history       : [],
  dbError       : null,
  dbLoading     : false,
  emailError    : null,
  sendingEmail  : false
};
