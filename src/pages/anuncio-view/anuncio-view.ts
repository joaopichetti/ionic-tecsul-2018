import { Subscription } from 'rxjs/Subscription';
import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Anuncio } from '../../model/anuncio';
import { Usuario } from '../../model/usuario';

@IonicPage()
@Component({
  selector: 'page-anuncio-view',
  templateUrl: 'anuncio-view.html',
})
export class AnuncioViewPage implements OnDestroy {

  anuncio: Observable<Anuncio>;
  usuario: Observable<Usuario>;
  private subscription: Subscription;

  constructor(public navCtrl: NavController, public navParams: NavParams,
      private menuCtrl: MenuController, afDatabase: AngularFireDatabase) {
    const chave = navParams.get('chave');
    if (chave) {
      this.anuncio = afDatabase.object<Anuncio>(`/anuncios/${chave}`).valueChanges();
      this.subscription = this.anuncio.subscribe(anuncio => {
        this.usuario = afDatabase.object<Usuario>(`/usuarios/${anuncio.usuario}`).valueChanges();
      });
    }
  }

  ionViewDidLeave() {
    this.menuCtrl.get().enable(true);
  }
  
  ionViewDidLoad() {
    this.menuCtrl.get().enable(false);
  }

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
  }

}
