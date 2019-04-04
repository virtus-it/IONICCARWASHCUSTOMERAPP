import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { OrderDetails } from "./orderdetails";
import { HttpClient } from "@angular/common/http";
import { createTranslateLoader } from "../../app/app.module";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { utcglobalPipeModule } from "../../app/pipes/utcglobal.module";

@NgModule({
  declarations: [
    OrderDetails,
  ],
  imports: [
    IonicPageModule.forChild(OrderDetails),
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
export class OrderDetailsPageModule {
}
