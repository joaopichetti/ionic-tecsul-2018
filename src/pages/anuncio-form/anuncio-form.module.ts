import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnuncioFormPage } from './anuncio-form';

@NgModule({
  declarations: [
    AnuncioFormPage,
  ],
  imports: [
    IonicPageModule.forChild(AnuncioFormPage),
  ],
})
export class AnuncioFormPageModule {}
