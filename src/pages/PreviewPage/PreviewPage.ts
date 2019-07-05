import {ChangeDetectorRef, Component, ViewChild} from "@angular/core";
import {
  AlertController,
  IonicPage,
  ModalController,
  NavController,
  NavParams,
  Platform,
  ViewController,
  Content
} from "ionic-angular";
import {
  APP_TYPE,
  APP_USER_TYPE,
  FRAMEWORK,
  INTERNET_ERR_MSG,
  MOBILE_TYPE,
  RES_SUCCESS,
  TRY_AGAIN_ERR_MSG,
  Utils
} from "../../app/services/Utils";
import { GetService } from "../../app/services/get.servie";
import { Geolocation } from "@ionic-native/geolocation";
import { LatLng } from "@ionic-native/google-maps";
import { OrderConfirmation } from "../OrderConfirmationDialog/orderconfirmation";
import { MapView } from "../MapView/MapView";
import { Diagnostic } from "@ionic-native/diagnostic";
import { TranslateService } from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'preview-page',
  templateUrl: 'PreviewPage.html'
})
export class PreviewPage {
  @ViewChild(Content) content: Content;
  private proddata: any;
  orderItem: any;
  tabBarElement: any;
  private userUpdateLatLng: any;
  private showAddrProgress: boolean = false;
  private items: any;
  private dateOfevent: string;
  private deliveryAddr: any;
  private totalCost: any;
  private totalItem: any;
  private showDiscount: boolean = true;
  private minDate: any = new Date().toISOString();
  private loginStatus: boolean = false;
  private showDiscountProgress: boolean = false;
  private dealerID = "";
  private userID = "";
  private landmark = "";
  private buildingName = "";
  private loc: LatLng;
  private deliverySlot: any;
  private rbChecked: boolean = true;
  private slot1: boolean = false;
  private slot2: boolean = false;
  private slot3: boolean = false;
  private slot4: boolean = false;
  private cbExpDel: boolean = false;
  private isLatLngCheck: boolean = false;
  private showMap: boolean = true;
  private cHour: any;
  private date: any;
  private selectProducts = [];
  private discountCode: string = "";
  private validPromoCodeData: any;
  private serviceCharge = 0;
  private expDelCharge = 0;
  private advanceAmt = 0;
  private prodSelectedCount: number = 0;
  private totalAmount: any;
  private errorPromoText = "";
  private discountAmt: any;
  private calledFrom: string = "";
  private altmobileno: string = "";
  remarks: string = "";



  constructor(private translateService: TranslateService, private viewCtrl: ViewController, private diagnostic: Diagnostic, public navCtrl: NavController, public param: NavParams, public alertUtils: Utils, private getService: GetService, private alertCtrl: AlertController, private modalCtrl: ModalController, private geolocation: Geolocation, public platform: Platform,private ref:ChangeDetectorRef) {
    try {
      translateService.setDefaultLang('en');
      translateService.use('en');

      this.calledFrom = param.get("from");
      this.items = param.get("item");
      this.totalCost = param.get("totalAmount");
      this.totalItem = param.get("totalItems");
      this.proddata = param.get("savingobj");
      Utils.sLog(this.proddata);
      if (this.calledFrom == "myorders") {
        this.orderItem = param.get("orderitem");
        this.showMap = false;
        Utils.sLog("In Preview Page");
        Utils.sLog(this.orderItem);

      }
      this.alertUtils.showLog(this.totalCost + " " + this.totalItem);
      if (this.items) {
        this.serviceCharge = 0;
        this.expDelCharge = 0;
        for (let i = 0; i < this.items.length; i++) {
          if (parseInt(this.items[i].selectedCount) > 0) {
            this.items[i].count = parseInt(this.items[i].selectedCount);
            this.selectProducts.push(this.items[i]);
            this.prodSelectedCount++;
            if (this.items[i].servicecharge && this.items[i].servicecharge > 0) {
              this.serviceCharge = this.serviceCharge + (this.items[i].servicecharge * this.items[i].count);
              this.alertUtils.showLog("Service charge" + this.items[i].servicecharge);
            }
            if (this.items[i].expressdeliverycharges && this.items[i].expressdeliverycharges > 0) {
              this.expDelCharge = this.expDelCharge + this.items[i].expressdeliverycharges;
              this.alertUtils.showLog("Express delivery" + this.items[i].expressdeliverycharges);
            }
            if (this.items[i].emptycan) {
              if (this.items[i].emptycount)
                if (this.items[i].emptycount == this.items[i].count) {
                  this.items[i]["mdemptycount"] = 0;
                } else {
                  this.items[i]["mdemptycount"] = this.items[i].count - this.items[i].emptycount;
                  this.advanceAmt = this.advanceAmt + ((this.items[i].count - this.items[i].emptycount) * 150);
                }
            } else {
              this.items[i]["mdemptycount"] = this.items[i].count;
              this.advanceAmt = this.advanceAmt + (this.items[i].count * 150);

            }

          }
        }
        this.alertUtils.showLog(this.selectProducts);
        this.alertUtils.showLog("sel count : " + this.prodSelectedCount);
        this.totalAmount = this.totalCost + this.serviceCharge + this.advanceAmt;
        this.alertUtils.showLog(" TOTAL Service charge" + this.serviceCharge);
        this.alertUtils.showLog(" TOTAL Express delivery" + this.expDelCharge);
        this.alertUtils.showLog(" TOTAL Advance amount" + this.advanceAmt);
        if (this.calledFrom == "myorders") {
          if (this.expDelCharge && this.expDelCharge > 0) {
            if (this.orderItem && this.orderItem.expressdeliverycharges && this.orderItem.expressdeliverycharges > 0) {
              this.cbExpDel = true;
              this.totalAmount = this.totalAmount + this.expDelCharge;

            }

          }
        }
      }
      this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    } catch (e) {
      this.alertUtils.showLog(e);
    }


  }


