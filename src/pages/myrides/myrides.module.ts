import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyridesPage } from './myrides';

@NgModule({
  declarations: [
    MyridesPage,
  ],
  imports: [
    IonicPageModule.forChild(MyridesPage),
  ],
})
export class MyridesPageModule {}
