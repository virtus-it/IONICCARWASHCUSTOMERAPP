import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {AboutUs} from "./AboutUs";
import {HttpClient} from "@angular/common/http";
import {createTranslateLoader} from "../../app/app.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    AboutUs,
  ],
  imports: [
    IonicPageModule.forChild(AboutUs),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class MyAboutUsPageModule {
}
