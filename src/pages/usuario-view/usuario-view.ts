import { UsuarioFormPage } from './../usuario-form/usuario-form';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Usuario } from '../../model/usuario';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-usuario-view',
  templateUrl: 'usuario-view.html',
})
export class UsuarioViewPage {

  usuario: Observable<Usuario>;

  constructor(public navCtrl: NavController, public navParams: NavParams, afDatabase: AngularFireDatabase,
      afAuth: AngularFireAuth) {
    this.usuario = afDatabase.object<Usuario>(`/usuarios/${afAuth.auth.currentUser.uid}`).valueChanges();
  }

  abrirForm() {
    this.navCtrl.push(UsuarioFormPage);
  }

}
