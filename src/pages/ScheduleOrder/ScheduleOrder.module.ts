import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { ScheduleOrderPage } from "./ScheduleOrder";
import { HttpClient } from "@angular/common/http";
import { createTranslateLoader } from "../../app/app.module";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { utcglobalPipeModule } from "../../app/pipes/utcglobal.module";

@NgModule({
  declarations: [
    ScheduleOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(ScheduleOrderPage),
    utcglobalPipeModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class ScheduleOrderPageModule {
}
