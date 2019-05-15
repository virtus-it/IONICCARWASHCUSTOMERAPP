import {Component} from "@angular/core";
import {AlertController, NavController, Platform, ViewController} from "ionic-angular";
import {
  APP_TYPE,
  APP_USER_TYPE,
  FRAMEWORK,
  INTERNET_ERR_MSG,
  MOBILE_TYPE,
  RES_SUCCESS,
  Utils
} from "../../app/services/Utils";
import {GetService} from "../../app/services/get.servie";
import {Login} from "../LoginIn/Login";
import {MapView} from "../MapView/MapView";
import {Diagnostic} from "@ionic-native/diagnostic";
import {AppRate} from "@ionic-native/app-rate";
import {SignUp} from "../SignUp/SignUp";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'page-welcome',
  templateUrl: 'Welcome.html'
})
export class WelcomePage {
  languages = [{name: "English", code: "en"}, {name: "Arabic", code: "ar"}];
  languageSelected: any;
  private mobileNumber: string;
  private showProgress = false;
  private showScreen = false;
  private discountCode: string = "";
  private checkDiscount: boolean = false;
  private showSupplierCode: boolean = false;
  private noInternet: boolean = false;
  private showLoading: boolean = true;
  private userID = "0";
  private dealerID = "0";
  private verCode = "6";
  private deviceCode: string;

  constructor(private diagnostic: Diagnostic, private navCtrl: NavController, public alertUtils: Utils, private apiService: GetService, private alertCtrl: AlertController, private viewCtrl: ViewController, private platform: Platform, private appRate: AppRate, public translate: TranslateService) {
    this.alertUtils.showLog("WELCOME PAGE CONSTRUCTOR");
    this.platform.ready().then(ready => {
      try {
        this.alertUtils.getVersionCode().then(code => {
          this.deviceCode = code;
        }).catch(reason => {
          this.alertUtils.showLog(reason);
        });
        this.alertUtils.getUserInfo().then(info => {
          if (info) {
            Utils.USER_INFO_DATA = info;
          }
        }, err => {
          Utils.sLog(err);
        });
        this.alertUtils.getUserId().then(userId => {
          this.alertUtils.showLog("userId");
          this.alertUtils.showLog(userId);
          this.userID = userId;
          this.alertUtils.getUserId().then(dID => {
            this.alertUtils.showLog("dID");
            this.alertUtils.showLog(dID);
            this.dealerID = dID;
            this.alertUtils.getVersionCode().then(code => {
              this.alertUtils.showLog("code");
              this.alertUtils.showLog(code);
              this.verCode = code;
              this.appFirstCall();
            });
          });
        }, err => {
          this.alertUtils.showLog(err);
          this.appFirstCall();
        });

      } catch (e) {
        this.showScreen = true;
        this.alertUtils.showLog(e);
      }
    });
    console.log("getDLang : " + this.translate.getDefaultLang())
  }

  setLanguage() {
    console.log(this.languageSelected)
    let defaultLanguage = this.translate.getDefaultLang();
    console.log("defaultLanguage : " + defaultLanguage);
    if (this.languageSelected) {
      this.translate.setDefaultLang(this.languageSelected);
      this.translate.use(this.languageSelected);
      this.alertUtils.setLang(this.languageSelected);
      Utils.lang = this.languageSelected;
    } else {
      this.languageSelected = defaultLanguage;
      this.translate.use(defaultLanguage);
      this.alertUtils.setLang(defaultLanguage);
      Utils.lang = defaultLanguage;

    }
  }

  showSupplier() {
    if (this.showSupplierCode) {
      this.showSupplierCode = false;
    } else {
      this.showSupplierCode = true;
    }
  }

  appFirstCall() {
    if (this.alertUtils.networkStatus()) {
      this.noInternet = false;
      this.appFirstCallTask();
    } else {
      this.noInternet = true;
      this.showLoading = false;
      this.showScreen = false;
    }
  }

