import {ChangeDetectorRef, Component, ElementRef, ViewChild} from "@angular/core";
import {AlertController, App, ModalController, NavController, NavParams} from "ionic-angular";
import {
  APP_TYPE,
  APP_USER_TYPE,
  INTERNET_ERR_MSG,
  IS_WEBSITE,
  RES_SUCCESS,
  TRY_AGAIN_ERR_MSG,
  Utils
} from "../../app/services/Utils";
import {GetService} from "../../app/services/get.servie";
import {TabsPage} from "../tabs/tabs";
import {ProductsPage} from "../ProductsPage/ProductsPage";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
  commentsText: string = "";
  @ViewChild('chat_input') messageInput: ElementRef;
  showProgress = true;
  tabBarElement: any;
  editorMsg: string = "";
  private response: any;
  private loginStatus: boolean = false;
  private dealerID = "";
  private userID = "";
  private png = ".png";
  private calledfrom: string = "";
  private noRecords = false;
  private model: any;

  constructor(private modalCtrl: ModalController, public appCtrl: App, private ref: ChangeDetectorRef, public alertCtrl: AlertController, public navCtrl: NavController, private param: NavParams, public alertUtils: Utils, private apiService: GetService) {
    if (IS_WEBSITE) {
      this.userID = Utils.USER_INFO_DATA.userid;
      this.dealerID = Utils.USER_INFO_DATA.superdealerid;
      this.fetchOrders(false, false, true, "", "");
    }
    try {
      this.calledfrom = this.param.get('callfrom');
      if (this.calledfrom) {
        this.alertUtils.showLog("----------" + this.calledfrom);
      }
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  close() {
    this.appCtrl.getRootNav().setRoot(TabsPage, {from: "pushnotification"});
  }

  closeEmptyDialog() {
    // if (this.model) {
    //   this.model.dismiss();
    // }
  }

  trackOrder(item) {

  }

  editAddr(item) {
    this.model = this.modalCtrl.create('EditAddressPage', {
      addr: item.orderby_address,
      landmark: item.orderby_locality,
      buildingname: item.orderby_buildingname
    }, {
      showBackdrop: true,
      enableBackdropDismiss: true,
      cssClass: 'editaddr'
    });
    this.model.present();
    this.model.onDidDismiss(data => {
      if (data) {
        this.alertUtils.showLog(data);
        if (this.alertUtils.networkStatus()) {
          this.updateOrderTask(data, item);
        } else {
          this.alertUtils.showAlert("INTERNET CONNECTION", INTERNET_ERR_MSG, "OK");
        }
      }
    });

  }

  updateOrderTask(addrData, item) {

    let data = {
      "order": {
        "orderid": item.order_id,
        "loginid": this.userID,
        "dealerid": this.dealerID,
        "apptype": APP_TYPE,
        "delivery_address": addrData.addr,
        "delivery_locality": addrData.landmark,
        "delivery_buildingname": addrData.buildingname
      }
    };
    let input = JSON.stringify(data);
    this.alertUtils.showLoading();
    this.apiService.postReq(GetService.updateOrder(), input).then(res => {
      this.alertUtils.showLog(res);
      this.alertUtils.hideLoading();
      if (res.result == RES_SUCCESS) {
        if (res.data) {
          item.orderby_address = addrData.addr;
          item.orderby_locality = addrData.landmark;
          item.orderby_buildingname = addrData.buildingname;
          this.alertUtils.showToast("Order address updated successfully");
        } else
          this.alertUtils.showToast(TRY_AGAIN_ERR_MSG);

      } else {
        this.alertUtils.showToast(TRY_AGAIN_ERR_MSG);
      }
    }).catch(err => {
      this.alertUtils.hideLoading();
      this.alertUtils.showLog(err);
    });
  }

  editOrder(item) {

    let model = this.modalCtrl.create(ProductsPage, {
      calledfrom: "myorders",
      orderitem: item
    });
    model.present();
    model.onDidDismiss(res => {
      if (res) {
        this.fetchOrders(false, false, true, "", "");
      }
    });

  }

  viewComplainDialog(item) {
    let model = this.modalCtrl.create('RaiseComplainPage', {
      data: item
    }, {
      showBackdrop: false,
      enableBackdropDismiss: false,
      cssClass: 'raiserequestdialog'
    });
    model.present();
  }

  callUs() {
    this.alertUtils.callNumber("9863636314");
  }


  ngOnInit() {
    this.fetchData();
  }

  ionViewWillEnter() {

    if (Utils.UPDATE_ORDER_LIST) {
      this.fetchData();
      Utils.UPDATE_ORDER_LIST = true;

    }
  }

  fetchData() {
    try {
      this.alertUtils.getLoginState().then(resStatus => {
        if (resStatus) {
          this.loginStatus = resStatus;
          this.alertUtils.getUserId().then(resUID => {
            if (resUID) {
              this.alertUtils.showLog("UID" + resUID);
              this.userID = resUID;
              this.alertUtils.getDealerId().then(resDID => {
                if (resDID) {
                  this.alertUtils.showLog("DID" + resDID);
                  this.dealerID = resDID;
                  this.fetchOrders(false, false, true, "", "");
                }
              });
            }
          });
        }
      }).catch(err => {
        this.alertUtils.showLog(err);
      });
      this.alertUtils.getUserInfo().then(user => {
        Utils.USER_INFO_DATA = user;
      }).catch(err => {
        this.alertUtils.showLog(err);
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  doRefresh(refresher) {
    this.fetchOrders(false, true, false, "", refresher);
    setTimeout(() => {
      refresher.complete();
    }, 30000);
  }

  doInfinite(paging): Promise<any> {
    if (this.response) {
      if (this.response.length > 0)
        this.fetchOrders(true, false, false, paging, "");
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


  fetchOrders(isPaging: boolean, isRefresh: boolean, isFrist: boolean, paging, refresher) {
    try {
      let input = {
        "order": {
          "userid": this.userID,
          "priority": this.userID,
          "usertype": APP_USER_TYPE,
          "status": "all",
          "lastrecordtimestamp": "15",
          "pagesize": "10",
          "apptype": APP_TYPE
        }
      };
      if (isPaging) {
        input.order["last_orderid"] = this.response[this.response.length - 1].order_id;
      }
      let data = JSON.stringify(input);
      if (isFrist) {
        this.showProgress = true;
      }
      this.apiService.postReq(this.apiService.getOrderListByStatus(), data).then(res => {
        this.hideProgress(isFrist, isRefresh, isPaging, paging, refresher);
        this.alertUtils.showLog(res);
        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.noRecords = false;
          if (!isPaging)
            this.response = res.data;
          for (let i = 0; i < res.data.length; i++) {
            res.data[i]["commentstext"] = "Show Comments";
            res.data[i]["showcommentsbox"] = false;
            if (res.data[i].status == "onhold") {
              res.data[i]["orderstatus"] = "Onhold";
              res.data[i]["statusColor"] = "warning";
              res.data[i]["trackingmessage"] = "We have put your order on-hold as our supplier can't deliver, sorry for the inconvenience caused";
              if (res.data[i].supplierdetails)
                res.data[i]["defindimg"] = this.apiService.getImg() + "supplier_" + res.data[i].supplierdetails.userid;
            } else if (res.data[i].status == "Cancelled" || res.data[i].status == "cancelled") {
              res.data[i]["orderstatus"] = "Cancelled";
              res.data[i]["statusColor"] = "danger";
              res.data[i]["trackingmessage"] = "Not delivered: Cancelled";
              res.data[i]["assigncolor"] = "danger";
              res.data[i]["completedcolor"] = "danger";
              if (res.data[i].order_by)
                res.data[i]["defindimg"] = this.apiService.getImg() + "customer_" + res.data[i].order_by;
            } else if (res.data[i].status == "rejected" || res.data[i].status == "Rejected") {
              res.data[i]["orderstatus"] = "Rejected";
              res.data[i]["statusColor"] = "danger";
              res.data[i]["trackingmessage"] = "Not delivered: Rejected";
              res.data[i]["assigncolor"] = "warning";
              res.data[i]["completedcolor"] = "danger";
              if (res.data[i].supplierdetails)
                res.data[i]["defindimg"] = this.apiService.getImg() + "supplier_" + res.data[i].supplierdetails.userid;
            } else if (res.data[i].status == "assigned") {
              res.data[i]["statusColor"] = "warning";
              res.data[i]["orderstatus"] = "Assigned to supplier";
              res.data[i]["trackingmessage"] = "Delivered";
              res.data[i]["assigncolor"] = "success";
              res.data[i]["completedcolor"] = "";
              if (res.data[i].supplierdetails)
                res.data[i]["defindimg"] = this.apiService.getImg() + "supplier_" + res.data[i].supplierdetails.userid;
            } else if (res.data[i].status == "delivered" || res.data[i].status == "Delivered") {
              res.data[i]["orderstatus"] = "Delivered";
              res.data[i]["statusColor"] = "success";
              res.data[i]["trackingmessage"] = "Delivered";
              res.data[i]["assigncolor"] = "success";
              res.data[i]["completedcolor"] = "success";

              if (res.data[i].supplierdetails)
                res.data[i]["defindimg"] = this.apiService.getImg() + "supplier_" + res.data[i].supplierdetails.userid;
            } else if (res.data[i].status == "doorlock" || res.data[i].status == "Door Locked") {
              res.data[i]["orderstatus"] = "Door Locked";
              res.data[i]["statusColor"] = "warning";
              res.data[i]["trackingmessage"] = "Not delivered: Door - Locked";
              res.data[i]["assigncolor"] = "warning";
              res.data[i]["completedcolor"] = "warning";
              if (res.data[i].supplierdetails)
                res.data[i]["defindimg"] = this.apiService.getImg() + "supplier_" + res.data[i].supplierdetails.userid;
            } else if (res.data[i].status == "cannot_deliver" || res.data[i].status == "Cant Deliver") {
              res.data[i]["orderstatus"] = "Cant Deliver";
              res.data[i]["statusColor"] = "warning";
              res.data[i]["trackingmessage"] = "We have put your order on-hold as our supplier can't deliver, sorry for the inconvenience caused";
              res.data[i]["assigncolor"] = "warning";
              res.data[i]["completedcolor"] = "warning";
              if (res.data[i].supplierdetails)
                res.data[i]["defindimg"] = this.apiService.getImg() + "supplier_" + res.data[i].supplierdetails.userid;
            } else if (res.data[i].status == "Not Reachable" || res.data[i].status == "not_reachable") {
              res.data[i]["orderstatus"] = "Not Reachable";
              res.data[i]["statusColor"] = "warning";
              res.data[i]["assigncolor"] = "warning";
              res.data[i]["completedcolor"] = "warning";
              res.data[i]["trackingmessage"] = "Your order is unable to deliver due to your un-availability";
              if (res.data[i].supplierdetails)
                res.data[i]["defindimg"] = this.apiService.getImg() + "supplier_" + res.data[i].supplierdetails.userid;
            } else if (res.data[i].status == "pending") {
              res.data[i]["orderstatus"] = "Pending";
              res.data[i]["statusColor"] = "primary";
              res.data[i]["trackingmessage"] = "Delivered";
              if (res.data[i].supplierdetails)
                res.data[i]["defindimg"] = this.apiService.getImg() + "supplier_" + res.data[i].supplierdetails.userid;
            } else if (res.data[i].status == "ordered" || res.data[i].status == "backtodealer" || res.data[i].status.toLowerCase() == "accept") {
              res.data[i]["orderstatus"] = "Order Placed";
              res.data[i]["statusColor"] = "warning";
              res.data[i]["trackingmessage"] = "Delivered";
              if (res.data[i].dealerdetails)
                res.data[i]["defindimg"] = this.apiService.getImg() + "dealer_" + res.data[i].dealerdetails.userid;
            } else {
              res.data[i]["orderstatus"] = res.data[i].status;
              if (res.data[i].dealerdetails)
                res.data[i]["defindimg"] = this.apiService.getImg() + "supplier_" + res.data[i].dealerdetails.userid;
            }
            if (res.data[i].paymenttype == "cod"
              || res.data[i].paymenttype == "cash") {
              res.data[i].paymenttype = "COD";
            } else if (res.data[i].paymenttype == "credit") {
              res.data[i].paymenttype = "CREDIT";
            }
            if (isPaging)
              this.response.push(res.data[i]);
          }
        } else {
          if (!isPaging)
            this.noRecords = true;
        }
        this.ref.detectChanges();
      }).catch(error => {
        this.hideProgress(isFrist, isRefresh, isPaging, paging, refresher);
        this.alertUtils.showToast(this.alertUtils.INTERNET_ERR_MSG);
        this.alertUtils.showLog(error)
      });
    } catch (e) {
      this.hideProgress(isFrist, isRefresh, isPaging, paging, refresher);
      this.alertUtils.showLog(e);
    }
  }

  showComments(item, pos) {
    if (item.commentstext == "Show Comments") {
      this.fetchOrderDetails(item, pos)
    } else {
      item.showcommentsbox = false;
      item.commentstext = "Show Comments"
    }
  }

  fetchOrderDetails(item, pos) {
    try {
      this.alertUtils.showLoading();
      this.apiService.getReq(this.apiService.getOrderDetails() + item.order_id + "/" + this.userID).subscribe(res => {
        this.alertUtils.hideLoading();
        this.alertUtils.showLog(res);
        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          if (res.data && res.data[0] && res.data[0].messages) {
            this.alertUtils.showLog(res.data[0].messages);
            let arr = [];
            for (let i = 0; i < res.data[0].messages.length; i++) {
              console.log(res.data[0].messages[i].ispublic);
              if (res.data[0].messages[i].ispublic == 0) {
                arr.push(res.data[0].messages[i]);
              }
            }
            this.response[pos]["messages"] = arr;
            if (arr.length > 0) {
              item.commentstext = "Hide Comments";
              // if (this.messageInput && this.messageInput.nativeElement) {
              //   this.messageInput.nativeElement.focus();
              // }
            }
            this.alertUtils.showLog(this.response[pos].messages);
            this.ref.detectChanges();
          }
          item.showcommentsbox = true;
        }
      }, err => {
        this.alertUtils.showLog(err);
        this.alertUtils.hideLoading();
      });
    } catch (e) {
      this.alertUtils.hideLoading();
      this.alertUtils.showLog(e);
    }
  }

  sendMsg(item) {
    if (this.alertUtils.validateText(this.editorMsg, "Message", 2, 250)) {
      this.createMessage(item, this.editorMsg);
    } else {
      this.alertUtils.showToast(this.alertUtils.ERROR_MES);
    }
  }

  createMessage(item: any, message: string) {
    let input = {
      "order": {
        "orderid": item.order_id,
        "customerid": this.userID,
        "usertype": APP_USER_TYPE,
        "orderstatus": "Message",
        "reason": message,
        "ispublic": "0",
        "loginid": this.userID,
        "apptype": APP_TYPE
      }
    };
    this.alertUtils.showLog(JSON.stringify(input));
    let data = JSON.stringify(input);
    let myDate: string = new Date().toISOString();
    let sendMes = {
      "createddate": myDate,
      "message": message,
      "ispublic": "0",
      "user": {
        "firstname": Utils.APP_USER_NAME, "lastname": "", "userid": this.userID
      }
    };
    this.apiService.postReq(this.apiService.createMessageOnOrder(), data).then(res => {
      this.alertUtils.showLog(res);
      if (res.result == RES_SUCCESS) {
        this.editorMsg = "";
        this.alertUtils.showToast("Message sent successfully ");
        if (!item.messages)
          item.messages = [];
        item.messages.push(sendMes);
        this.ref.detectChanges();
      } else {
        this.alertUtils.showToast("Message failed ");
      }
    }).catch(error => {
      this.alertUtils.showLog(error)
    });
  }

  hideProgress(isFirst, isRefresh, isPaging, paging, refresher) {
    if (isFirst) {
      this.showProgress = false;
    }
    if (isPaging) {
      paging.complete();
    }
    if (isRefresh) {
      refresher.complete();
    }
  }

  viewOrderDetails(item) {
    try {
      this.navCtrl.push('OrderDetails', {
        callfrom: "myorders",
        order: item
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  cancelOrder(item) {
    this.model = this.modalCtrl.create('CancelOrderPage', {}, {
      showBackdrop: false,
      enableBackdropDismiss: false,
      cssClass: 'raiserequestdialog'
    });
    this.model.present();
    this.model.onDidDismiss(data => {
      if (data) {
        this.alertUtils.showLog(data);
        if (this.alertUtils.networkStatus()) {
          this.cancleOrderTask(item.order_id, data);
        } else {
          this.alertUtils.showAlert("INTERNET CONNECTION", INTERNET_ERR_MSG, "OK");
        }
      }
    });
    // this.showRadio(item)
  }

  cancleOrderTask(orderid: string, reason: string) {
    let input = {
      "order": {
        "orderid": orderid,
        "customerid": this.userID,
        "usertype": APP_USER_TYPE,
        "orderstatus": "cancelled",
        "reason": reason,
        "loginid": this.userID,
        "apptype": APP_TYPE
      }
    };
    this.alertUtils.showLog(JSON.stringify(input));
    let data = JSON.stringify(input);
    this.apiService.postReq(this.apiService.cancelOrder(), data).then(res => {
      this.alertUtils.showLog(res);
      if (res.result == this.alertUtils.RESULT_SUCCESS) {
        this.alertUtils.showToast("Order successfully cancelled");
        for (let i = 0; i < this.response.length; i++) {
          if (orderid == this.response[i].order_id) {
            this.response[i].orderstatus = "Cancelled";
            this.response[i].statusColor = "danger";
            this.response[i].status = "Cancelled";
            this.response[i].trackingmessage = "Not delivered: Cancelled";
            this.response[i].assigncolor = "danger";
            this.response[i].completedcolor = "danger";
          }
        }
      } else {
        this.alertUtils.showToast(TRY_AGAIN_ERR_MSG);
      }
    }).catch(error => {
      this.alertUtils.showToast(TRY_AGAIN_ERR_MSG);
      this.alertUtils.showLog(error)
    });
  }
}
