import { Subscription } from 'rxjs/Subscription';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController, MenuController } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseFormPage } from '../base/base-form';
import { PlacaValidator } from '../../validators/placa';
import { Anuncio } from '../../model/anuncio';

@IonicPage()
@Component({
  selector: 'page-anuncio-form',
  templateUrl: 'anuncio-form.html',
})
export class AnuncioFormPage extends BaseFormPage implements OnDestroy {

  private chave: String;
  private subscription: Subscription;
  novoAnuncio: Boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, formBuilder: FormBuilder,
              private alertCtrl: AlertController, private afDatabase: AngularFireDatabase,
              private afAuth: AngularFireAuth, toastCtrl: ToastController, loadingCtrl: LoadingController, 
              menuCtrl: MenuController) {
    super(toastCtrl, menuCtrl, loadingCtrl, formBuilder);
    this.chave = this.navParams.get("chave");
    if (this.chave) {
      this.novoAnuncio = false;
      this.subscription = this.afDatabase.object<Anuncio>(`/anuncios/${this.chave}`).valueChanges()
        .subscribe(anuncio => {
          if (anuncio) {
            this.form.patchValue(anuncio);
          }
        });
    } else {
      this.chave = this.afDatabase.createPushId();
      this.novoAnuncio = true;
    }
  }

  protected criarForm() {
    this.form = this.formBuilder.group({
      placa: [null, Validators.compose([Validators.required, PlacaValidator.isValid])],
      marca: [null, Validators.compose([Validators.required])],
      modelo: [null, Validators.compose([Validators.required])],
      cor: [null],
      anoFabricacao: [null, Validators.compose([Validators.required, Validators.minLength(4), 
        Validators.maxLength(4)])],
      anoModelo: [null, Validators.compose([Validators.required])],
      km: [null],
      valor: [null, Validators.compose([Validators.required])],
      data: [null],
      dataReversa: [null],
      usuario: [null]
    });
  }

  protected dadosValidos(): boolean {
    if (this.form.get('placa').invalid) {
      this.mostrarMensagem('Informe uma placa válida');
      return false;
    } else if (this.form.get('marca').invalid) {
      this.mostrarMensagem('Informe a marca');
      return false;
    } else if (this.form.get('modelo').invalid) {
      this.mostrarMensagem('Informe o modelo');
      return false;
    } else if (this.form.get('anoFabricacao').invalid) {
      this.mostrarMensagem('Informe um ano no formato yyyy');
      return false;
    } else if (this.form.get('anoModelo').invalid) {
      this.mostrarMensagem('Informe o ano do modelo');
      return false;
    } else if (this.form.get('anoFabricacao').value !== this.form.get('anoModelo').value &&
        this.form.get('anoModelo').value - this.form.get('anoFabricacao').value !== 1) {
      this.mostrarMensagem('O ano do modelo deve ser, no máximo, um ano mais recente que o ano de fabricação');
      return false;
    } else if (this.form.get('valor').invalid) {
      this.mostrarMensagem('Informe o valor');
      return false;
    } else {
      return this.form.valid;
    }
  }

  getTitulo(): String {
    return this.novoAnuncio ? 'Novo Anúncio' : 'Alterar Anúncio';
  }

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
  }

  remover() {
    this.alertCtrl.create({
      title: 'Atenção',
      message: 'Essa operação não poderá ser desfeita',
      buttons: [
        {text: 'Cancelar'},
        {
          text: 'OK', 
          handler: _ => {
            const loading = this.criarIndicadorProgresso();
            loading.present();
            const mapa = {};
            mapa[`/anuncios/${this.chave}`] = null;
            mapa[`/anuncios_usuarios/${this.afAuth.auth.currentUser.uid}/${this.chave}`] = null;
            this.afDatabase.database.ref().update(mapa, error => {
              loading.dismiss();
              if (error) {
                this.mostrarMensagem('Não foi possível remover o anúncio');
              } else {
                this.navCtrl.pop();
              }
            })
          }
        }
      ]
    }).present();
  }

  salvar() {
    if (this.dadosValidos()) {
      const loading = this.criarIndicadorProgresso();
      loading.present();
      const mapa = {};
      const anuncio = this.form.value;
      if (this.novoAnuncio) {
        anuncio.data = new Date().getTime();
        anuncio.dataReversa = (0 - anuncio.data);
        anuncio.usuario = this.afAuth.auth.currentUser.uid;
      }
      mapa[`/anuncios/${this.chave}`] = anuncio;
      mapa[`/anuncios_usuarios/${anuncio.usuario}/${this.chave}`] = {'.sv': 'timestamp'};
      this.afDatabase.database.ref().update(mapa, error => {
        loading.dismiss();
        if (error) {
            this.mostrarMensagem('Não foi possível gravar os dados do anúncio');
        } else {
          this.navCtrl.pop();
        }
      });
    }
  }

}
