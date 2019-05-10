import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyridesPage } from './myrides';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { createTranslateLoader } from "../../app/app.module";
import { HttpClient } from "@angular/common/http";

@NgModule({
  declarations: [
    MyridesPage,
  ],
  imports: [
    IonicPageModule.forChild(MyridesPage),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
})
export class MyridesPageModule {}
