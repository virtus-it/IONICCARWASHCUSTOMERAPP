import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {InviteFriends} from "./InviteFriends";
import {HttpClient} from "@angular/common/http";
import {createTranslateLoader} from "../../app/app.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    InviteFriends,
  ],
  imports: [
    IonicPageModule.forChild(InviteFriends),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class InviteFriendsPageModule {
}
