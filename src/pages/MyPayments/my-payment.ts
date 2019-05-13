import { ChangeDetectorRef, Component } from "@angular/core";
import { App, NavController, NavParams, IonicPage } from "ionic-angular";
import { APP_TYPE, APP_USER_TYPE, RES_SUCCESS, Utils, IS_WEBSITE } from "../../app/services/Utils";
import { GetService } from "../../app/services/get.servie";
// import { TabsPage } from "../tabs/tabs";
import { TranslateService } from "@ngx-translate/core";
import { MapView } from "../MapView/MapView";

@IonicPage()
@Component({
  templateUrl: 'my-payment.html',
  selector: 'Payment-style'
})
export class MyPaymentPage {
  items: any;
  historyItems: any;
  tabBarElement: any;
  private loginStatus: boolean = false;
  private dealerID = "";
  private userID = "";
  private callFrom = "";

  constructor(private translateService: TranslateService, private ref: ChangeDetectorRef, public appCtrl: App, public navCtrl: NavController, public navParams: NavParams, private alertUtils: Utils, private getService: GetService) {
    let lang = "en";
    if (Utils.lang) {
      lang = Utils.lang
    }
    console.log(lang);
    translateService.use(lang);
    
    try {
      this.alertUtils.getUserInfo().then(info => {
        if (info) {
          Utils.USER_INFO_DATA = info;
        }
      }, err => {
        Utils.sLog(err);
      })
    } catch (e) {
      this.alertUtils.showLog(e);
    }

    this.callFrom = this.navParams.get("callfrom");
    this.alertUtils.showLog(this.items);
    if (IS_WEBSITE) {
      this.userID = Utils.USER_INFO_DATA.userid;
      this.dealerID = Utils.USER_INFO_DATA.superdealerid;
      this.fetchPaymentAmt(true, false, "");
    }
  }

  close() {
    this.appCtrl.getRootNav().setRoot(MapView, { from: "pushnotification" });
  }


  ngOnInit() {
    this.alertUtils.getUserInfo().then(info => {
      if (info) {
        Utils.USER_INFO_DATA = info;
        this.fetchPaymentAmt(true, false, "");
      }
    }, err => {
      Utils.sLog(err);
    })
  }

  refresherFetchPaymentInfo(refresher) {
    this.fetchPaymentAmt(false, true, refresher);
  }

  fetchPaymentAmt(isFirst: boolean, isRefresh: boolean, refresher) {
    let input = {
      "root": {
        "userid": Utils.USER_INFO_DATA.userid,
        "usertype": APP_USER_TYPE,
        "productid": "1",
        "loginid": Utils.USER_INFO_DATA.userid,
        "apptype": APP_TYPE
      }
    };
    let data = JSON.stringify(input);
    this.getService.postReq(this.getService.getPaymentDetails(), data).then(res => {
      this.alertUtils.showLog(res);
      if (res.result == RES_SUCCESS) {
        if (res.data) {
          this.items = res.data[0];
          this.ref.detectChanges();
          this.fetchPaymentHistory(isFirst, isRefresh, false, refresher, "");
        }
      } else {
        if (isRefresh)
          refresher.complete();
      }
    }, err => {
      if (isRefresh)
        refresher.complete();
      this.alertUtils.showToast(this.alertUtils.INTERNET_ERR_MSG);
      this.alertUtils.showLog(err);
    });
  }

  doInfinite(paging): Promise<any> {
    if (this.historyItems) {
      if (this.historyItems.length > 0)
        this.fetchPaymentHistory(false, false, true, "", paging);
      else
        paging.complete();
    } else {
      paging.complete();
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 30000);
    })
  }

  fetchPaymentHistory(isFrist: boolean, isRefresh: boolean, isPaging: boolean, refresher, paging) {
    let input = {
      "order": {
        "userid": Utils.USER_INFO_DATA.userid,
        "priority": "5",
        "usertype": APP_USER_TYPE,
        "status": "all",
        "lastrecordtimestamp": "15",
        "pagesize": "10",
        "first_orderid": "0",
        "customerid": Utils.USER_INFO_DATA.userid,
        "productid": "1",
        "apptype": APP_TYPE
      }
    };
    if (isPaging) {
      input.order["last_paymentid"] = this.historyItems[this.historyItems.length - 1].paymentid;
    } else {
      input.order["last_paymentid"] = "0";
    }
    let data = JSON.stringify(input);
    this.getService.postReq(this.getService.getPaymentstHistoryByUserid(), data).then(res => {
      this.alertUtils.showLog(res);
      this.hideProgress(isRefresh, isPaging, paging, refresher);
      if (res.result == RES_SUCCESS) {
        if (res.data) {
          if (!isPaging)
            this.historyItems = res.data;
          this.alertUtils.showLog(this.historyItems);
          for (let i = 0; i < res.data.length; i++) {
            if (res.data[i].status == 'received') {
              res.data[i]["statuscolor"] = "warning";
              res.data[i].status = "Dealer confirmation pending";
            } else if (res.data[i].status == 'confirm') {
              res.data[i].status = "Confirmed";
              res.data[i]["statuscolor"] = "success";
            } else if (res.data[i].status == 'rejected') {
              res.data[i]["statuscolor"] = "danger";
            }
            if (isPaging) {
              this.historyItems.push(res.data[i]);
            }
          }
        }
      } else {
        this.hideProgress(isRefresh, isPaging, paging, refresher);
      }
    }, err => {
      this.hideProgress(isRefresh, isPaging, paging, refresher);
      this.alertUtils.showLog(err);
    });
  }

  hideProgress(isRefresh, isPaging, paging, refresher) {
    if (isRefresh)
      refresher.complete();
    if (isPaging)
      paging.complete();
  }
}
