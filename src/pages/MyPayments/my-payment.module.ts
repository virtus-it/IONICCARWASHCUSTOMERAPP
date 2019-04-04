import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {MyPaymentPage} from "./my-payment";
import {HttpClient} from "@angular/common/http";
import {createTranslateLoader} from "../../app/app.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {ServerToNormal} from "../../app/pipes/sDateNormal";

@NgModule({
  declarations: [
    MyPaymentPage,
    ServerToNormal
  ],
  imports: [
    IonicPageModule.forChild(MyPaymentPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class MyPaymentPageModule {
}
