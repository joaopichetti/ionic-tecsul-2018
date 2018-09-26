import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsuarioFormPage } from './usuario-form';

@NgModule({
  declarations: [
    UsuarioFormPage,
  ],
  imports: [
    IonicPageModule.forChild(UsuarioFormPage),
  ],
})
export class UsuarioFormPageModule {}
