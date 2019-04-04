import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CancelOrderPage } from './cancel-order';

@NgModule({
  declarations: [
    CancelOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(CancelOrderPage),
  ],
})
export class CancelOrderPageModule {}