  checkClick() {
    if (this.cbExpDel) {
      this.totalAmount = this.totalAmount + this.expDelCharge;
    } else {
      this.totalAmount = this.totalAmount - this.expDelCharge;
    }
  }

  ionViewWillLeave() {
    try {
      this.tabBarElement.style.display = 'flex';
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  pickAddress() {
    this.diagnostic.isLocationEnabled().then(enable => {
      if (enable) {
        if (this.calledFrom == 'myorders') {
          let model = this.modalCtrl.create(MapView, {
            from: "myorders",
          });
          model.present();
          model.onDidDismiss(res => {
            if (res) {
              this.alertUtils.showLog(res);
              this.deliveryAddr = res.address;
              this.loc = new LatLng(res.lat, res.lng);
              this.isLatLngCheck = true;
              this.showUpdateAddressAlert();
            }
          });
        } else {
          this.navCtrl.push(MapView, {
            from: "myprofile"
          });
        }
      } else {
        this.alertUtils.dialogForLocationSetting("LOCATION", "Your GPS seems to be disabled, please enable it", "OK");
      }
    }, reason => {
      this.alertUtils.showAlert("LOCATION ERROR", reason.toString(), "OK");
    });
  }

  editAddr() {
    let model = this.modalCtrl.create('EditAddressPage', {
      addr: this.deliveryAddr,
      landmark: this.landmark,
      buildingname: this.buildingName
    }, {
        showBackdrop: true,
        enableBackdropDismiss: true,
        cssClass: 'editaddr'
      });
    model.present();
    model.onDidDismiss(data => {
      if (data) {
        this.alertUtils.showLog(data);
        this.deliveryAddr = data.addr;
        this.landmark = data.landmark;
        this.buildingName = data.buildingname;
        this.showUpdateAddressAlert();
      }
    });

  }

  ionViewWillEnter() {
    try {
      this.tabBarElement.style.display = 'none';
      Utils.sLog("ionViewWillEnter called");
      let myGetPageRes = this.param.get('myDataKey') || null;
      this.alertUtils.showLog(myGetPageRes);
      if (myGetPageRes) {
        this.alertUtils.showLog(JSON.stringify(myGetPageRes));
        if (myGetPageRes.from == "mapview") {
          this.deliveryAddr = myGetPageRes.address;
          this.loc = new LatLng(myGetPageRes.lat, myGetPageRes.lng);
          this.isLatLngCheck = true;
          this.showUpdateAddressAlert();
        }
      }
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }


  scrollToBottom() {
    setTimeout(() => {
      if (this.content.scrollToBottom) {
        this.content.scrollToBottom();
      }
    }, 400)
  }
  fetchGeoAddr() {
    try {
      if (this.alertUtils.networkStatus()) {
        this.alertUtils.geoLocationStatus().then(enable => {
          if (enable) {
            this.showAddrProgress = true;
            this.geolocation.getCurrentPosition().then((resp) => {
              this.loc = new LatLng(resp.coords.latitude, resp.coords.longitude);
              this.userUpdateLatLng = this.loc;
              let url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + this.loc.lat + ',' + this.loc.lng + '&key=AIzaSyDoS0Blw09XR34phjQ4BGF6v8mpQ5E8aSM';
              this.getService.getReqForMap(url).then(res => {
                this.showAddrProgress = false;
                if (res.results[0].formatted_address) {
                  this.deliveryAddr = res.results[0].formatted_address;
                  this.deliveryAddr = this.deliveryAddr.replace(new RegExp("'", 'g'), '');
                  this.ref.detectChanges();
                  this.isLatLngCheck = true;
                  this.showUpdateAddressAlert();
                }
              }, err => {
                this.showAddrProgress = false;
                this.alertUtils.showToast(err);
              });
            }).catch((error) => {
              this.showAddrProgress = false;
              this.alertUtils.showLogTitle('Error getting location', error);
            });
          } else {
            this.alertUtils.dialogForLocationSetting("LOCATION", "Your GPS seems to be disabled, please enable it", "OK");
          }
        }, reason => {
          this.alertUtils.showAlert("LOCATION ERROR", reason.toString(), "OK");
        });
      } else {
        this.alertUtils.showAlert("INTERNET CONNECTION", INTERNET_ERR_MSG, "OK");
      }
    } catch (e) {
      this.showAddrProgress = false;
      this.alertUtils.showLog(e);
    }
  }

  showConfirmationDialog(orderresult) {
    this.navCtrl.pop();
    let modal = this.modalCtrl.create(OrderConfirmation, {
      from: "previewpage", items: this.selectProducts, "addr": this.deliveryAddr, "totalAmount": this.totalAmount,
      "totalItems": this.totalItem, "servicecharge": this.serviceCharge, "expressdelivery": this.expDelCharge,
      "isExpdelivery": this.cbExpDel, "discountamt": this.discountAmt, "orderResult": orderresult
    });
    modal.present();
  }

  ngOnInit() {
    try {
      this.dateOfevent = new Date().toISOString();
      this.alertUtils.showLog(this.dateOfevent);
      this.date = new Date();
      this.cHour = this.date.getHours();
      Utils.sLog(this.cHour);
      Utils.sLog(this.date.toISOString());
      if (this.date.toISOString().slice(0, 10) == this.dateOfevent.slice(0, 10)) {
        if (this.cHour < 16) {
        } else {
          this.date.setDate(this.date.getDate() + 1);
          this.minDate = this.date.toISOString();
          this.dateOfevent = this.date.toISOString();
        }
        if (this.cHour >= 0 && this.cHour < 7) {
          this.deliverySlot = "8AM-11AM";
          this.slot1 = false;
          this.slot2 = false;
          this.slot3 = false;
          this.slot4 = false;
        } else if (this.cHour >= 7 && this.cHour < 10) {
          this.slot1 = true;
          this.deliverySlot = "11AM-2PM";
          this.slot2 = false;
          this.slot3 = false;
          this.slot4 = false;
        } else if (this.cHour >= 10 && this.cHour < 13) {
          this.deliverySlot = "2PM-5PM";
          this.slot1 = true;
          this.slot2 = true;
          this.slot3 = false;
          this.slot4 = false;
        } else if (this.cHour >= 13 && this.cHour < 16) {
          this.deliverySlot = "5PM-8PM";
          this.slot1 = true;
          this.slot2 = true;
          this.slot3 = true;
          this.slot4 = false;
        } else {
          this.deliverySlot = "8AM-11AM";
          this.slot1 = false;
          this.slot2 = false;
          this.slot3 = false;
          this.slot4 = false;
        }
      }
      this.alertUtils.getLoginState().then(res => {
        if (res) {
          this.loginStatus = res;
          this.alertUtils.getDealerId().then(res => {
            if (res) {
              this.dealerID = res
            }
          });
          this.alertUtils.getUserId().then(res => {
            if (res) {
              this.userID = res
            }
          });
          this.alertUtils.getUserAddr().then(value => {
            if (value) {
              this.deliveryAddr = value;
            }
          });
          this.alertUtils.getUserInfo().then(value => {
            if (value) {
              Utils.USER_INFO_DATA = value;
              if (Utils.USER_INFO_DATA.locality)
                this.landmark = Utils.USER_INFO_DATA.locality;
              if (Utils.USER_INFO_DATA.buildingname)
                this.buildingName = Utils.USER_INFO_DATA.buildingname;
              if (Utils.USER_INFO_DATA.mobileno)
                this.altmobileno = Utils.USER_INFO_DATA.mobileno;
            }
          });
        }
      }).catch(err => {
        this.alertUtils.showLog(err);
      });
      this.alertUtils.updateStaticValue();
      this.alertUtils.getPromoCode().then(value => {
        if (value) {
          this.validPromoCodeData = value;
        }
      }).catch(reason => {
        this.alertUtils.showLog(reason);
      });
      this.ref.detectChanges();
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  showPlaceOrderAlert() {
    let alert = this.alertCtrl.create({
      title: 'CONFIRM ORDER',
      message: 'Are you sure you want to place an order?',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'YES',
          handler: () => {
            if (this.alertUtils.networkStatus()) {
              if (Utils.APP_USER_LAT || this.isLatLngCheck) {
                this.placeOrderTask();
              } else {
                this.alertUtils.showAlert("LOCATION UPDATE", "Looks like its been a while you have updated your address, please update your address using MAP or Current Location", "OK");
              }
            } else {
              this.alertUtils.showAlert("INTERNET CONNECTION", INTERNET_ERR_MSG, "OK");
            }
          }
        }
      ]
    });
    alert.present();
  }

  validatePromoCode() {
    // if (this.discountCode) {
    //   if (this.validPromoCodeData) {
    //     if (this.validPromoCodeData.promocode) {
    //       if (this.validPromoCodeData.promocode == this.discountCode) {
    //         if (this.validPromoCodeData.type.toLowerCase() == 'direct') {
    //           this.discountAmt = this.validPromoCodeData.typevalue;
    //           this.alertUtils.showLog(this.discountAmt);
    //           this.totalAmount = this.totalAmount - this.validPromoCodeData.typevalue;
    //           this.alertUtils.showAlert("SUCCESS", "Discount applied successfully", "OK");
    //           this.showDiscount = false;
    //         } else if (this.validPromoCodeData.type.toLowerCase() == 'percentage') {
    //           this.totalAmount = this.totalCost * (100 - this.validPromoCodeData.typevalue) / 100;
    //           this.discountAmt = this.totalAmount - this.totalCost;
    //           if (this.cbExpDel) {
    //             this.totalAmount = this.totalAmount + this.serviceCharge + this.expDelCharge;
    //           } else {
    //             this.totalAmount = this.totalAmount + this.serviceCharge;
    //           }
    //           let repValue: string = this.discountAmt.toString();
    //           this.discountAmt = repValue.replace('-', '');
    //           this.showDiscount = false;
    //           this.alertUtils.showAlert("SUCCESS", "Discount applied successfully", "OK");
    //         }
    //       } else {
    //         this.errorPromoText = "Invalid promo code";
    //       }
    //     } else {
    //       this.errorPromoText = "Invalid promo code";
    //     }
    //   } else {
    //     this.errorPromoText = "Invalid promo code";
    //   }
    // } else {
    //   this.errorPromoText = "Please enter promo code";
    // }
    if (this.discountCode) {
      let input = {
        "offer": {
          "promocode": this.discountCode,
          "userid": this.userID,
          "user_type": APP_USER_TYPE,
          "apptype": APP_TYPE,
          "transtype": "verify"
        }
      };
      let data = JSON.stringify(input);
      this.showDiscountProgress = true;
      this.getService.postReq(GetService.offers(), data).then(res => {
        Utils.sLog(res);
        this.showDiscountProgress = false;
        if (res.result == RES_SUCCESS) {
          this.showDiscount = false;

        } else {
          this.errorPromoText = "Invalid code";
        }
      }, err => {
        this.showDiscountProgress = false;
        this.errorPromoText = TRY_AGAIN_ERR_MSG;
        Utils.sLog(err);
      })

    } else {
      this.errorPromoText = "Please enter promo code";
    }

  }

  changeDiscountCode() {
    if (this.errorPromoText) {
      this.errorPromoText = "";
    }
  }

  showUpdateAddressAlert() {
    let alert = this.alertCtrl.create({
      title: 'UPDATE',
      message: 'Would you like to update this address in your profile?',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'YES',
          handler: () => {
            if (this.alertUtils.networkStatus()) {
              this.doUpdateProfile();
            } else {
              this.alertUtils.showAlert("INTERNET CONNECTION", INTERNET_ERR_MSG, "OK");
            }
          }
        }
      ]
    });
    alert.present();
  }

  doUpdateProfile() {
    let input = {
      "User": {
        "userid": this.userID,
        "user_type": APP_USER_TYPE,
        "address": this.deliveryAddr,
        "apptype": APP_TYPE
      }
    };
    if (this.loc) {
      input.User["latitude"] = this.loc.lat;
      input.User["longitude"] = this.loc.lng;
    }
    if (this.landmark) {
      input.User["locality"] = this.landmark;
    }
    if (this.buildingName) {
      input.User["buildingname"] = this.buildingName;
    }
    this.alertUtils.showLog(JSON.stringify(input));
    let inputData = JSON.stringify(input);
    this.alertUtils.showLoading();
    this.getService.putReq(this.getService.updateUser(), inputData).then(res => {
      this.alertUtils.hideLoading();
      this.alertUtils.showLog(res);
      if (res.result == this.alertUtils.RESULT_SUCCESS) {
        if (res.data) {
          this.alertUtils.setUserAddr(this.deliveryAddr);
          if (this.loc) {
            this.alertUtils.setUserLatLng(this.loc.lat, this.loc.lng);
          }
          if (this.landmark) {
            Utils.USER_INFO_DATA.locality = this.landmark;
            this.alertUtils.cacheUserInfo(Utils.USER_INFO_DATA);
          }
        }
        this.alertUtils.showToast("Profile updated successfully ");
        this.alertUtils.updateStaticValue();
      } else {
        this.alertUtils.showToast("Request failed ");
      }
    }).catch(error => {
      this.alertUtils.hideLoading();
      this.alertUtils.showLog(error)
    });
  }

  delDateChange() {
    this.deliverySlot = "";
    this.date = new Date();
    this.cHour = this.date.getHours();
    this.alertUtils.showLog(this.dateOfevent);
    if (this.date.toISOString().slice(0, 10) == this.dateOfevent.slice(0, 10)) {
      if (this.cHour < 16) {
      } else {
        this.date.setDate(this.date.getDate() + 1);
        this.minDate = this.date.toISOString();
        this.dateOfevent = this.date.toISOString();
      }
      if (this.cHour >= 0 && this.cHour < 7) {
        this.deliverySlot = "8AM-11AM";
        this.slot1 = false;
        this.slot2 = false;
        this.slot3 = false;
        this.slot4 = false;
      } else if (this.cHour >= 7 && this.cHour < 10) {
        this.slot1 = true;
        this.deliverySlot = "11AM-2PM";
        this.slot2 = false;
        this.slot3 = false;
        this.slot4 = false;
      } else if (this.cHour >= 10 && this.cHour < 13) {
        this.deliverySlot = "2PM-5PM";
        this.slot1 = true;
        this.slot2 = true;
        this.slot3 = false;
        this.slot4 = false;
      } else if (this.cHour >= 13 && this.cHour < 16) {
        this.deliverySlot = "5PM-8PM";
        this.slot1 = true;
        this.slot2 = true;
        this.slot3 = true;
        this.slot4 = false;
      } else {
        this.deliverySlot = "8AM-11AM";
        this.slot1 = false;
        this.slot2 = false;
        this.slot3 = false;
        this.slot4 = false;
      }
    } else {
      this.deliverySlot = "8AM-11AM";
      this.slot1 = false;
      this.slot2 = false;
      this.slot3 = false;
      this.slot4 = false;
    }
  }

  placeOrder() {
    if (this.deliverySlot) {
      if (this.dateOfevent) {
        if (this.alertUtils.validateText(this.deliveryAddr, "Delivery Address", 3, 450)) {
          if (this.altmobileno) {
            if (this.alertUtils.validateNumber(this.altmobileno, "Mobile Number", 10, 10)) {
              if (this.alertUtils.isValidMobile(this.altmobileno)) {
                this.alertUtils.showToast("Invalid Mobile Number");
                return false;
              }
            } else {
              this.alertUtils.showToast(this.alertUtils.ERROR_MES);
              return false;
            }
          }
          if (this.remarks) {
            if (!this.alertUtils.validateText(this.remarks, "Remarks", 3, 250)) {
              this.alertUtils.showToast(this.alertUtils.ERROR_MES);
              return false;
            }
          }
          this.showPlaceOrderAlert();
        } else {
          this.alertUtils.showToast(this.alertUtils.ERROR_MES);
        }
      } else {
        this.alertUtils.showToast("Please select delivery date");
      }
    } else {
      this.alertUtils.showToast("Please select availability slot");
    }
  }

  updateOrderTask() {

    try {
      this.alertUtils.showLoading();
      let eachDiscAmt = 0;
      if (this.discountAmt && this.discountAmt > 0) {
        eachDiscAmt = this.discountAmt / this.prodSelectedCount;
        this.alertUtils.showLog(eachDiscAmt);
      }
      let order = { amt: 0, total_amt: 0 }, data = {};
      order["orderid"] = this.orderItem.order_id;
      order["loginid"] = this.userID;
      order["dealerid"] = this.dealerID;
      order["apptype"] = APP_TYPE;
      order["delivery_address"] = this.deliveryAddr;
      order["quantity"] = this.selectProducts[0].count;
      order["excepted_time"] = Utils.formatDateToDDMMYYYY(this.dateOfevent) + " " + this.deliverySlot;
      order["productid"] = this.selectProducts[0].productid;
      order["product_name"] = this.selectProducts[0].brandname;
      order["product_type"] = this.selectProducts[0].ptype;
      order["product_cost"] = this.selectProducts[0].pcost;
      if (this.loc) {
        order["delivery_latitude"] = this.loc.lat;
        order["delivery_longitude"] = this.loc.lng;
      } else {
        order["delivery_latitude"] = Utils.APP_USER_LAT;
        order["delivery_longitude"] = Utils.APP_USER_LNG;
      }

      if (this.cbExpDel) {
        order["expressdelivery"] = "true";
        if (this.selectProducts[0].expressdeliverycharges && this.selectProducts[0].expressdeliverycharges > 0) {
          order["expressdeliverycharges"] = this.selectProducts[0].expressdeliverycharges;
        }
      } else {
        order["expressdelivery"] = "false";
      }
      if (this.selectProducts[0].servicecharge && this.selectProducts[0].servicecharge > 0) {
        order["servicecharges"] = (this.selectProducts[0].servicecharge * this.selectProducts[0].count);
      }
      if (this.discountCode) {
        // order["discountamount"] = this.discountAmt;
        order["discountcode"] = this.discountCode;
        // order["discountamounteach"] = eachDiscAmt;
      }
      if (this.selectProducts[0].servicecharge && this.selectProducts[0].servicecharge > 0) {
        if (this.cbExpDel && this.selectProducts[0].expressdeliverycharges && this.selectProducts[0].expressdeliverycharges > 0) {
          if (eachDiscAmt > 0) {
            order["amt"] = (this.selectProducts[0].pcost * this.selectProducts[0].count) + (this.selectProducts[0].servicecharge * this.selectProducts[0].count) + this.selectProducts[0].expressdeliverycharges - eachDiscAmt;
            order["total_amt"] = (this.selectProducts[0].pcost * this.selectProducts[0].count) + (this.selectProducts[0].servicecharge * this.selectProducts[0].count) + this.selectProducts[0].expressdeliverycharges - eachDiscAmt;

          } else {
            order["amt"] = (this.selectProducts[0].pcost * this.selectProducts[0].count) + (this.selectProducts[0].servicecharge * this.selectProducts[0].count) + this.selectProducts[0].expressdeliverycharges;
            order["total_amt"] = (this.selectProducts[0].pcost * this.selectProducts[0].count) + (this.selectProducts[0].servicecharge * this.selectProducts[0].count) + this.selectProducts[0].expressdeliverycharges;
          }
        } else {
          if (eachDiscAmt > 0) {
            order["amt"] = (this.selectProducts[0].pcost * this.selectProducts[0].count) + (this.selectProducts[0].servicecharge * this.selectProducts[0].count) - eachDiscAmt;
            order["total_amt"] = (this.selectProducts[0].pcost * this.selectProducts[0].count) + (this.selectProducts[0].servicecharge * this.selectProducts[0].count) - eachDiscAmt;

          } else {
            order["amt"] = (this.selectProducts[0].pcost * this.selectProducts[0].count) + (this.selectProducts[0].servicecharge * this.selectProducts[0].count);
            order["total_amt"] = (this.selectProducts[0].pcost * this.selectProducts[0].count) + (this.selectProducts[0].servicecharge * this.selectProducts[0].count);
          }
        }
      } else {
        if (this.cbExpDel && this.selectProducts[0].expressdeliverycharges && this.selectProducts[0].expressdeliverycharges > 0) {
          if (eachDiscAmt > 0) {
            order["amt"] = (this.selectProducts[0].pcost * this.selectProducts[0].count) + this.selectProducts[0].expressdeliverycharges - eachDiscAmt;
            order["total_amt"] = (this.selectProducts[0].pcost * this.selectProducts[0].count) + this.selectProducts[0].expressdeliverycharges - eachDiscAmt;

          } else {
            order["amt"] = (this.selectProducts[0].pcost * this.selectProducts[0].count) + this.selectProducts[0].expressdeliverycharges;
            order["total_amt"] = (this.selectProducts[0].pcost * this.selectProducts[0].count) + this.selectProducts[0].expressdeliverycharges;
          }
        } else {
          if (eachDiscAmt > 0) {
            order["amt"] = (this.selectProducts[0].pcost * this.selectProducts[0].count) - eachDiscAmt;
            order["total_amt"] = (this.selectProducts[0].pcost * this.selectProducts[0].count) - eachDiscAmt;
          } else {
            order["amt"] = (this.selectProducts[0].pcost * this.selectProducts[0].count);
            order["total_amt"] = (this.selectProducts[0].pcost * this.selectProducts[0].count);
          }
        }
      }

      if (this.dateOfevent) {
        let slotDate = "";
        if (this.deliverySlot == "8AM-11AM") {
          slotDate = Utils.formatDateToYYYYMMDD(this.dateOfevent) + " 11:00:00"
        } else if (this.deliverySlot == "11AM-2PM") {
          slotDate = Utils.formatDateToYYYYMMDD(this.dateOfevent) + " 14:00:00"
        } else if (this.deliverySlot == "2PM-5PM") {
          slotDate = Utils.formatDateToYYYYMMDD(this.dateOfevent) + " 17:00:00"
        } else if (this.deliverySlot == "5PM-8PM") {
          slotDate = Utils.formatDateToYYYYMMDD(this.dateOfevent) + " 20:00:00"
        }
        if (slotDate)
          order["slotdate"] = slotDate;
      }
      if (this.landmark) {
        order["delivery_locality"] = this.landmark;
      }
      if (this.buildingName) {
        order["delivery_buildingname"] = this.buildingName;
      }
      if (this.selectProducts[0].mdemptycount && this.selectProducts[0].mdemptycount > 0) {
        order["emptycans"] = this.selectProducts[0].mdemptycount;
        order.amt = order.amt + (this.selectProducts[0].mdemptycount * 150);
        order.total_amt = order.total_amt + (this.selectProducts[0].mdemptycount * 150);
        if (this.advanceAmt) {
          order["advance_amt"] = this.advanceAmt;
        }
      }
      if (this.remarks) {
        order["remarks"] = this.remarks;
      }
      if (this.altmobileno) {
        order["mobile"] = this.altmobileno;
      }
      data["order"] = order;
      this.alertUtils.showLog(data);
      let input = JSON.stringify(data);
      this.getService.postReq(GetService.updateOrder(), input).then(res => {
        this.alertUtils.showLog(res);
        this.alertUtils.hideLoading();
        if (res.result == RES_SUCCESS) {
          this.alertUtils.hideLoading();
          if (res.data) {
            this.alertUtils.showToast("Order updated successfully");
            this.viewCtrl.dismiss("success");
          } else
            this.alertUtils.showToast(TRY_AGAIN_ERR_MSG);

        } else {
          this.alertUtils.showToast(TRY_AGAIN_ERR_MSG);
        }
      }).catch(err => {
        this.alertUtils.hideLoading();
        this.alertUtils.showLog(err);
      });
    } catch (e) {
      this.alertUtils.hideLoading();
    }

  }

  placeOrderTask() {


    try {
      this.alertUtils.showLoading();
      this.deliveryAddr = this.deliveryAddr.replace(new RegExp("'", 'g'), '');
      let result = [];
      let eachDiscAmt = 0;
      if (this.discountAmt && this.discountAmt > 0) {
        eachDiscAmt = this.discountAmt / this.prodSelectedCount;
        this.alertUtils.showLog(eachDiscAmt);
      }
      for (let i = 0; i < this.selectProducts.length; i++) {
        if (this.selectProducts[i].count > 0) {
          let order = { amt: 0, total_amt: 0 }, Obj1 = {};
          order["mobiletype"] = MOBILE_TYPE;
          order["framework"] = FRAMEWORK;
          order["quantity"] = this.selectProducts[i].count;
          order["product_type"] = this.selectProducts[i].brandname;
          order["product_quantity"] = this.selectProducts[i].ptype;
          order["product_cost"] = this.selectProducts[i].pcost;
          order["product_amt"] = this.selectProducts[i].pcost * this.selectProducts[i].count;
          order["productid"] = this.selectProducts[i].productid;
          if (this.selectProducts[i].servicecharge && this.selectProducts[i].servicecharge > 0) {
            if (this.cbExpDel && this.selectProducts[i].expressdeliverycharges && this.selectProducts[i].expressdeliverycharges > 0) {
              if (eachDiscAmt > 0) {
                order["amt"] = (this.selectProducts[i].pcost * this.selectProducts[i].count) + (this.selectProducts[i].servicecharge * this.selectProducts[i].count) + this.selectProducts[i].expressdeliverycharges - eachDiscAmt;
                order["total_amt"] = (this.selectProducts[i].pcost * this.selectProducts[i].count) + (this.selectProducts[i].servicecharge * this.selectProducts[i].count) + this.selectProducts[i].expressdeliverycharges - eachDiscAmt;

              } else {
                order["amt"] = (this.selectProducts[i].pcost * this.selectProducts[i].count) + (this.selectProducts[i].servicecharge * this.selectProducts[i].count) + this.selectProducts[i].expressdeliverycharges;
                order["total_amt"] = (this.selectProducts[i].pcost * this.selectProducts[i].count) + (this.selectProducts[i].servicecharge * this.selectProducts[i].count) + this.selectProducts[i].expressdeliverycharges;
              }
            } else {
              if (eachDiscAmt > 0) {
                order["amt"] = (this.selectProducts[i].pcost * this.selectProducts[i].count) + (this.selectProducts[i].servicecharge * this.selectProducts[i].count) - eachDiscAmt;
                order["total_amt"] = (this.selectProducts[i].pcost * this.selectProducts[i].count) + (this.selectProducts[i].servicecharge * this.selectProducts[i].count) - eachDiscAmt;

              } else {
                order["amt"] = (this.selectProducts[i].pcost * this.selectProducts[i].count) + (this.selectProducts[i].servicecharge * this.selectProducts[i].count);
                order["total_amt"] = (this.selectProducts[i].pcost * this.selectProducts[i].count) + (this.selectProducts[i].servicecharge * this.selectProducts[i].count);
              }
            }
          } else {
            if (this.cbExpDel && this.selectProducts[i].expressdeliverycharges && this.selectProducts[i].expressdeliverycharges > 0) {
              if (eachDiscAmt > 0) {
                order["amt"] = (this.selectProducts[i].pcost * this.selectProducts[i].count) + this.selectProducts[i].expressdeliverycharges - eachDiscAmt;
                order["total_amt"] = (this.selectProducts[i].pcost * this.selectProducts[i].count) + this.selectProducts[i].expressdeliverycharges - eachDiscAmt;

              } else {
                order["amt"] = (this.selectProducts[i].pcost * this.selectProducts[i].count) + this.selectProducts[i].expressdeliverycharges;
                order["total_amt"] = (this.selectProducts[i].pcost * this.selectProducts[i].count) + this.selectProducts[i].expressdeliverycharges;
              }
            } else {
              if (eachDiscAmt > 0) {
                order["amt"] = (this.selectProducts[i].pcost * this.selectProducts[i].count) - eachDiscAmt;
                order["total_amt"] = (this.selectProducts[i].pcost * this.selectProducts[i].count) - eachDiscAmt;
              } else {
                order["amt"] = (this.selectProducts[i].pcost * this.selectProducts[i].count);
                order["total_amt"] = (this.selectProducts[i].pcost * this.selectProducts[i].count);
              }
            }
          }
          order["total_items"] = this.totalItem;
          order["cal_total_amt"] = this.totalAmount;
          order["delivery_address"] = this.deliveryAddr;
          if (this.landmark) {
            order["delivery_locality"] = this.landmark;
          }
          if (this.buildingName) {
            order["delivery_buildingname"] = this.buildingName;
          }
          if (this.loc) {
            order["delivery_latitude"] = this.loc.lat;
            order["delivery_longitude"] = this.loc.lng;
          } else {
            order["delivery_latitude"] = Utils.APP_USER_LAT;
            order["delivery_longitude"] = Utils.APP_USER_LNG;
          }
          if (this.cbExpDel) {
            order["expressdelivery"] = "true";
            if (this.selectProducts[i].expressdeliverycharges && this.selectProducts[i].expressdeliverycharges > 0) {
              order["expressdeliverycharges"] = this.selectProducts[i].expressdeliverycharges;
            }
          } else {
            order["expressdelivery"] = "false";
          }
          if (this.selectProducts[i].servicecharge && this.selectProducts[i].servicecharge > 0) {
            order["servicecharge"] = (this.selectProducts[i].servicecharge * this.selectProducts[i].count);
          }
          if (this.discountCode) {
            // order["discountamount"] = this.discountAmt;
            order["discountcode"] = this.discountCode;
            // order["discountamounteach"] = eachDiscAmt;
          }
          if (this.selectProducts[i].mdemptycount && this.selectProducts[i].mdemptycount > 0) {
            order["emptycans"] = this.selectProducts[i].mdemptycount;
            order.amt = order.amt + (this.selectProducts[i].mdemptycount * 150);
            order.total_amt = order.total_amt + (this.selectProducts[i].mdemptycount * 150);
            if (this.advanceAmt) {
              order["adv_amt"] = this.advanceAmt;
            }
          }
          if (this.dateOfevent) {
            let slotDate = "";
            if (this.deliverySlot == "8AM-11AM") {
              slotDate = Utils.formatDateToYYYYMMDD(this.dateOfevent) + " 11:00:00"
            } else if (this.deliverySlot == "11AM-2PM") {
              slotDate = Utils.formatDateToYYYYMMDD(this.dateOfevent) + " 14:00:00"
            } else if (this.deliverySlot == "2PM-5PM") {
              slotDate = Utils.formatDateToYYYYMMDD(this.dateOfevent) + " 17:00:00"
            } else if (this.deliverySlot == "5PM-8PM") {
              slotDate = Utils.formatDateToYYYYMMDD(this.dateOfevent) + " 20:00:00"
            }
            if (slotDate)
              order["slotdate"] = slotDate;
          }
          order["paymentmode"] = "cash";
          order["orderstatus"] = "ordered";
          order["orderfrom"] = this.userID;
          order["orderto"] = this.dealerID;
          order["userid"] = this.userID;
          order["loginid"] = this.userID;
          order["user_type"] = APP_USER_TYPE;
          order["apptype"] = APP_TYPE;
          order["createdthru"] = FRAMEWORK + MOBILE_TYPE;
          order["excepted_time"] = Utils.formatDateToDDMMYYYY(this.dateOfevent) + " " + this.deliverySlot;
          if (this.remarks) {
            order["remarks"] = this.remarks;
          }
          if (this.altmobileno) {
            order["mobile"] = this.altmobileno;
          }
          Obj1["order"] = order;
          result.push(Obj1);
        }
      }
      this.alertUtils.showLog(result);
      let data = JSON.stringify(result);
      this.getService.postReq(this.getService.placeOrder(), data).then(res => {
        this.alertUtils.hideLoading();
        this.alertUtils.showLog(res);
        if (res.result == RES_SUCCESS) {
          if (res.data) {
            if (this.discountAmt && this.discountAmt > 0) {
              this.alertUtils.setPromoCode("");
            }
            this.showConfirmationDialog(res);
          }
        } else {
          this.alertUtils.showToast(TRY_AGAIN_ERR_MSG);
        }
      }, err => {
        this.alertUtils.hideLoading();
        this.alertUtils.showLog(err);
      });
    } catch (e) {
      this.alertUtils.hideLoading();
      this.alertUtils.showLog(e);
    }
  }
}
