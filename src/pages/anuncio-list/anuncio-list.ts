import { Anuncio } from './../../model/anuncio';
import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { AnuncioFormPage } from '../anuncio-form/anuncio-form';
import { AuthProvider } from '../../providers/auth/auth';
import { LoginPage } from '../login/login';
import { AnuncioViewPage } from '../anuncio-view/anuncio-view';
import { Subscription } from 'rxjs/Subscription';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-anuncio-list',
  templateUrl: 'anuncio-list.html',
})
export class AnuncioListPage implements OnDestroy {

  anuncios = Array<Anuncio>();
  private subscription: Subscription;
  apenasProprios: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthProvider,
              private afAuth: AngularFireAuth, private afDatabase: AngularFireDatabase) {
    this.apenasProprios = this.navParams.get('apenasProprios');
    if (this.apenasProprios) {
      this.listarMeusAnuncios();
    } else {      
      this.listarTodos();
    }
  }

  abrirForm(chave: string): void {
    this.navCtrl.push(AnuncioFormPage, {chave: chave});
  }

  private addAnuncio(chave: string) {
    const sub = this.afDatabase.object<Anuncio>(`/anuncios/${chave}`).valueChanges()
      .subscribe(anuncio => {
        sub && sub.unsubscribe();
        anuncio.chave = chave;
        this.anuncios.push(anuncio);
        this.anuncios.sort((a, b) => b.data - a.data);
      });
  }

  private listarMeusAnuncios() {
    this.subscription = this.afDatabase.list(`/anuncios_usuarios/${this.afAuth.auth.currentUser.uid}`)
      .snapshotChanges().subscribe(actions => {
        this.anuncios = [];
        actions.forEach(action => {
          this.addAnuncio(action.key);
        });
      });
  }

  private listarTodos() {
    this.subscription = this.afDatabase.list<Anuncio>('anuncios', ref => ref.orderByChild('dataReversa'))
      .snapshotChanges().subscribe(anunciosServidor => {
        this.anuncios = [];
        if (anunciosServidor) {
          anunciosServidor.forEach(anuncioServidor => {
            const anuncio = anuncioServidor && anuncioServidor.payload && anuncioServidor.payload.val();
            if (anuncio) {
              anuncio.chave = anuncioServidor.key;
              this.anuncios.push(anuncio);
            }
          });
        }
      });
  }

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
  }

  novoAnuncio() {
    if (this.auth.usuarioConectado) {
      this.abrirForm(null);
    } else {
      this.navCtrl.push(LoginPage, {
        callback: (usuarioConectado) => {
          if (usuarioConectado) {
            this.abrirForm(null);
          }
        }
      });
    }
  }

  onAnuncioClick(chave: string) {
    if (this.apenasProprios) {
      this.abrirForm(chave);
    } else {
      this.visualizarAnuncio(chave);
    }
  }

  private visualizarAnuncio(chave: string) {
    this.navCtrl.push(AnuncioViewPage, {chave: chave});
  }

}