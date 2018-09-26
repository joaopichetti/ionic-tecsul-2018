import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnuncioListPage } from './anuncio-list';

@NgModule({
  declarations: [
    AnuncioListPage,
  ],
  imports: [
    IonicPageModule.forChild(AnuncioListPage),
  ],
})
export class AnuncioListPageModule {}
