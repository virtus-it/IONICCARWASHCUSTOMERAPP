import { Injectable } from "@angular/core";
import { AlertController, LoadingController, ToastController } from "ionic-angular";
import { AppVersion } from "@ionic-native/app-version";
import { NativeStorage } from "@ionic-native/native-storage";
import { CallNumber } from "@ionic-native/call-number";
import { Toast } from "@ionic-native/toast";
import { OpenNativeSettings } from "@ionic-native/open-native-settings";
import { Network } from "@ionic-native/network";
import { Diagnostic } from "@ionic-native/diagnostic";
import { AppRate } from "@ionic-native/app-rate";
import * as moment from "moment";
import { Device } from "@ionic-native/device";

export const SHOW_ALL = false;
export const IS_WEBSITE: boolean = false;

const KEY_USER_ID = 'secure_storage_userid';
const KEY_DEALER_ID = 'secure_storage_dealerid';
const KEY_DEALER_PHONE = 'secure_storage_dealerphone';
const KEY_USERNAME = 'secure_storage_username';
const KEY_USER_PHNO = 'secure_storage_userphone';
const KEY_USER_EMAIL = 'secure_storage_useremailid';
const KEY_USER_PWD = 'secure_storage_userpwd';
const KEY_USER_ADDR = 'secure_storage_useraddr';
const KEY_USER_CITY = 'secure_storage_usercity';
const KEY_USER_STATE = 'secure_storage_userstate';
const KEY_USER_PIN = 'secure_storage_userpin';
const KEY_USER_IMGNAME = 'secure_storage_userimagename';
const KEY_USER_IMAGE_VERSION = 'secure_userimageversion';
const KEY_DEALER_NAME = 'secure_storage_dealername';
const KEY_USER_LAT = 'secure_storage_userlat';
const KEY_USER_LNG = 'secure_storage_userlng';
const KEY_USER_LOGIN_STATUS = 'secure_storage_user_login_status';
const KEY_USER_PROMO_CODE = 'secure_storage_user_prome_code';
const KEY_USER_INFO = 'secure_storage_user_user_info';
const KEY_APP_FIRST_CALL_INFO = 'secure_storage_user_app_first_info';
const KEY_USER_LANG = 'secure_storage_user_lang';

export const APP_TYPE: string = "carwash";
export const APP_USER_TYPE: string = "customer";
export const MOBILE_TYPE: string = "android";
export const FRAMEWORK: string = "ionic";
export const RES_SUCCESS: string = "success";
export const INTERNET_ERR_MSG = "Please check internet connectivity and try again";
export const GEN_ERR_MSG = "Something went wrong please check internet connectivity and try again";
export const TRY_AGAIN_ERR_MSG = "Something went wrong please try again";
export const VALIDATE_EMAIL = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Injectable()
export class Utils {
  // for service
  static categoryList: Map<string, any>;
  // for ride
  static rideSelected: any;
  static USER_INFO_DATA: any;
  static productsList: any;
  static UPDATE_ORDER_LIST: boolean = false;
  static NotificationPageData: any;
  INTERNET_ERR_MSG = "Please check internet connectivity and try again";
  GEN_ERR_MSG = "Something went wrong please check internet connectivity and try again";
  RESULT_SUCCESS: string = "success";
  public ERROR_MES = "";
  DIGITS = "[0-9]*";
  userAddrData: any;
  private GCM_ID = "";
  private START_STR = "Please enter ";
  private pd;
  static datePicked: any;
  static lang: string = "en";
  sliderName: string = "Hi User";

  constructor(private appRate: AppRate, private diagnostic: Diagnostic, private net: Network, public toast: ToastController, public loadingCtrl: LoadingController, private appVersion: AppVersion, private nativeStorage: NativeStorage, public alertCtrl: AlertController, private cNumber: CallNumber, private tToast: Toast, private nSetting: OpenNativeSettings, private device: Device) {
   
  }

  private static _APP_PAYTM_MID = "dummyS79577994716430";

  static get APP_PAYTM_MID(): string {
    return this._APP_PAYTM_MID;
  }

  private static _APP_PAYTM_ENV = "staging";

  static get APP_PAYTM_ENV(): string {
    return this._APP_PAYTM_ENV;
  }

