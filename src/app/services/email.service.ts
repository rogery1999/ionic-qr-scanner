import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(
    private emailComposer: EmailComposer
  ) { }



  sendEmail(uri: string): Observable<boolean>{
    const  email = {
      to: 'rogery1999@gmail.com',
      // cc: 'erika@mustermann.de',
      // bcc: ['john@doe.com', 'jane@doe.com'],
      attachments: [
        // 'file://img/logo.png',
        // 'res://icon.png',
        // 'base64:icon.png//iVBORw0KGgoAAAANSUhEUg...',
        // 'file://README.pdf'
        uri
      ],
      subject: 'Respaldo de historial',
      body: 'Historial de qr scaneados - <strong>QrScannerIonic</strong>',
      isHtml: true
    }

    // Send a text message using default options
    this.emailComposer.open(email);
    return of(true);
  }
}
