export class Registro{

  public text   :string;
  public type   :string;
  public icon   :string;
  public created :Date;

  constructor(text: string){
    this.text = text;
    this.created = new Date();
    this.determinateType();
  }

  private determinateType(){
    const initText = this.text.substring(0,4);

    switch(initText){
      case 'http':
        this.type = 'http';
        this.icon = 'globe';
        break;
      case 'geo:':
        this.type = 'geo';
        this.icon = 'pin';
        break;
      default:
        this.type = 'No reconocido';
        this.icon = 'create';
        break;
    }
  }
}
