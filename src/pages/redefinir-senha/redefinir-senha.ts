import { MailValidator } from './../../validators/email';
import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, MenuController, LoadingController, ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { BaseFormPage } from '../base/base-form';

@IonicPage()
@Component({
  selector: 'page-redefinir-senha',
  templateUrl: 'redefinir-senha.html',
})
export class RedefinirSenhaPage extends BaseFormPage {

  constructor(private authData: AuthProvider, formBuilder: FormBuilder,
              private nav: NavController, private alertCtrl: AlertController,
              loadingCtrl: LoadingController, menuCtrl: MenuController, 
              toastCtrl: ToastController) {
    super(toastCtrl, menuCtrl, loadingCtrl, formBuilder);
  }

  criarForm() {
    this.form = this.formBuilder.group({
      email: [null, Validators.compose([Validators.required, MailValidator.isValid])],
    });
  }
  
  protected dadosValidos(): boolean {
    if (this.form.get('email').invalid) {
      this.mostrarMensagem('Informe um e-mail válido');
      return false;
    } else {
      return this.form.valid;
    }
  }

  redefinirSenha() {
    if (this.dadosValidos()) {
      const loading = this.criarIndicadorProgresso();
      loading.present();
      this.authData.resetPassword(this.form.value.email).then(_ => {
        loading.dismiss().then(_ => {
          this.alertCtrl.create({
            message: "Enviamos em seu e-mail um link para redefinir a senha",
            buttons: [
              {
                text: "Ok",
                role: 'cancel',
                handler: () => {
                  this.nav.pop();
                }
              }
            ]
          }).present();
        });
      }, error => {
        loading.dismiss().then(_ => {
          this.alertCtrl.create({
            message: `Não foi possível redefinir a senha: ${error.message}`,
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          }).present();
        });
      });
    }
  }

}