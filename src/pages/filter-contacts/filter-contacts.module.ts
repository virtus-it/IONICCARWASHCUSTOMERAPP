import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {FilterContactsPage} from "./filter-contacts";
import { SearchPipe } from "../../app/pipes/search";


@NgModule({
  declarations: [
    FilterContactsPage,
    SearchPipe
  ],
  imports: [
    IonicPageModule.forChild(FilterContactsPage)
  ],
})
export class FilterContactPageModule {
}
