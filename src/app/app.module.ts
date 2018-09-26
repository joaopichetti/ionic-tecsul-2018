import { AnuncioFormPage } from './../pages/anuncio-form/anuncio-form';
import { AnuncioListPage } from './../pages/anuncio-list/anuncio-list';
import { AuthProvider } from './../providers/auth/auth';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule, AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { LoginPage } from '../pages/login/login';
import { CriarContaPage } from '../pages/criar-conta/criar-conta';
import { RedefinirSenhaPage } from '../pages/redefinir-senha/redefinir-senha';
import { AnuncioViewPage } from '../pages/anuncio-view/anuncio-view';
import { UsuarioViewPage } from '../pages/usuario-view/usuario-view';
import { UsuarioFormPage } from '../pages/usuario-form/usuario-form';

export const firebaseConfig = {
  apiKey: "alterar",
  authDomain: "alterar",
  databaseURL: "alterar",
  projectId: "alterar",
  storageBucket: "alterar",
  messagingSenderId: "alterar"
};

@NgModule({
  declarations: [
    MyApp,
    AnuncioListPage,
    AnuncioFormPage,
    AnuncioViewPage,
    LoginPage,
    CriarContaPage,
    RedefinirSenhaPage,
    UsuarioViewPage,
    UsuarioFormPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AnuncioListPage,
    AnuncioFormPage,
    AnuncioViewPage,
    LoginPage,
    CriarContaPage,
    RedefinirSenhaPage,
    UsuarioViewPage,
    UsuarioFormPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    AuthProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
