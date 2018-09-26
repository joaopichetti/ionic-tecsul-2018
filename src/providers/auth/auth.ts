import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';

@Injectable()
export class AuthProvider {

  user: Observable<firebase.User>;
  private _usuarioConectado: boolean;

  get usuarioConectado(): boolean {
    return this._usuarioConectado;
  }

  set usuarioConectado(_usuarioConectado: boolean) {
    this._usuarioConectado = _usuarioConectado;
  }

  constructor(public afAuth: AngularFireAuth) {}

  loginUser(email: string, password: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logoutUser(): Promise<any> {
    return this.afAuth.auth.signOut();
  }

  resetPassword(email: string): Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  signupUser(email: string, password: string): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

}