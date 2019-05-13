import { Component } from "@angular/core";
import { App, NavController, NavParams, ViewController } from "ionic-angular";
// import { TabsPage } from "../tabs/tabs";
import { Utils, APP_TYPE, APP_USER_TYPE, RES_SUCCESS, TRY_AGAIN_ERR_MSG } from "../../app/services/Utils";
import { GetService } from "../../app/services/get.servie";
import { AboutPage } from "../MyOrders/about";
import { MapView } from "../MapView/MapView";

@Component({
  templateUrl: 'orderconfirmation.html'
})
export class OrderConfirmation {

  private orderResult: any;
  private totalItem: any;
  private totalCost: any;
  private addr: any;
  private calledfrom: any;
  private items: any;
  private isCloseClicked = false;
  private serviceCharge = 0;
  private expDelCharge = 0;
  private cbExpDel: boolean = false;
  private showProgressPayNow: boolean = false;
  private discountAmt: any;
  isPaytmDisabled = true;

  constructor(public appCtrl: App, private navCtrl: NavController, private param: NavParams, private viewCtrl: ViewController, private alertUtils: Utils, private apiService: GetService) {
  }

  ngOnInit() {
    this.items = this.param.get('items');
    this.calledfrom = this.param.get('from');
    this.addr = this.param.get('addr');
    this.totalCost = this.param.get("totalAmount");
    this.totalItem = this.param.get("totalItems");
    this.serviceCharge = this.param.get("servicecharge");
    this.expDelCharge = this.param.get("expressdelivery");
    this.cbExpDel = this.param.get("isExpdelivery");
    this.discountAmt = this.param.get("discountamt");
    this.orderResult = this.param.get("orderResult");
    Utils.sLog("orderresult : " + JSON.stringify(this.orderResult));
    this.alertUtils.getUserInfo().then(res => {
      if (res) {
        Utils.USER_INFO_DATA = res;
        // if (Utils.USER_INFO_DATA.acceptonlinepayment && Utils.USER_INFO_DATA.acceptonlinepayment == 1) {
        //   this.isPaytmDisabled = false; 
        // } // paytm button will enalbed if acceptonlinepayment == 1
      }
    }).catch(err => {
      this.alertUtils.showLog(err);
    });

  }

  paynow() {
   /* try {
      this.showProgressPayNow = true;

      if (this.orderResult && this.orderResult.data && this.orderResult.data.orderid) {
        this.alertUtils.showToast("Please wait while we process the payment");
        let txnRequest = {
          "ORDER_ID": "ORDER00" + this.orderResult.data.orderid,
          "MID": "" + Utils.APP_PAYTM_MID,
          "CUST_ID": "CUST00" + Utils.USER_INFO_DATA.userid,
          "CHANNEL_ID": "WAP",
          "INDUSTRY_TYPE_ID": "Retail",
          "WEBSITE": "APPSTAGING",
          "TXN_AMOUNT": "" + this.totalCost,
          "EMAIL": "abc@gmail.com",
          "CALLBACK_URL": "" + GetService.payTmCallBackUrl() + "ORDER00" + this.orderResult.data.orderid,
          "MOBILE_NO": "" + Utils.USER_INFO_DATA.mobileno
        };
        if (Utils.USER_INFO_DATA.email) {
          txnRequest.EMAIL = Utils.USER_INFO_DATA.email;
        }
        Utils.sLog("INPUT : " + JSON.stringify(txnRequest));
        this.apiService.postReq(GetService.payNowUrl(), txnRequest).then(res => {
          Utils.sLog("OUTPUT : " + JSON.stringify(res));
          if (res && res.data) {
            txnRequest['CHECKSUMHASH'] = res.data.CHECKSUMHASH;
            txnRequest['ENVIRONMENT'] = Utils.APP_PAYTM_ENV;
            this.openPaytmGateWay(txnRequest);
          } else {
            this.showProgressPayNow = false;
          }
        }, err => {
          Utils.sLog(err);
          this.showProgressPayNow = false;
        })
      } else {
        Utils.sLog("order id not found", this.orderResult);
        this.alertUtils.showToast("order id not found");
        this.showProgressPayNow = false;
      }
    } catch (error) {
      this.showProgressPayNow = false;
    }*/

  }

