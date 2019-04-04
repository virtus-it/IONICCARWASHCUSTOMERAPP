import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {PreviewPage} from "./PreviewPage";
import {HttpClient} from "@angular/common/http";
import {createTranslateLoader} from "../../app/app.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    PreviewPage
  ],
  imports: [
    IonicPageModule.forChild(PreviewPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class PreviewPageModule {
}
