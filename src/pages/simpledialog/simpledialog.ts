import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GetService } from "../../app/services/get.servie";
import { APP_TYPE, APP_USER_TYPE, MOBILE_TYPE, Utils, RES_SUCCESS, TRY_AGAIN_ERR_MSG, INTERNET_ERR_MSG } from "../../app/services/Utils";
// import { SMS } from "@ionic-native/sms";
import { MapView } from '../MapView/MapView';

@IonicPage()
@Component({
  selector: 'page-simpledialog',
  templateUrl: 'simpledialog.html',
})
export class SimpledialogPage {
  name: string;
  mobileNumber: string;
  senderMobileNumber: string = '9652425341';
  // showSendSMS: boolean = false;
  page1: boolean = true;
  page2: boolean = false;
  //
  referCode: string = "";
  userReferCode: string = "";
  private isExisting: any;
  private exMobileno: any;
  private exUserInfo: any;
  private items: any;
  private calledFrom: string = "";

  constructor(
    // private sms: SMS,
     public navCtrl: NavController, public navParams: NavParams, public alertUtils: Utils, private apiService: GetService) {
  }
  ngOnInit() {

    this.calledFrom = this.navParams.get("from");
    this.alertUtils.showLog(this.calledFrom);
    this.isExisting = this.navParams.get("isExisting");
    this.exMobileno = this.navParams.get("exMobileno");
    this.referCode = this.navParams.get("referCode");
    this.exUserInfo = this.navParams.get("exUserInfo");
    this.alertUtils.showLog(this.exMobileno);
    this.items = this.navParams.get("items");

    if (this.exUserInfo && this.exUserInfo.reference_code) {
      Utils.sLog(this.exUserInfo);
      this.userReferCode = this.exUserInfo.reference_code;
    } else {
      if (this.exUserInfo && this.exUserInfo.user_id)
        this.userReferCode = 'MOYAIT' + this.exUserInfo.user_id;
      else {
        this.userReferCode = 'MOYAIT' + this.exMobileno;

      }
    }

  }

  nextPage() {
    let data = {
      from: "welcome",
      isExisting: this.isExisting,
    };

    if (this.items) {
      data["items"] = this.items
    } else {
      data["items"] = "";
    }
    if (this.exUserInfo) {
      if (this.name)
        this.exUserInfo['firstname'] = this.name;
      data["exUserInfo"] = this.exUserInfo;
    } else {
      data["exUserInfo"] = "";
    }
    if (this.referCode) {
      data["referCode"] = this.referCode;
    } else {
      data["referCode"] = "";
    }
    if (this.exMobileno) {
      data["exMobileno"] = this.exMobileno;
    } else {
      data["exMobileno"] = "";
    }
    Utils.sLog(data);

    this.navCtrl.push(MapView, data).then(next => {
    });
  }

  sendSMS() {
    // Send a text message using default options
  /*  if (this.alertUtils.networkStatus()) {

      this.showSendSMS = true;
      this.sms.hasPermission().then(yes => {
        if (this.alertUtils.validateText(this.name, "Name", 3, 100)) {
          let msg = "Hi , This is " + this.name + " from Moya the water App with reference code :" + this.userReferCode;
          this.sms.send(this.senderMobileNumber, msg).then(success => {
            this.sendContestUser();
          }, reason => {
            this.showSendSMS = false;
            this.alertUtils.showToast("failed to send sms, please try again");
          })
        } else {
          this.showSendSMS = false;
          this.alertUtils.showToast(this.alertUtils.ERROR_MES);
        }
      }, reason => {
        this.showSendSMS = false;
        this.alertUtils.showAlert('PERMISSION', 'Please allow SMS permission to MOYA in phone app setting', "OK")
      });
    } else {
      this.alertUtils.showToast(INTERNET_ERR_MSG);
    }*/
  }

  sendContestUser() {
    /*
    try {

      let data = {
        "User": {
          "transtype": 'littlegenius',
          "name": this.name,
          "mobileno": this.exMobileno,
          "usertype": APP_USER_TYPE,
          "refercode": this.referCode,
          "userrefercode": this.userReferCode,
          "mobiletype": MOBILE_TYPE,
          "apptype": APP_TYPE
        }
      };
      if (this.exUserInfo && this.exUserInfo.user_id) {
        data.User["userid"] = this.exUserInfo.user_id;
      }
      let input = JSON.stringify(data);
      this.apiService.postReq(this.apiService.mobileValidation(), input).then(res => {
        this.showSendSMS = false;
        Utils.sLog(res);
        if (res && res.result == RES_SUCCESS) {
          this.page1 = false;
          this.page2 = true;
        } else {
          this.alertUtils.showToast(TRY_AGAIN_ERR_MSG);
        }
      }, reject => {
        this.showSendSMS = false;
        Utils.sLog(reject);
      })
    } catch (err) {
      this.showSendSMS = false;
      Utils.sLog(err)
    }*/
  }
}
