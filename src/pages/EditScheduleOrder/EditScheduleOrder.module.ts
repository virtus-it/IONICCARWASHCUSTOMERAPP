import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {EditScheduleOrderPage} from "./EditScheduleOrder";
import {HttpClient} from "@angular/common/http";
import {createTranslateLoader} from "../../app/app.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    EditScheduleOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(EditScheduleOrderPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class EditScheduleOrderPageModule {
}
