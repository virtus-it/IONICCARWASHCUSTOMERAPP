import {NgModule} from "@angular/core";
import {IonicPageModule} from "ionic-angular";
import {UtcDatePipe} from "../../app/pipes/utcglobal";

@NgModule({
    declarations: [
        UtcDatePipe
    ],
    imports: [

    ],
    exports: [
        UtcDatePipe
    ]
    ,
})
export class utcglobalPipeModule {}