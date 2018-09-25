import { FormControl } from '@angular/forms';

export class TelefoneValidator {

  static isValid(control: FormControl){
    const tel = control && control.value;
    if (!tel) {
      return null;
    }
    if (TelefoneValidator.validate(tel)){
      return null;
    }
    return {
      "telefone": true
    };
  }

  static validate(telefone: string) {
    return telefone && /^\(?\d{2}\)? ?\d{4,5}-?\d{4}$/.test(telefone);
  }
}