  private static _APP_USER_LNG = "";

  static get APP_USER_LNG(): string {
    return this._APP_USER_LNG;
  }

  private static _APP_USER_NAME = "";

  public static get APP_USER_NAME(): string {
    try {
      this._APP_USER_NAME = this._APP_USER_NAME.replace(null, "");
    } catch (e) {
      console.error("APP_USER_NAME", e);
    }
    return this._APP_USER_NAME;
  }

  private static _APP_USER_ID = "";

  public static get APP_USER_ID(): string {
    return this._APP_USER_ID;
  }

  private static _APP_USER_MOBILENO = "";

  public static get APP_USER_MOBILENO(): string {
    return this._APP_USER_MOBILENO;
  }

  private static _APP_USER_DEALERID = "";

  public static get APP_USER_DEALERID(): string {
    return this._APP_USER_DEALERID;
  }

  private static _APP_USER_EMAILID = "";

  static get APP_USER_EMAILID(): string {
    return this._APP_USER_EMAILID;
  }

  private static _APP_USER_LAT = "";

  static get APP_USER_LAT(): string {
    return this._APP_USER_LAT;
  }

  static sLog(val, lineNumber?, pageName?) {
    // Utils.sLog(val);
    // if (lineNumber)
    //   Utils.sLog(lineNumber);
    // if (pageName)
    //   Utils.sLog(pageName);
  }

