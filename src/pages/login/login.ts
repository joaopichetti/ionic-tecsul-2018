import { MailValidator } from './../../validators/email';
import { RedefinirSenhaPage } from './../redefinir-senha/redefinir-senha';
import { CriarContaPage } from './../criar-conta/criar-conta';
import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, LoadingController, MenuController, ToastController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { BaseFormPage } from '../base/base-form';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage extends BaseFormPage {

  constructor(private navCtrl: NavController, private authData: AuthProvider,
              private params: NavParams, private alertCtrl: AlertController,
              formBuilder: FormBuilder, loadingCtrl: LoadingController, 
              menuCtrl: MenuController, toastCtrl: ToastController) {
    super(toastCtrl, menuCtrl, loadingCtrl, formBuilder);
  }

  acessar() {
    if (this.dadosValidos()) {
      const loading = this.criarIndicadorProgresso();
      loading.present();
      this.authData.loginUser(this.form.value.email, this.form.value.senha).then(_ => {
        this.voltar(true);
      }, error => {
        loading.dismiss().then(_ => {
          this.alertCtrl.create({
            message: `Não foi possível realizar o acesso: ${error.message}`,
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

  protected criarForm() {
    this.form = this.formBuilder.group({
      email: [null, Validators.compose([Validators.required, MailValidator.isValid])],
      senha: [null, Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  criarConta() {
    this.navCtrl.push(CriarContaPage, {
      callback: (sucesso: boolean) => {
        if (sucesso) {
          this.voltar(sucesso);
        }
      }
    });
  }

  protected dadosValidos(): boolean {
    if (this.form.get('email').invalid) {
      this.mostrarMensagem('Informe um e-mail válido');
      return false;
    } else if (this.form.get('senha').invalid) {
      this.mostrarMensagem('Informe sua senha');
      return false;
    } else {
      return this.form.valid;
    }
  }

  redefinirSenha() {
    this.navCtrl.push(RedefinirSenhaPage);
  }

  voltar(sucesso: boolean) {
    this.navCtrl.pop().then(_ => {
      const callback = this.params.get('callback');
      callback && callback(sucesso);
    });
  }

}
