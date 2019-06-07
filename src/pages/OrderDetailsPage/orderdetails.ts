import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { AlertController, App, Content, IonicPage, ModalController, NavController, NavParams } from "ionic-angular";
import { APP_TYPE, APP_USER_TYPE, INTERNET_ERR_MSG, RES_SUCCESS, Utils, IS_WEBSITE } from "../../app/services/Utils";
import { GetService } from "../../app/services/get.servie";
// import { TabsPage } from "../tabs/tabs";
import { TranslateService } from "@ngx-translate/core";
import { MapView } from "../MapView/MapView";

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'orderdetails.html'
})

export class OrderDetails {
  model: any;
  @ViewChild(Content) content: Content;
  testRadioResult: any;
  testRadioOpen: boolean;
  item: any;
  fetchDone: boolean = false;
  showProgress = true;
  tabBarElement: any;
  editorMsg: string = "";
  private loginStatus: boolean = false;
  private dealerID = "";
  private userID = "";
  private callFrom = "";
  private orderId = "";
  categoryid = "";
  orderProductList = [];
  order: any;

  constructor(private modalCtrl: ModalController, private translateService: TranslateService, private ref: ChangeDetectorRef, public appCtrl: App, public navCtrl: NavController, public param: NavParams, public alertUtils: Utils, public alertCtrl: AlertController, private apiService: GetService, public translate: TranslateService) {

    let lang = "en";
    if (Utils.lang) {
      lang = Utils.lang
    }
    // translateService.setDefaultLang(lang);
    translateService.use(lang);

    this.callFrom = this.param.get("callfrom");
    this.order = this.param.get("order");
    if (IS_WEBSITE) {
      this.userID = Utils.USER_INFO_DATA.userid;
      this.dealerID = Utils.USER_INFO_DATA.superdealerid;
      if (this.order && this.order.order_id) {
        this.fetchOrderDetails();
        this.fetchOrderProducts();
      }
      else
        Utils.sLog("order id not found");
    }
  }




  close() {
    this.appCtrl.getRootNav().setRoot(MapView, { from: "pushnotification" });
  }

  ngOnInit() {
    console.log("ngOnInit");
    this.alertUtils.getLoginState().then(res => {
      if (res) {
        this.loginStatus = res;
        this.alertUtils.getDealerId().then(res => {
          if (res) {
            this.dealerID = res;
            this.alertUtils.getUserId().then(res => {
              if (res) {
                this.userID = res;
                this.fetchOrderDetails();
                this.fetchOrderProducts();
              }
            })
          }
        });
      }
    }).catch(err => {
      this.alertUtils.showLog(err);
    });

  }

  fetchOrderProducts() {
    let input = { "root": { "userid": Utils.USER_INFO_DATA.userid, "usertype": APP_USER_TYPE, "orderid": this.order.order_id, "categoryid": this.order.category.categoryid, "apptype": APP_TYPE } }

    this.apiService.postReq(GetService.getProductsByOrderid(), input).then(res => {
      console.log(res);
      if (res && res.data) {
        this.orderProductList = res.data;
      }
    })
  }