  static getRandomRolor() {
    const letters = 'BCDEF66'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * letters.length)];
    }
    return color;
  }

  static formatDateToDDMMYYYY(date) {
    let d = new Date(date);
    return moment(d).format('DD-MM-YYYY');
  }
  static formatDateToDDMMYYYYHHMMSS(date) {
    let d = new Date(date);
    return moment(d).format('DD-MM-YYYY HH:MM:SS');
  }


  static formatDateToYYYYMMDD(date) {
    let d = new Date(date);
    return moment(d).format('YYYY-MM-DD');
  }

  showLog(val, lineNumber?, pageName?) {
    // Utils.sLog(val);
    // if (lineNumber)
    //   Utils.sLog(lineNumber);
    // if (pageName)
    //   Utils.sLog(pageName);
  }
  static groupByBrandName(array, f) {
    var groups = {};
    array.forEach(function (o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      return groups[group];
    })
  }

  showLogTitle(title, val) {
    //console.warn(title, val);
  }

  storeAddrData(data) {
    if (data)
      this.userAddrData = data;
  }

  getAddrData() {
    return this.userAddrData;
  }

  getDeviceUUID() {
    return this.device.uuid;
  }

  updateStaticValue() {

    this.getUserId().then(userId => {
      Utils._APP_USER_ID = userId;
      this.showLog(Utils._APP_USER_ID);
      this.getDealerId().then(dealerId => {
        Utils._APP_USER_DEALERID = dealerId;
        this.showLog(Utils._APP_USER_DEALERID);
      });
      this.getUserName().then(userName => {
        Utils._APP_USER_NAME = userName;
        this.showLog(Utils._APP_USER_NAME);
      });
      this.getUserMobileNo().then(phoneno => {
        Utils._APP_USER_MOBILENO = phoneno;
        this.showLog(Utils._APP_USER_MOBILENO);
      });
      this.getUserEmailId().then(emailId => {
        Utils._APP_USER_EMAILID = emailId;
        this.showLog(Utils._APP_USER_EMAILID);
      });
      this.getSecValue(KEY_USER_LAT).then(lat => {
        Utils._APP_USER_LAT = lat;
        this.showLog(Utils._APP_USER_LAT);

      });


      this.getSecValue(KEY_USER_LNG).then(lat => {
        Utils._APP_USER_LNG = lat;
        this.showLog(Utils._APP_USER_LNG);
      });
    }, err => {
      this.showLog(err);
    });
  }

  showToastWithButton(message: string, showCloseButton: boolean, showCloseButtonText: string) {
    const toast = this.toast.create({
      message: message,
      showCloseButton: showCloseButton,
      closeButtonText: showCloseButtonText
    });
    toast.present();
  }

  showToast(message: string) {
    // this.tToast.show(message, '2000', 'bottom').subscribe(
    //   toast => {
    //     this.showLog(toast);
    //   }
    // );

    let toast = this.toast.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  showToastSnackBar(message: string) {
    let toast = this.toast.create({
      message: message,
      duration: 1400
    });
    toast.present();
  }

  rateUs() {

    this.appRate.preferences.storeAppURL = {
      android: 'market://details?id=com.washonclick'
    };
    this.appRate.navigateToAppStore();

  }

  showLoading() {
    this.pd = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.pd.present();
  }


  showLoadingWithText(text) {
    this.pd = this.loadingCtrl.create({
      content: text,
      dismissOnPageChange: true
    });
    this.pd.present();
    setTimeout(() => {
      this.pd.dismiss();
    }, 5000);

  }

  hideLoading() {
    if (this.pd)
      this.pd.dismiss();

  }

  callNumber(number) {
    this.cNumber.callNumber(number, true)
      .then(() => Utils.sLog('Launched call!'))
      .catch(() => Utils.sLog('Error launching call'));
  }


  getAppVersion() {
    return this.appVersion.getAppName();
  }

  getPackageName() {
    return this.appVersion.getPackageName();
  }

  getVersionCode() {
    return this.appVersion.getVersionCode();
  }

  getVersionNumber() {
    return this.appVersion.getVersionNumber();
  }

  setSecureValue(keyName: string, keyValue: any) {
    this.nativeStorage.setItem(keyName, keyValue)
      .then(() => Utils.sLog('Stored  Data!'), error => console.error('Error storing data', error));

  }

  setPromoCode(keyValue: any) {
    this.nativeStorage.setItem(KEY_USER_PROMO_CODE, keyValue)
      .then(() => Utils.sLog('Stored PROMO Data!'), error => console.error('Error storing data', error));

  }

  getPromoCode() {
    return this.nativeStorage.getItem(KEY_USER_PROMO_CODE);
  }

  getSecValue(keyName: string) {
    return this.nativeStorage.getItem(keyName);
  }

  cacheInfo(uid: string,
    pwd: string, phno: string, email: string, uType: string, uName: string,
    dealerId: string, dealerMno: string, imgName: string,
    imgVersion: string, addr: string, city: string, state: string,
    pin: string, dealerName: string,
    userLatitude: string, userLongitude: string, ) {
    Utils._APP_USER_ID = uid;
    Utils._APP_USER_DEALERID = dealerId;
    Utils._APP_USER_MOBILENO = phno;
    if (uName)
      uName = uName.replace("null", "");
    Utils._APP_USER_NAME = uName;
    Utils._APP_USER_EMAILID = email;

    this.nativeStorage.setItem(KEY_USER_ID, uid)
      .then(() => Utils.sLog('Stored  Data!USER_ID'), error => console.error('Error storing data', error));
    this.nativeStorage.setItem(KEY_DEALER_ID, dealerId)
      .then(() => Utils.sLog('Stored  Data!KEY_DEALER_ID'), error => console.error('Error storing data', error));
    this.nativeStorage.setItem(KEY_USERNAME, uName)
      .then(() => Utils.sLog('Stored  Data!'), error => console.error('Error storing data', error));
    this.nativeStorage.setItem(KEY_USER_PHNO, phno)
      .then(() => Utils.sLog('Stored  Data!'), error => console.error('Error storing data', error));
    this.nativeStorage.setItem(KEY_USER_PWD, pwd)
      .then(() => Utils.sLog('Stored  Data!'), error => console.error('Error storing data', error));
    this.nativeStorage.setItem(KEY_USER_ADDR, addr)
      .then(() => Utils.sLog('Stored  Data!'), error => console.error('Error storing data', error));
    this.nativeStorage.setItem(KEY_USER_CITY, city)
      .then(() => Utils.sLog('Stored  Data!'), error => console.error('Error storing data', error));
    this.nativeStorage.setItem(KEY_USER_STATE, state)
      .then(() => Utils.sLog('Stored  Data!'), error => console.error('Error storing data', error));
    this.nativeStorage.setItem(KEY_USER_PIN, pin)
      .then(() => Utils.sLog('Stored  Data!'), error => console.error('Error storing data', error));
    this.nativeStorage.setItem(KEY_USER_IMGNAME, imgName)
      .then(() => Utils.sLog('Stored  Data!'), error => console.error('Error storing data', error));
    this.nativeStorage.setItem(KEY_USER_IMAGE_VERSION, imgVersion)
      .then(() => Utils.sLog('Stored  Data!'), error => console.error('Error storing data', error));
    this.nativeStorage.setItem(KEY_DEALER_NAME, dealerName)
      .then(() => Utils.sLog('Stored  Data!'), error => console.error('Error storing data', error));
    this.nativeStorage.setItem(KEY_USER_LAT, userLatitude)
      .then(() => Utils.sLog('Stored  Data!'), error => console.error('Error storing data', error));
    this.nativeStorage.setItem(KEY_USER_LNG, userLongitude)
      .then(() => Utils.sLog('Stored  Data!'), error => console.error('Error storing data', error));
    this.nativeStorage.setItem(KEY_USER_EMAIL, email)
      .then(() => Utils.sLog('Stored  Data!'), error => console.error('Error storing data', error));

  }

  cacheUserInfo(data) {
    this.nativeStorage.setItem(KEY_USER_INFO, data)
      .then(() => Utils.sLog('Stored  USER_INFO'), error => console.error('Error storing data', error));
  }

  getUserInfo() {

    return this.nativeStorage.getItem(KEY_USER_INFO);
  }
  setLang(data) {
    this.nativeStorage.setItem(KEY_USER_LANG, data)
      .then(() => Utils.sLog('Stored  USER_INFO'), error => console.error('Error storing data', error));
  }

  getLang() {

    return this.nativeStorage.getItem(KEY_USER_LANG);
  }
  cacheAppFirstInfo(data) {
    this.nativeStorage.setItem(KEY_APP_FIRST_CALL_INFO, data)
      .then(() => Utils.sLog('Stored  USER_INFO'), error => console.error('Error storing data', error));
  }

  getAppFirstInfo() {

    return this.nativeStorage.getItem(KEY_APP_FIRST_CALL_INFO);
  }

  getLoginState() {
    this.showLog("LOGIN CACHE VALUE");
    return this.nativeStorage.getItem(KEY_USER_LOGIN_STATUS)
  }

  setLoginState(status: boolean) {
    this.nativeStorage.setItem(KEY_USER_LOGIN_STATUS, status)
      .then(() => Utils.sLog('Stored  Login status'), error => console.error('Error storing data', error));

  }

  setUserDealerId(dealerId) {
    this.nativeStorage.setItem(KEY_DEALER_ID, dealerId)
      .then(() => Utils.sLog('Stored  Data!KEY_DEALER_ID'), error => console.error('Error storing data', error));
  }


  getUserAddr() {
    return this.nativeStorage.getItem(KEY_USER_ADDR)
  }

  setUserAddr(keyValue: any) {
    this.nativeStorage.setItem(KEY_USER_ADDR, keyValue)
      .then(() => Utils.sLog('Stored  Login status'), error => console.error('Error storing data', error));

  }

  setUserLatLng(lat: any, lng: any) {
    this.nativeStorage.setItem(KEY_USER_LAT, lat)
      .then(() => Utils.sLog('Stored  Data!'), error => console.error('Error storing data', error));
    this.nativeStorage.setItem(KEY_USER_LNG, lng)
      .then(() => Utils.sLog('Stored  Data!'), error => console.error('Error storing data', error));
  }

  getUserMobileNo() {
    return this.nativeStorage.getItem(KEY_USER_PHNO)
  }

  getUserEmailId() {
    return this.nativeStorage.getItem(KEY_USER_EMAIL)
  }

  setUserEmailId(keyValue) {
    this.nativeStorage.setItem(KEY_USER_EMAIL, keyValue)
      .then(() => Utils.sLog('Stored  Login status'), error => console.error('Error storing data', error));
  }


  getUserId() {
    return this.nativeStorage.getItem(KEY_USER_ID)
  }

  getDealerId() {
    return this.nativeStorage.getItem(KEY_DEALER_ID)
  }

  getUserName() {
    return this.nativeStorage.getItem(KEY_USERNAME)
  }

  setUserName(value) {
    this.nativeStorage.setItem(KEY_USERNAME, value).then(value2 => {
      this.showLogTitle('name updated successfully', value2);
    });
  }

  getUserpd() {
    return this.nativeStorage.getItem(KEY_USER_PWD)
  }

  setUserpd(value) {
    this.nativeStorage.setItem(KEY_USER_PWD, value).then(value => {
      this.showLog('Psd updated successfully');
    }).catch(err => {
      this.showLog('Psd updated failed');
    });
  }

  showAlert(title: string, message: string, btnName: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: btnName,
          handler: () => {
          }
        }
      ]
    });
    alert.present();
  }

  validateText(s: string, fieldName: string, minLength: any, maxLength: any): boolean {

    this.showLog("***************" + fieldName + " Validation"
      + "***************");
    this.showLog("Field Value : " + s);
    this.showLog("Min Length  : " + minLength);
    this.showLog("maxLength   : " + maxLength);

    if (s) {
      if (s.length >= minLength) {
        if (s.length <= maxLength) {
          if (s.indexOf("'") == -1) {
            return true;
          } else {
            this.ERROR_MES = "single coat not allowed in " + fieldName;
            this.showLog("Error Mes   : " + this.ERROR_MES);
            return false;
          }
        } else {
          this.ERROR_MES = this.START_STR + "max " + maxLength
            + " characters of " + fieldName;
          this.showLog("Error Mes   : " + this.ERROR_MES);
          return false;
        }
      } else {
        this.ERROR_MES = this.START_STR + "atleast " + minLength
          + " characters of " + fieldName;
        this.showLog("Error Mes   : " + this.ERROR_MES);
        return false;
      }
    } else {
      this.ERROR_MES = this.START_STR + fieldName;
      this.showLog("Error Mes   : " + this.ERROR_MES);
      return false;
    }

  }

  isValidMobile(mob): any {

    let regExp = /^[0-9]{10}$/;

    if (!regExp.test(mob)) {
      return { "invalidMobile": true };
    }
    return null;
  }

  isValidQty(mob): any {

    let regExp = /^[0-9]+$/;

    if (!regExp.test(mob)) {
      return { "invalidMobile": true };
    }
    return null;
  }

  isValidName(name): any {

    let regExp = /^[a-z][A-Z]{50}$/;

    if (!regExp.test(name)) {
      return { "invalidMobile": true };
    }
    return null;
  }

  validateNumber(s: string, fieldName: string, minLength: any, maxLength: any) {

    this.showLog("*************** " + fieldName + " Validation"
      + " ***************");
    this.showLog("Field Value : " + s);
    this.showLog("Min Length  : " + minLength);
    this.showLog("maxLength   : " + maxLength);

    if (s) {
      if (s.match(this.DIGITS)) {
        if (s.length >= minLength) {
          if (s.length <= maxLength) {
            if (s.indexOf("'") == -1) {
              return true;
            } else {
              this.ERROR_MES = "single coat not allowed in " + fieldName;
              this.showLog("Error Mes   : " + this.ERROR_MES);
              return false;
            }
          } else {
            this.ERROR_MES = this.START_STR + "max " + maxLength
              + " digits of " + fieldName;
            this.showLog("Error Mes   : " + this.ERROR_MES);
            return false;
          }
        } else {
          this.ERROR_MES = this.START_STR + "atleast " + minLength
            + " digits of " + fieldName;
          this.showLog("Error Mes   : " + this.ERROR_MES);
          return false;
        }
      } else {
        this.ERROR_MES = this.START_STR + "only digits";
        this.showLog("Error Mes   : " + this.ERROR_MES);
        return false;
      }
    } else {
      this.ERROR_MES = this.START_STR + fieldName;
      return false;
    }

  }

  openLoationSetting() {
    this.nSetting.open("location").then(value => {
      return true;
    }, err => {
      return false;
    });
  }

  dialogForLocationSetting(title: string, message: string, btnName: string) {

    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.openLoationSetting();
          }
        }
      ]
    });
    alert.present();

  }

  networkStatus() {
    if (this.net.type == "none")
      return false;
    else
      return true;
  }

  geoLocationStatus() {
    return this.diagnostic.isLocationEnabled();
  }

  saveGcmId(registrationId: string) {
    this.GCM_ID = registrationId;
  }

  getGcmId() {
    return this.GCM_ID;
  }


}