  openPaytmGateWay(txnRequest) {
    var self = this;
    Utils.sLog("paytm input : ", JSON.stringify(txnRequest));
    let successCallback = function (response) {
      if (response.STATUS == "TXN_SUCCESS") {
        Utils.sLog(response);
        let txn_id = response.TXNID;
        let paymentmode = response.PAYMENTMODE;
        // other details and function after payment transaction
        Utils.sLog(txn_id);
        Utils.sLog(paymentmode);
        self.updateOrder(response);
      } else {
        // error code will be available in RESPCODE
        // error list page https://docs.google.com/spreadsheets/d/1h63fSrAmEml3CYV-vBdHNErxjJjg8-YBSpNyZby6kkQ/edit#gid=2058248999
        Utils.sLog("Transaction successCallback for reason " + response.RESPMSG);
        Utils.sLog("Transaction Failed for reason " + response.RESPMSG);
        self.alertUtils.showToast("Transaction Failed for reason " + response.RESPMSG);
        self.showProgressPayNow = false;
      }
    };

    let failureCallback = function (error) {
      // error code will be available in RESCODE
      // error list page https://docs.google.com/spreadsheets/d/1h63fSrAmEml3CYV-vBdHNErxjJjg8-YBSpNyZby6kkQ/edit#gid=2058248999
      Utils.sLog("Transaction failureCallback for reason " + error.RESPMSG);
      Utils.sLog("Transaction Failed for reason " + error.RESPMSG);
      self.alertUtils.showToast("Transaction Failed for reason " + error.RESPMSG);
      self.showProgressPayNow = false;
    };
    paytm.startPayment(txnRequest, successCallback, failureCallback);
  }

  updateOrder(paytmResponse) {
    try {

      let input = {
        "order": {
          "transtype": "updatepaymentfororder",
          "cartid": this.orderResult.data.cartid,
          "orderid": this.orderResult.data.orderid,
          "paymentmode": "paytm",
          "received_amt": this.totalCost,
          "loginid": Utils.USER_INFO_DATA.userid,
          "customerid": Utils.USER_INFO_DATA.userid,
          "updatefrom": "customer",
          "dealerid": Utils.USER_INFO_DATA.superdealerid,
          "paytmresponse": paytmResponse,
          "apptype": APP_TYPE,
          "usertype": APP_USER_TYPE
        }
      };
      Utils.sLog(GetService.updateOrder() + " INPUT : " + JSON.stringify(input));
      this.apiService.postReq(GetService.updateOrder(), input).then(res => {
        Utils.sLog(GetService.updateOrder() + " OUTPUT :" + JSON.stringify(res));
        if (res.result == RES_SUCCESS && res.data) {
          this.showProgressPayNow = true;
          this.alertUtils.showToast("Transaction completed");
          this.close();
        } else {
          this.alertUtils.showToast(TRY_AGAIN_ERR_MSG);
        }
      }).catch(err => {
        Utils.sLog(err);
        this.showProgressPayNow = false;
      });

    } catch (error) {
      Utils.sLog(error);
      this.showProgressPayNow = false;
    }
  }
  paylater() {
    this.close();
  }
  close() {
    if (this.calledfrom == "confirmorderpage") {
      Utils.UPDATE_ORDER_LIST = true;
      // this.appCtrl.getRootNav().setRoot(TabsPage, { from: "orderconfirmation" });
      this.navCtrl.setRoot(AboutPage);

    } else if (this.calledfrom == "reorder") {
      this.viewCtrl.dismiss("success");

    } else {
      Utils.UPDATE_ORDER_LIST = true;
      this.isCloseClicked = true;
      // this.appCtrl.getRootNav().setRoot(TabsPage,{from:"orderconfirmation"});
      this.navCtrl.push(MapView, { from: "orderconfirmation" }).then(ready => {
        // this.navCtrl.pop();
        const index = this.viewCtrl.index;
        // then we remove it from the navigation stack
        this.navCtrl.remove(index);
      })
    }
  }
}
