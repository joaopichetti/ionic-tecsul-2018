import { MailValidator } from './../../validators/email';
import { TelefoneValidator } from './../../validators/telefone';
import { Subscription } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormBuilder, Validators } from '@angular/forms';
import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, MenuController, LoadingController } from 'ionic-angular';
import { BaseFormPage } from '../base/base-form';
import { Usuario } from '../../model/usuario';

@IonicPage()
@Component({
  selector: 'page-usuario-form',
  templateUrl: 'usuario-form.html',
})
export class UsuarioFormPage extends BaseFormPage implements OnDestroy {

  private subscription: Subscription;

  constructor(public navCtrl: NavController, public navParams: NavParams, toastCtrl: ToastController,
      private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase,
      menuCtrl: MenuController, loadingCtrl: LoadingController, formBuilder: FormBuilder) {
    super(toastCtrl, menuCtrl, loadingCtrl, formBuilder);
    this.subscription = this.afDatabase.object<Usuario>(`/usuarios/${this.afAuth.auth.currentUser.uid}`).valueChanges()
      .subscribe(usuario => {
        if (usuario) {
          this.form.patchValue(usuario);
        }
      });
  }

  protected criarForm() {
    this.form = this.formBuilder.group({
      nome: [null, Validators.compose([Validators.required, Validators.maxLength(60)])],
      telefone: [null, Validators.compose([Validators.required, TelefoneValidator.isValid])],
      email: [null, Validators.compose([Validators.required, MailValidator.isValid])]
    });
  }

  protected dadosValidos(): boolean {
    if (this.form.get('nome').invalid) {
      this.mostrarMensagem('Informe um nome com, no máximo, 60 caracteres');
      return false;
    } else if (this.form.get('telefone').invalid) {
      this.mostrarMensagem('Informe um telefone válido');
      return false;
    } else if (this.form.get('email').invalid) {
      this.mostrarMensagem('Informe um e-mail válido');
      return false;
    } else {
      return this.form.valid;
    }
  }

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
  }

  salvar() {
    if (this.dadosValidos()) {
      const loading = this.criarIndicadorProgresso();
      loading.present();
      const mapa = {};
      const usuario = this.form.value;
      mapa[`/usuarios/${this.afAuth.auth.currentUser.uid}`] = usuario;
      this.afDatabase.database.ref().update(mapa, error => {
        loading.dismiss();
        if (error) {
            this.mostrarMensagem('Não foi possível atualizar os dados do seu perfil');
        } else {
          this.navCtrl.pop();
        }
      });
    }
  }

}