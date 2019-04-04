import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {Feedback} from "./Feedback";
import {HttpClient} from "@angular/common/http";
import {createTranslateLoader} from "../../app/app.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    Feedback,
  ],
  imports: [
    IonicPageModule.forChild(Feedback),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class FeedbackPageModule {
}
