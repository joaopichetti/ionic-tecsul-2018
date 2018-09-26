import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UsuarioViewPage } from './usuario-view';

@NgModule({
  declarations: [
    UsuarioViewPage,
  ],
  imports: [
    IonicPageModule.forChild(UsuarioViewPage),
  ],
})
export class UsuarioViewPageModule {}