  fetchOrderDetails() {
    try {
      this.apiService.getReq(this.apiService.getOrderDetails() + this.order.order_id + "/" + this.userID).then(res => {
        this.showProgress = false;
        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          this.alertUtils.showLog(res.data[0]);
          this.item = res.data[0];
          if (this.item.status == "assigned" || this.item.status == "delivered") {
            if (this.item.supplierdetails) {
              this.item["showassignstatus"] = true;
              if (this.item.supplierdetails.lastname) {
                this.item["suppliername"] = this.item.supplierdetails.firstname + " " + this.item.supplierdetails.lastname;
              } else
                this.item["suppliername"] = this.item.supplierdetails.firstname;
            } else {
              this.item["showassignstatus"] = false;
            }
            if (this.item.status == "delivered")
              this.item["showdeliveredstatus"] = true
          }
          if (this.item.status == "onhold") {
            this.item["orderstatus"] = "Onhold";
            this.item["statusColor"] = "warning";
            this.item["trackingmessage"] = "We have put your order on-hold as our supplier can't deliver, sorry for the inconvenience caused";
          } else if (this.item.status == "Cancelled" || this.item.status == "cancelled") {
            this.item["orderstatus"] = "Cancelled";
            this.item["statusColor"] = "danger";
            this.item["trackingmessage"] = "Not delivered: Cancelled";
            this.item["assigncolor"] = "danger";
            this.item["completedcolor"] = "danger";
          }
          else if (this.item.status == "rejected" || this.item.status == "Rejected") {
            this.item["orderstatus"] = "Rejected";
            this.item["statusColor"] = "danger";
            this.item["trackingmessage"] = "Not delivered: Rejected";
            this.item["assigncolor"] = "warning";
            this.item["completedcolor"] = "danger";
          }
          else if (this.item.status == "accept") {
            this.item["statusColor"] = "warning";
            this.item["orderstatus"] = "Assigned to service engineer";
            this.item["trackingmessage"] = "Delivered";
            this.item["assigncolor"] = "success";
            this.item["completedcolor"] = "";
          } else if (this.item.status == "orderstarted") {
            this.item["statusColor"] = "warning";
            this.item["orderstatus"] = "Service engineer on the way";
            this.item["trackingmessage"] = "Delivered";
            this.item["assigncolor"] = "success";
            this.item["onthewaycolor"] = "success";            
            this.item["completedcolor"] = "";
          }else if (this.item.status == "jobstarted") {
            this.item["statusColor"] = "warning";
            this.item["orderstatus"] = "Service engineer on the way";
            this.item["trackingmessage"] = "Delivered";
            this.item["assigncolor"] = "success";
            this.item["onthewaycolor"] = "success";   
            this.item["jobstartedcolor"] = "success";                     
            this.item["completedcolor"] = "";
          } else if (this.item.status == "delivered" || this.item.status == "Delivered") {
            this.item["orderstatus"] = "Delivered";
            this.item["statusColor"] = "success";
            this.item["trackingmessage"] = "Delivered";
            this.item["assigncolor"] = "success";
            this.item["assigncolor"] = "success";
            this.item["onthewaycolor"] = "success";   
            this.item["jobstartedcolor"] = "success";      
            this.item["completedcolor"] = "success";
          } else if (this.item.status == "doorlock" || this.item.status == "Door Locked") {
            this.item["orderstatus"] = "Door Locked";
            this.item["statusColor"] = "warning";
            this.item["trackingmessage"] = "Not delivered: Door - Locked";
            this.item["assigncolor"] = "warning";
            this.item["completedcolor"] = "warning";
          } else if (this.item.status == "cannot_deliver" || this.item.status == "Cant Deliver") {
            this.item["orderstatus"] = "Cant Deliver";
            this.item["statusColor"] = "warning";
            this.item["trackingmessage"] = "We have put your order on-hold as our supplier can't deliver, sorry for the inconvenience caused";
            this.item["assigncolor"] = "warning";
            this.item["completedcolor"] = "warning";
          } else if (this.item.status == "Not Reachable" || this.item.status == "not_reachable") {
            this.item["orderstatus"] = "Not Reachable";
            this.item["statusColor"] = "warning";
            this.item["assigncolor"] = "warning";
            this.item["completedcolor"] = "warning";
            this.item["trackingmessage"] = "Your order is unable to deliver due to your un-availablity";
          } else if (this.item.status == "pending") {
            this.item["orderstatus"] = "Pending";
            this.item["statusColor"] = "primary";
            this.item["trackingmessage"] = "Delivered";
          } else if (this.item.status == "ordered" || this.item.status == "backtodealer") {
            this.item["orderstatus"] = "Order Placed";
            this.item["statusColor"] = "warning";
            this.item["trackingmessage"] = "Delivered";
          } else {
            this.item["orderstatus"] = this.item.status;
          }
          if (this.item.messages) {
            let arr = [];
            for (let i = 0; i < this.item.messages.length; i++) {
              this.alertUtils.showLog(this.item.messages[i].ispublic);
              if (this.item.messages[i].ispublic == 0) {
                arr.push(this.item.messages[i]);
              }
            }
            this.item.messages = arr;
          }
          this.ref.detectChanges();
          this.alertUtils.showLog(this.item);
        }
      }, err => {
        this.alertUtils.showLog(err);
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  cancelOrder(item) {
    // this.showRadio(item)
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
          this.cancelOrderTask(item.order_id, data)
        } else {
          this.alertUtils.showAlert("CONNECTION ERROR", INTERNET_ERR_MSG, "OK");
        }
      }
    });

  }

  cancelOrderTask(orderid: string, reason: string) {
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
      if (res.result == RES_SUCCESS) {
        this.alertUtils.showToast("Order successfully cancelled");
        Utils.UPDATE_ORDER_LIST = true;
        this.item.status = "Cancelled";
        if (this.orderId)
          this.fetchOrderDetails();

      }
    }).catch(error => {
      this.alertUtils.showLog(error)
    });
  }

  sendMessage(item) {
    // this.showPrompt(item)
    if (this.alertUtils.validateText(this.editorMsg, "Message", 3, 250)) {
      this.createMessage(item, this.editorMsg)
    } else {
      this.alertUtils.showToast(this.alertUtils.ERROR_MES);
    }
  }

  onFocus() {
    this.content.resize();
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }


  callNow(number) {

    let alert = this.alertCtrl.create({
      title: 'Alert',
      message: 'Are you sure you want to call this number?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.alertUtils.callNumber(number);
          }
        }
      ]
    });
    alert.present();
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
    this.alertUtils.showLog(this.item);
    this.apiService.postReq(this.apiService.createMessageOnOrder(), data).then(res => {
      this.alertUtils.showLog(res);
      if (res.result == RES_SUCCESS) {
        this.alertUtils.showToast("Message sent successfully ");
        if (!this.item.messages)
          this.item.messages = [];
        this.item.messages.push(sendMes);
        this.editorMsg = "";
        this.scrollToBottom();
      } else {
        this.alertUtils.showToast("Message failed ");
      }
    }).catch(error => {
      this.alertUtils.showLog(error)
    });
  }
}
