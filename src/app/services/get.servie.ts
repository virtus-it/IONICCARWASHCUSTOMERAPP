import { Injectable } from "@angular/core";
import { Headers, Http, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import {APP_TYPE, APP_USER_TYPE, IS_WEBSITE, MOBILE_TYPE, Utils} from "./Utils";
import {HTTP} from "@ionic-native/http";

export const APP_VER_CODE: string = "138";

@Injectable()
export class GetService {

  private static DEVELOPMENT_URL = "http://192.168.1.50:2250/";
  private static TESTING_URL = "http://104.211.247.42:2250/";
  private static DEMO_URL = "http://52.138.217.177:2250/";
  private static PRODUCTION_URL = "http://moya.online/";
  private static PAYTM_PRODUCTION_URL = "https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=";
  private static PAYTM_DEVELOPMENT_URL = "https://securegw-stage.paytm.in/theia/paytmCallback?ORDER_ID=";
  public static TRACKING_URL = "http://52.138.217.177:1900";

  http: any;
  private baseUrl: String;

  constructor(http: Http, private Nativehttp: HTTP,private alertUtils: Utils) {
    this.http = http;
    this.baseUrl = GetService.DEMO_URL;
  }


  static getProductsByOrderid() {
    return "getproductsbyorderid";
  }
  static ride() {
    return "ride";
  }
  static entities() {
    return "entities";
  }
  static offers() {
    return "offers";
  }
  static getCategory(loginid) {
    return "productcategory/" + loginid + "/dealer/carwash";
  }
  static getProductsByCategory() {
    return "getproductsbycategory";
  }
  //getproductsbycategory
  //17/dealer/grocery

  static getPoints() {
    return "points";
  }

  static notificationResponse() {
    return "notificationresponse";
  }

  static getProductDetailsById() {
    return "product/";
  }

  static getTemplate() {
    return "creategettemplates";
  }

  static updateOrder() {
    return "updateorder";
  }
  static payNowUrl() {
    return "generate_checksum_ionic";
  }
  static payTmCallBackUrl() {
    return this.PAYTM_DEVELOPMENT_URL;
  }
  //
  // getReq(url) {
  //   this.alertUtils.showLog("/" + this.baseUrl + url);
  //   let headers;
  //   if (IS_WEBSITE) {
  //     headers = new Headers({ 'Content-Type': 'application/json' });
  //   } else {
  //     headers = new Headers();
  //     headers.append("Content-Type", "application/json");
  //     headers.append("module", "moyacustomer");
  //     headers.append("framework", "moyaioniccustomer");
  //     headers.append("devicetype", "android");
  //     headers.append("apptype", APP_TYPE);
  //     headers.append("usertype", APP_USER_TYPE);
  //     headers.append("moyaversioncode", APP_VER_CODE);
  //   }
  //
  //   this.alertUtils.showLog(JSON.stringify(headers));
  //   let options = new RequestOptions({ headers: headers });
  //   return this.http.get(this.baseUrl + url, options).map(res => res.json());
  // }
  //
  // getReqForMap(url) {
  //   this.alertUtils.showLog("/" + url);
  //   return this.http.get(url).map(res => res.json());
  // }
  //
  // postReq(url: string, input) {
  //
  //   let headers;
  //   if (IS_WEBSITE) {
  //     headers = new Headers({ 'Content-Type': 'application/json' });
  //   } else {
  //     headers = new Headers();
  //     headers.append("Content-Type", "application/json");
  //     headers.append("module", "moyacustomer");
  //     headers.append("framework", "moyaioniccustomer");
  //     headers.append("devicetype", "android");
  //     headers.append("apptype", APP_TYPE);
  //     headers.append("usertype", APP_USER_TYPE);
  //     headers.append("moyaversioncode", APP_VER_CODE);
  //
  //   }
  //   this.alertUtils.showLog(JSON.stringify(headers));
  //   let options = new RequestOptions({ headers: headers });
  //   this.alertUtils.showLog("/" + this.baseUrl + url);
  //   this.alertUtils.showLog(input);
  //   return this.http.post(this.baseUrl + url, input, options).map(res => res.json()).toPromise();
  // }
  //
  // putReq(url: string, input) {
  //   let headers;
  //   if (IS_WEBSITE) {
  //     headers = new Headers({ 'Content-Type': 'application/json' });
  //   } else {
  //     headers = new Headers();
  //     headers.append("Content-Type", "application/json");
  //     headers.append("module", "moyacustomer");
  //     headers.append("framework", "moyaioniccustomer");
  //     headers.append("devicetype", "android");
  //     headers.append("apptype", APP_TYPE);
  //     headers.append("usertype", APP_USER_TYPE);
  //     headers.append("moyaversioncode", APP_VER_CODE);
  //
  //   }
  //   this.alertUtils.showLog(JSON.stringify(headers));
  //   let options = new RequestOptions({ headers: headers });
  //   this.alertUtils.showLog("/" + this.baseUrl + url);
  //   this.alertUtils.showLog(input);
  //   return this.http.put(this.baseUrl + url, input, options).map(res => res.json())
  //     .toPromise();
  // }

  getReq(url) {
    Utils.sLog("URL : "+ this.baseUrl+url);

    if (IS_WEBSITE) {
      this.alertUtils.showLog("/" + url);
      let headers;
      if (IS_WEBSITE) {
        headers = new Headers({'Content-Type': 'application/json'});
      } else {
        headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("module", "moyacustomer");
        headers.append("framework", "moyaioniccustomer");
        headers.append("devicetype", MOBILE_TYPE);
        headers.append("apptype", APP_TYPE);
        headers.append("usertype", APP_USER_TYPE);
        headers.append("moyaversioncode", APP_VER_CODE);
      }

      this.alertUtils.showLog(JSON.stringify(headers));
      let options = new RequestOptions({headers: headers});
      return this.http.get(this.baseUrl + url, options).map(res => res.json());
    } else {
      return this.callGetReq(url);
    }
  }

  async callGetReq(url) {
    let data = await this.nativeGetReg(url).then(res => {
      console.log("Api call result");
      console.log(res);
      if (res && res.data)
        return JSON.parse(res.data);
      else {
        let err = {
          result: "failed"
        };
        return err;
      }
    }).catch(err => {
      console.log("Api call failed");
      let failed = {
        result: "failed"
      };
      return failed;
    });
    console.log("modified result");
    console.log(data);
    return data


  }

  nativeGetReg(url) {
    let headers = {
      'Content-Type': 'application/json',
      'module': 'moyacustomer',
      'framework': 'moyaioniccustomer',
      'devicetype': MOBILE_TYPE,
      'apptype': APP_TYPE,
      'usertype': APP_USER_TYPE,
      'moyaversioncode': APP_VER_CODE

    };

    return this.Nativehttp.get(this.baseUrl + url, {}, headers);

  }

  getReqForMap(url) {
    if (IS_WEBSITE) {
      this.alertUtils.showLog("/" + url);
      return this.http.get(url).map(res => res.json());
    } else {
      let headers = new Headers({'Content-Type': 'application/json'});
      let options = new RequestOptions({headers: headers});
      return this.nativeGetMapReq(url);
    }


  }

  async nativeGetMapReq(url) {
    let data = await this.Nativehttp.get(url, {}, {}).then(res => {
      if (res) {
        return JSON.parse(res.data);
      } else {
        return "";
      }
    }).catch(() => {
      return "";
    });
    return data;
  }

  postReq(url: string, input) {
    Utils.sLog("URL : "+ this.baseUrl+url);

    if (IS_WEBSITE) {

      let headers;
      if (IS_WEBSITE) {
        headers = new Headers({'Content-Type': 'application/json'});
      } else {
        headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("module", "moyacustomer");
        headers.append("framework", "moyaioniccustomer");
        headers.append("devicetype", MOBILE_TYPE);
        headers.append("apptype", APP_TYPE);
        headers.append("usertype", APP_USER_TYPE);
        headers.append("moyaversioncode", APP_VER_CODE);

      }
      this.alertUtils.showLog(JSON.stringify(headers));
      let options = new RequestOptions({headers: headers});
      this.alertUtils.showLog("/" + url);
      this.alertUtils.showLog(input);
      return this.http.post(this.baseUrl + url, input, options).map(res => res.json())
        .toPromise();
    } else {
      return this.callPostReq(url, input);
    }

  }

  async callPostReq(url, input) {
    let data = await this.nativePostReq(url, input).then(res => {
      this.alertUtils.showLog("Api call result");
      this.alertUtils.showLog(res);
      if (res && res.data)
        return JSON.parse(res.data);
      else {
        let err = {
          result: "error"
        };
        return err;
      }
    }).catch(() => {
      this.alertUtils.showLog("Api call failed");
      let failed = {
        result: "failed"
      };
      return failed;
    });
    this.alertUtils.showLog("modified result");
    this.alertUtils.showLog(data);
    return data
  }

  nativePostReq(url, input) {
    this.alertUtils.showLog(input);
    let data = JSON.parse(input);
    let headers = {
      'Content-Type': 'application/json',
      'module': 'moyacustomer',
      'framework': 'moyaioniccustomer',
      'devicetype': MOBILE_TYPE,
      'apptype': APP_TYPE,
      'usertype': APP_USER_TYPE,
      'moyaversioncode': APP_VER_CODE

    };
    this.Nativehttp.setDataSerializer('json');
    return this.Nativehttp.post(this.baseUrl + url, data, headers);
  }


  putReq(url: string, input) {
    Utils.sLog("URL : "+ this.baseUrl+url);

    if (IS_WEBSITE) {

      let headers;
      if (IS_WEBSITE) {
        headers = new Headers({'Content-Type': 'application/json'});
      } else {
        headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("module", "moyacustomer");
        headers.append("framework", "moyaioniccustomer");
        headers.append("devicetype", MOBILE_TYPE);
        headers.append("apptype", APP_TYPE);
        headers.append("usertype", APP_USER_TYPE);
        headers.append("moyaversioncode", APP_VER_CODE);

      }
      this.alertUtils.showLog(JSON.stringify(headers));
      let options = new RequestOptions({headers: headers});
      this.alertUtils.showLog("/" + url);
      this.alertUtils.showLog(input);
      return this.http.put(this.baseUrl + url, input, options).map(res => res.json())
        .toPromise();
    } else {
      return this.callPutReq(url, input);

    }
  }

  async callPutReq(url, input) {
    let data = await this.nativePutReq(url, input).then(res => {
      this.alertUtils.showLog("Api call result");
      this.alertUtils.showLog(res);
      if (res && res.data)
        return JSON.parse(res.data);
      else {
        let err = {
          result: "error"
        };
        return err;
      }
    }).catch(() => {
      this.alertUtils.showLog("Api call failed");
      let failed = {
        result: "failed"
      };
      return failed;
    });
    this.alertUtils.showLog("modified result");
    this.alertUtils.showLog(data);
    return data
  }

  nativePutReq(url, input) {
    this.alertUtils.showLog(input);
    let data = JSON.parse(input);
    let headers = {
      'Content-Type': 'application/json',
      'module': 'moyacustomer',
      'framework': 'moyaioniccustomer',
      'devicetype': MOBILE_TYPE,
      'apptype': APP_TYPE,
      'usertype': APP_USER_TYPE,
      'moyaversioncode': APP_VER_CODE

    };
    this.Nativehttp.setDataSerializer('json');
    return this.Nativehttp.put(this.baseUrl + url, data, headers);
  }

  getImg() {
    return this.baseUrl + "modules/uploads/"
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  forgotPwd() {
    return "forgotpwd/" + APP_TYPE + "/";
  }

  getProductsByCustomerId() {
    return "getproductsbycustomerid/";
  }

  getProductsByDistributerId() {
    return "getproductsbydistributerid";
  }

  getAreaWiseProducts() {
    return "getareawiseproducts";
  }

  getSignUpUrl() {
    return "createusersignup";
  }

  getOrderListByStatus() {
    return "orderlistbystatus";
  }

  getOrderDetails() {
    return "getorderbyid/" + APP_TYPE + "/";
  }

  cancelOrder() {
    return "cancelorder";
  }

  createMessageOnOrder() {
    return "createmessageonorder";
  }

  fetchUserInfo() {
    return "user/user/";
  }

  getPaymentDetails() {
    return "getpaymentdetails";
  }

  getPaymentstHistoryByUserid() {
    return "getpaymentstbyuserid";
  }

  login() {
    return "login";
  }

  mobileValidation() {
    return "mobilevalidation";
  }

  getFeedback() {
    return "getfeed_back";
  }

  createFeedback() {
    return "issue";
  }

  createFeedbackReply() {
    return "createreplytoissue";
  }

  invitefriends() {
    return "invitefriend";
  }

  updateUser() {
    return "user";
  }

  placeOrder() {
    return "mcreateorder";
  }

  getSchedules() {
    //	getschedules/userid/apptype
    return "getschedules/";

  }

  createScheduler() {
    return "createscheduler";

  }

  updateScheduleOrder() {
    return "scheduler";

  }

  setGCMRegister() {
    return "setgcmdetails";
  }

  changeScheduleStatus() {
    return "changeschedulestatus";

  }

  appFirstCall() {
    return "appfirstcall";
  }

}


