import {Pipe, PipeTransform} from "@angular/core";
import * as moment from "moment";
@Pipe({
  name: 'normalDate'
})
export class ServerToNormal implements PipeTransform {
  transform(value: string): any {
    if (!value) {
      return '';
    }
    const localtime = moment.utc(value).toDate();
    let utc = moment(localtime).format("DD-MM-YYYY");
    return utc;
  }
}
