import { UsuarioViewPage } from './../pages/usuario-view/usuario-view';
import { LoginPage } from './../pages/login/login';
import { AnuncioListPage } from './../pages/anuncio-list/anuncio-list';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthProvider } from './../providers/auth/auth';
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Subscription } from 'rxjs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit, OnDestroy {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = AnuncioListPage;
  pages = [
    {title: 'Anúncios', component: AnuncioListPage, iconName: 'car', isPublic: true},
    {title: 'Meus Anúncios', component: AnuncioListPage, iconName: 'car', isPublic: false,
      params: {apenasProprios: true}},
    {title: 'Meu Perfil', component: UsuarioViewPage, iconName: 'contact', isPublic: false}
  ];
  private subscription: Subscription;

  constructor(private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen,
              private alertCtrl: AlertController, private auth: AuthProvider, private afAuth: AngularFireAuth) {
    this.initializeApp();
  }

  acessar() {
    this.nav.push(LoginPage);
  }

  desconectar() {
    this.alertCtrl.create({
      title: 'Atenção',
      message: 'Você será desconectado do app',
      buttons: [
        {text: 'Cancelar'},
        {
          text: 'OK', 
          handler: _ => {
            this.auth.logoutUser().then(_ => {
              this.openPage(this.pages[0]);
            });
          }
        }
      ]
    }).present();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    this.subscription = this.afAuth.authState.subscribe(usuario => {
      this.auth.usuarioConectado = usuario != null;
    });
  }

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component, page.params);
  }

  podeVisualizarPagina(page): boolean {
    return page.isPublic || this.usuarioConectado();
  }

  usuarioConectado(): boolean {
    return this.auth.usuarioConectado;
  }
}