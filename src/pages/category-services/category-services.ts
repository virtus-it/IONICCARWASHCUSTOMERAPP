import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { GetService } from '../../app/services/get.servie';
import { Utils, APP_USER_TYPE, APP_TYPE, RES_SUCCESS } from '../../app/services/Utils';



@IonicPage()
@Component({
  selector: 'page-category-services',
  templateUrl: 'category-services.html',
})
export class CategoryServicesPage {
  services:Map<string, any>;
  item: any;
  subService: any;
  list = [];
  catSelected: any;
  totalamt: any = 0;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, private apiService: GetService, private ref: ChangeDetectorRef, private alertUtils: Utils) {
    this.services = new Map<string, any>();


  }
  ngOnInit() {
    this.getData();
  }

  onChange(item) {
    this.calculateTotalAmt();
  }
  
  add(item) {
    item.ischecked = !item.ischecked;
    this.calculateTotalAmt();
  }
  calculateTotalAmt() {
    this.totalamt = 0;
    for (let i = 0; i < this.list.length; i++) {
      var arrList = this.services.get(this.list[i]);
      for (let j = 0; j < arrList.length; j++) {
        const element = arrList[j];
        if (element.ischecked) {
          this.totalamt = this.totalamt + element.pcost;
        }
      }
    }
  }
  getData() {
    try {
      let input = {
        "root": {
          "userid": Utils.USER_INFO_DATA.superdealerid,
          "dealerid": Utils.USER_INFO_DATA.superdealerid,
          "distributorid": Utils.USER_INFO_DATA.superdealerid,
          "usertype": APP_USER_TYPE,
          "loginid": Utils.USER_INFO_DATA.userid,
          "apptype": APP_TYPE,
          "transtype": "getpackages"
        }
      };
      let data = JSON.stringify(input);

      this.apiService.postReq(this.apiService.getProductsByDistributerId(), data).then(res => {
        this.alertUtils.showLog(res);
        if (res.result == RES_SUCCESS) {
          if (res.data) {
            for (let i = 0; i < res.data.length; i++) {
              // res.data[i]["count"] = 0;
              res.data[i]["ischecked"] = false;
    
            }
            var result = Utils.groupByBrandName(res.data, function (item) {
              return [item.categoryid, item.categoryid];
            });

            Utils.sLog(result);
            this.services = new Map<string, any>();

            for (let i = 0; i < result.length; i++) {
              const element = result[i];
              this.services.set(element[0].category, element);
            }

            Utils.sLog(this.services.keys());
            Utils.sLog(this.services);
            this.list = Array.from(this.services.keys());
            this.item = this.list[0];
            Utils.sLog(this.item);

          } else {
            this.alertUtils.showToast("Found no products, please try again");
          }
        }
      });
    }
    catch (e) {
      this.alertUtils.showLog(e);
    }

  }
  continue() {
    this.closeModal();
  }
  
  closeModal() {
    this.viewCtrl.dismiss();
  }
  checkService() {
    this.subService = this.services.get(this.item);
  }

  ionViewDidLoad() {
    Utils.sLog('ionViewDidLoad CategoryServicesPage');
  }


}
