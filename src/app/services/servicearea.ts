import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import { APP_TYPE, APP_USER_TYPE, IS_WEBSITE, Utils, RES_SUCCESS } from "./Utils";
import { GetService } from "./get.servie";


@Injectable()
export class ServiceArea {
  list: any = [];

  constructor(private alertUtils: Utils, private apiService: GetService) {

  }

  async fetchServiceAreas() {
    if (!Utils.USER_INFO_DATA && !Utils.USER_INFO_DATA.superdealerid) {
      Utils.sLog('ALERT---- no user data ');
      return this.list;
    }
    let input = { "root": { "transtype": "getall", "user_type": APP_USER_TYPE, "userid": Utils.USER_INFO_DATA.superdealerid, "loginid": Utils.USER_INFO_DATA.userid, "apptype": APP_TYPE } };
    await this.apiService.postReq(GetService.polygons(), JSON.stringify(input)).then(res => {
      Utils.sLog("*******service areas list**********")
      Utils.sLog(res);
      if (res && res.result == RES_SUCCESS && res.data) {
        this.list = res.data[0].polygonvalue;
        Utils.sLog(this.list);

      }
    }, err => {
      Utils.sLog(err);
    })
  }

  saveServiceAreas(list) {
    if (list){
      Utils.sLog("*******service areas list**********")
      this.list = list;
      Utils.sLog(this.list);
    }
  }

  getPolygonsList() {
    var self = this;
    Utils.sLog("service area size : " + this.list.length);
    return new Promise(function (resolve, reject) {
      if (self.list.length > 0) {
        resolve(self.list);
      } else {
        self.fetchServiceAreas();
        reject(self.list);
      }
    })

  }

}


