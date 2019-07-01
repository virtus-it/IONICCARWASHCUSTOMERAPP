import { Injectable } from "@angular/core";
import "rxjs/add/operator/map";
import { APP_TYPE, APP_USER_TYPE, IS_WEBSITE, Utils } from "./Utils";
import { GetService } from "./get.servie";


@Injectable()
export class ServiceArea {


  constructor(private alertUtils: Utils, private apiService: GetService) {

  }

  fetchServiceAreas() {

  }

}


