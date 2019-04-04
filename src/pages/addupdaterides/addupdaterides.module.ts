import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddupdateridesPage } from './addupdaterides';
import { SearchPipe } from "../../app/pipes/search";

@NgModule({
  declarations: [
    AddupdateridesPage,
    SearchPipe
  ],
  imports: [
    IonicPageModule.forChild(AddupdateridesPage),
  ],
})
export class AddupdateridesPageModule {}
