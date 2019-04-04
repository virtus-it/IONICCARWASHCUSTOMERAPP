import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PointsPage } from './points';
import {utcglobalPipeModule} from "../../app/pipes/utcglobal.module";

@NgModule({
  declarations: [
    PointsPage
  ],
  imports: [
    utcglobalPipeModule,
    IonicPageModule.forChild(PointsPage),
  ],
})
export class PointsPageModule {}
