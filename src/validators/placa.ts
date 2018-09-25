import { FormControl } from '@angular/forms';

export class PlacaValidator {

  static isValid(control: FormControl){
    const placa = control && control.value;
    if (!placa) {
      return null;
    }
    if (PlacaValidator.validate(placa)){
      return null;
    }
    return {
      "placa": true
    };
  }

  static validate(placa: string) {
    return placa && /^[A-Z]{3}-\d{4}$/.test(placa);
  }

}
