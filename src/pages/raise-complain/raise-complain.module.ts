import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RaiseComplainPage } from './raise-complain';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { createTranslateLoader } from "../../app/app.module";
import { HttpClient } from "@angular/common/http";

@NgModule({
  declarations: [
    RaiseComplainPage,
  ],
  imports: [
    IonicPageModule.forChild(RaiseComplainPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class RaiseComplainPageModule {}
