import {Pipe, PipeTransform} from "@angular/core";
import * as moment from "moment";
@Pipe({
  name: 'utcDate'
})
export class UtcDatePipe implements PipeTransform {
  transform(value: string): any {
    if (!value) {
      return '';
    }
    const localtime = moment.utc(value).toDate();
    let b = moment(new Date());
    let a = moment(localtime);
    if (b.diff(a, 'hours') > 24) {
      return moment(localtime).format("DD-MM-YYYY");
    } else {
      return moment(localtime).fromNow();
    }
  }
}
