import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {MyProfile} from "./myprofile";
import {HttpClient} from "@angular/common/http";
import {createTranslateLoader} from "../../app/app.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    MyProfile,
  ],
  imports: [
    IonicPageModule.forChild(MyProfile),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class MyProfilePageModule {
}
