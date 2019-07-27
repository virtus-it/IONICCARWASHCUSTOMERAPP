import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddupdateridesPage } from './addupdaterides';
// import { SearchPipe } from "../../app/pipes/search";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { createTranslateLoader } from "../../app/app.module";
import { HttpClient } from "@angular/common/http";

@NgModule({
  declarations: [
    AddupdateridesPage
    // SearchPipe
  ],
  imports: [
    IonicPageModule.forChild(AddupdateridesPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class AddupdateridesPageModule {}
