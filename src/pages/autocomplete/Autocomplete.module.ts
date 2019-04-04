import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {AutocompletePage} from "./Autocomplete";


@NgModule({
  declarations: [
    AutocompletePage
  ],
  imports: [
    IonicPageModule.forChild(AutocompletePage)
  ],
})
export class AutocompleteModule {
}