  appFirstCallTask() {

    try {
      if (!this.userID) {
        this.userID = "0"
      }
      if (!this.dealerID) {
        this.dealerID = "0"
      }
      let input =
        {
          "root": {
            "userid": this.userID,
            "dealerid": this.dealerID,
            "usertype": APP_USER_TYPE,
            "appusertype": APP_USER_TYPE,
            "apptype": APP_TYPE,
            "mobiletype": MOBILE_TYPE,
            "framework": FRAMEWORK
          }
        };
      if (this.deviceCode) {
        input.root["versionnumber"] = this.deviceCode;
      }
      if (this.alertUtils.getGcmId()) {
        input.root["usergcmid"] = this.alertUtils.getGcmId();
      }

      if (this.alertUtils.getDeviceUUID()) {
        input.root["useruniqueid"] = this.alertUtils.getDeviceUUID();
      }
      if (Utils.USER_INFO_DATA && Utils.USER_INFO_DATA.mobileno) {
        input.root["mobileno"] = Utils.USER_INFO_DATA.mobileno;
      }

      let data = JSON.stringify(input);
      this.showLoading = true;
      this.apiService.postReq(this.apiService.appFirstCall(), data).then(res => {
        this.showLoading = false;

        this.alertUtils.showLog(res);
        if (res.result == RES_SUCCESS) {
          if (res.data) {
            this.alertUtils.showLog(res.data.appversion);
            let apiV = parseInt(res.data.appversion);
            let appV = parseInt(this.verCode);
            this.alertUtils.showLog(apiV);
            this.alertUtils.showLog(appV);

            if (apiV < appV) {
              if (res.data.userdetails) {
                if (res.data.userdetails.superdealerid) {
                  this.dealerID = res.data.userdetails.superdealerid;
                  this.alertUtils.getDealerId().then(dID => {
                    if (dID != this.dealerID) {
                      this.alertUtils.setUserDealerId(this.dealerID);
                      Utils.USER_INFO_DATA.superdealerid = this.dealerID;
                      this.alertUtils.cacheUserInfo(Utils.USER_INFO_DATA);
                      this.alertUtils.getAppFirstInfo().then(info => {
                        this.alertUtils.showLog("APP INFO");
                        this.alertUtils.showLog(info);
                      }).catch(err => {
                        this.alertUtils.showLog(err);

                      });
                    }
                  });

                }

                if (res.data.userdetails.promodetails) {
                  if (res.data.userdetails.promodetails.promo_code) {
                    const promoDta = {
                      "promocode": res.data.userdetails.promodetails.promo_code,
                      "promostatus": res.data.userdetails.promodetails.promocodestatus,
                      "type": res.data.userdetails.promodetails.type,
                      "typevalue": res.data.userdetails.promodetails.typevalue
                    };
                    this.alertUtils.showLog(promoDta);
                    this.alertUtils.setPromoCode(promoDta);
                  }
                }
                if (res.data.userdetails) {
                  this.alertUtils.cacheAppFirstInfo(res.data.userdetails);
                }
                if (res.data.userdetails.acceptonlinepayment) {
                  Utils.USER_INFO_DATA["acceptonlinepayment"] = res.data.userdetails.acceptonlinepayment;
                  this.alertUtils.cacheUserInfo(Utils.USER_INFO_DATA);
                }


              }
              this.moveToNextScreen();
            } else {
              this.showConfirm();
            }
          } else {
            this.moveToNextScreen();
          }
        } else {
          this.moveToNextScreen();
        }
      }, err => {
        this.showLoading = false;
        this.alertUtils.showLog(1);
        this.moveToNextScreen();
      });

      setTimeout(() => {
        this.alertUtils.showLog("setTimeout called :" + this.showScreen);
        if (!this.showScreen) {
          this.showLoading = false;
          this.noInternet = false;
          this.showScreen = true;
        }
      }, 5000)
    } catch (error) {
      this.showLoading = false;
      this.noInternet = false;
      this.alertUtils.showLog(2);
      this.showScreen = true;
      this.alertUtils.showLog(error);
    }
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'APP UPDATE',
      message: 'We have made some critical changes to our app, we strongly suggest you to update your app to enjoy new features',
      buttons: [
        {
          text: 'UPDATE',
          handler: () => {
            confirm.onDidDismiss(() => {
              this.forceUpdate();
            });
          }
        }
      ]
    });
    confirm.present();
  }

  forceUpdate() {
    this.appRate.preferences.storeAppURL = {
      android: 'market://details?id=com.moya'
    };
    this.appRate.navigateToAppStore();
  }

  moveToNextScreen() {
    this.alertUtils.getLoginState().then(lStatus => {
      this.alertUtils.showLogTitle("login status", lStatus);
      if (lStatus) {
        this.alertUtils.getUserInfo().then(info => {
          this.alertUtils.showLog(info);
          if (info && info.userid) {
            // this.navCtrl.push(TabsPage, { item: "welcompage" }).then(res => {
            //   const index = this.viewCtrl.index;
            //   // then we remove it from the navigation stack
            //   this.navCtrl.remove(index);
            // });
            this.navCtrl.setRoot(MapView);
          } else {
            this.showScreen = true;
          }
        }, infoErr => {
          this.showScreen = true;
        });
      } else {
        this.showScreen = true;
      }
    }, err => {
      this.showScreen = true;
      this.alertUtils.showLog(err);
    });
  }


  signIn() {
    try {
      this.navCtrl.push(Login, {items: "welcomepage"});
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  signup() {
    this.navCtrl.push(SignUp);
  }

  verifyMobileNo(mNumber) {
    this.checkDiscount = false;
    try {
      if (this.discountCode) {
        if (this.discountCode.indexOf("'") != -1) {
          this.checkDiscount = true;
        }
        if (this.alertUtils.validateText(this.discountCode, "Code", 3, 50)) {

        } else {
          this.alertUtils.showToast(this.alertUtils.ERROR_MES)
          return false;
        }
      }
      if (mNumber) {
        if (this.alertUtils.validateNumber(mNumber, "Mobile Number", 10, 10)) {
          if (this.alertUtils.isValidMobile(mNumber)) {
            this.alertUtils.showToast("Invalid Mobile Number");
          } else {
            if (!this.checkDiscount) {
              if (this.alertUtils.networkStatus()) {
                if (this.alertUtils.validateNumber(mNumber, "Mobile Number", 10, 10)) {
                  this.showProgress = true;
                  let productsArray = [];
                  let input = {
                    "User": {
                      "mobileno": mNumber,
                      "usertype": APP_USER_TYPE,
                      "referCode": this.discountCode,
                      "apptype": APP_TYPE
                    }
                  };
                  let data = JSON.stringify(input);
                  this.alertUtils.showLog(data);

                  this.apiService.postReq(this.apiService.mobileValidation(), data).then(res => {
                    this.showProgress = false;
                    this.alertUtils.showLog(res);
                    if (res.result == RES_SUCCESS) {
                      if (res.data && res.data[0].products) {
                        this.alertUtils.showLog('success');
                        for (let i = 0; i < res.data[0].products.length; i++) {
                          if (res.data[0].products[i].product_cost && res.data[0].products[i].category && res.data[0].products[i].brandname) {
                            res.data[0].products[i]["count"] = 0;
                            res.data[0].products[i]["ptype"] = res.data[0].products[i].product_type;
                            res.data[0].products[i]["pcost"] = res.data[0].products[i].product_cost;
                            res.data[0].products[i]["pname"] = res.data[0].products[i].product_name;
                            res.data[0].products[i]["randomcolor"] = Utils.getRandomRolor();
                            if (res.data[0].products[i].product_img)
                              res.data[0].products[i]["pimage"] = this.apiService.getImg() + "product_" + res.data[0].products[i].productid;
                            productsArray.push(res.data[0].products[i]);
                          }
                        }
                        if (res.data[0].discountproducts) {
                          if (res.data[0].discountproducts.length > 0) {
                            for (let j = 0; j < res.data[0].discountproducts.length; j++) {
                              for (let i = 0; i < productsArray.length; i++) {
                                if (productsArray[i].productid == res.data[0].discountproducts[j].productid) {
                                  if (res.data[0].discountproducts[j].stockstatus != "Soldout") {
                                    if (res.data[0].discountproducts[j].default_qty) {
                                      productsArray[i]["count"] = res.data[0].discountproducts[j].default_qty;
                                    } else {
                                      productsArray[i]["count"] = 0;
                                    }
                                    if (res.data[0].discountproducts[j].product_cost) {
                                      productsArray[i]["pcost"] = res.data[0].discountproducts[j].product_cost;
                                    }
                                    break;
                                  }
                                }
                              }

                            }
                          }
                        }
                        this.alertUtils.showLogTitle("Products", productsArray);
                        if (this.discountCode && res.data[0].refercode == "0") {
                          this.showProgress = false;
                          this.showAlertForReferCode(res, productsArray, mNumber);

                        } else {
                          if (productsArray.length > 0) {
                            this.goToMapView(productsArray, mNumber, res, true, this.discountCode);
                          } else {
                            this.goToMapView(productsArray, mNumber, res, false, this.discountCode);
                          }
                        }
                      } else {

                        if (this.discountCode && res.data && res.data[0].refercode == "0") {
                          this.showProgress = false;
                          this.showAlertForReferCode(res, productsArray, mNumber);

                        } else {
                          this.goToMapView(productsArray, mNumber, res, false, this.discountCode);
                        }
                      }
                    } else {
                      this.goToMapView(productsArray, mNumber, "", false, this.discountCode);
                    }
                  }, err => {
                    this.goToMapView(productsArray, mNumber, "", false, this.discountCode);
                  });
                } else {
                  this.alertUtils.showToast(this.alertUtils.ERROR_MES)
                }
              } else {
                this.alertUtils.showAlert("INTERNET CONNECTION", INTERNET_ERR_MSG, "OK");
              }
            } else {
              this.alertUtils.showToast("Single quote not allowed in refer code");
            }
          }
        } else {
          this.alertUtils.showToast(this.alertUtils.ERROR_MES);
        }
      } else {
        this.alertUtils.showToast("Please enter mobile number");
      }
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  goToMapView(productsArray, mNumber, res, isExisting: boolean, discountCode) {

    let data = {
      from: "welcome",
      isExisting: isExisting,
    };

    if (productsArray) {
      data["items"] = productsArray
    } else {
      data["items"] = "";
    }
    if (res && res.data && res.data[0]) {
      data["exUserInfo"] = res.data[0];
    } else {
      data["exUserInfo"] = "";
    }
    if (discountCode) {
      data["referCode"] = discountCode;
    } else {
      data["referCode"] = "";
    }
    if (mNumber) {
      data["exMobileno"] = mNumber;
    } else {
      data["exMobileno"] = "";
    }
    Utils.sLog(data);
    /* if (discountCode && discountCode.toUpperCase() == 'LITGEN18') {

       this.navCtrl.push('SimpledialogPage', data).then(next => {
         this.showProgress = false;
       });
     } else {*/
    this.navCtrl.push(MapView, data).then(next => {
      this.showProgress = false;
    });
    // }
  }

  nextPage() {
    try {
      if (this.alertUtils.networkStatus()) {
        this.diagnostic.isLocationEnabled().then(enable => {
          if (enable) {
            this.navCtrl.push(MapView, {
              from: "welcome",
              items: "",
              exMobileno: this.mobileNumber,
              isExisting: false,
              exUserInfo: "",
              referCode: ""
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
      this.alertUtils.showToast(e.toString())
    }
  }

  showAlertForReferCode(res, productsArray, mNumber) {
    let alert = this.alertCtrl.create({
      title: 'ALERT',
      message: 'You have entered invalid code ',
      buttons: [
        {
          text: 'RE-ENTER',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'SKIP',
          handler: () => {
            if (this.alertUtils.networkStatus()) {
              if (productsArray.length > 0) {
                this.goToMapView(productsArray, mNumber, res, true, this.discountCode);
              } else {
                this.goToMapView(productsArray, mNumber, res, false, this.discountCode);
              }
            } else {
              this.alertUtils.showAlert("INTERNET CONNECTION", INTERNET_ERR_MSG, "OK");
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }

  skip() {
    // this.nextPage();
    this.viewPage();
  }

  viewPage() {
    // this.navCtrl.push(MapView);
    // this.navCtrl.setRoot('MyridesPage');

  }
}
