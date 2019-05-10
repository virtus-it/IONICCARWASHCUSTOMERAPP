import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrackorderPage } from './trackorder';

@NgModule({
  declarations: [
    TrackorderPage,
  ],
  imports: [
    IonicPageModule.forChild(TrackorderPage),
  ],
})
export class TrackorderPageModule {}
