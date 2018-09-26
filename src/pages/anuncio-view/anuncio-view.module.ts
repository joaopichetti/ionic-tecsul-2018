import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnuncioViewPage } from './anuncio-view';

@NgModule({
  declarations: [
    AnuncioViewPage,
  ],
  imports: [
    IonicPageModule.forChild(AnuncioViewPage),
  ],
})
export class AnuncioViewPageModule {}
