import { MailValidator } from './../../validators/email';
import { AngularFireDatabase } from '@angular/fire/database';
import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController, MenuController, ToastController, NavParams } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { BaseFormPage } from '../base/base-form';
import { TelefoneValidator } from '../../validators/telefone';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-criar-conta',
  templateUrl: 'criar-conta.html',
})
export class CriarContaPage extends BaseFormPage {

  constructor(private nav: NavController, private params: NavParams, 
              private authData: AuthProvider, private alertCtrl: AlertController,
              private afDatabase: AngularFireDatabase, private afAuth: AngularFireAuth, 
              formBuilder: FormBuilder,  loadingCtrl: LoadingController,
              menuCtrl: MenuController, toastCtrl: ToastController) {
    super(toastCtrl, menuCtrl, loadingCtrl, formBuilder);
  }

  criarConta() {
    if (this.dadosValidos()) {
      const loading = this.criarIndicadorProgresso();
      loading.present();
      this.authData.signupUser(this.form.value.email, this.form.value.senha).then(_ => {
        // se criou a conta, salvamos os dados do usuário
        const usuario = this.form.value;
        delete usuario.senha;
        delete usuario.confirmacao;
        const mapa = {};
        mapa[`/usuarios/${this.afAuth.auth.currentUser.uid}`] = usuario;
        this.afDatabase.database.ref().update(mapa, error => {
          console.log(error);
        });
        this.nav.pop().then(_ => {
          const callback = this.params.get('callback');
          callback && callback(true);
        });
      }, error => {
        loading.dismiss().then(_ => {
          this.alertCtrl.create({
            message: `Não foi possível criar sua conta: ${error.message}`,
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
      nome: [null, Validators.compose([Validators.required, Validators.maxLength(60)])],
      telefone: [null, Validators.compose([Validators.required, TelefoneValidator.isValid])],
      email: [null, Validators.compose([Validators.required, MailValidator.isValid])],
      senha: [null, Validators.compose([Validators.minLength(6), Validators.required])],
      confirmacao: [null, Validators.compose([Validators.required])]
    });
  }

  protected dadosValidos(): boolean {
    if (this.form.get('nome').invalid) {
      this.mostrarMensagem('Informe seu nome');
      return false;
    } else if (this.form.get('telefone').invalid) {
      this.mostrarMensagem('Informe um telefone válido');
      return false;
    } else if (this.form.get('email').invalid) {
      this.mostrarMensagem('Informe um e-mail válido');
      return false;
    } else if (this.form.get('senha').invalid) {
      this.mostrarMensagem('Sua senha dever, no mínimo, seis caracteres');
      return false;
    } else if (this.form.get('confirmacao').invalid) {
      this.mostrarMensagem('Confirme sua senha');
      return false;
    } else if (this.form.get('senha').value !== this.form.get('confirmacao').value) {
      this.mostrarMensagem('A senha e a confirmação devem ser iguais');
      return false;
    } else {
      return this.form.valid;
    }
  }

}
