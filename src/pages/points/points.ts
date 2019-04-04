import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { GetService } from "../../app/services/get.servie";
import { APP_TYPE, APP_USER_TYPE, RES_SUCCESS, TRY_AGAIN_ERR_MSG, Utils } from "../../app/services/Utils";

@IonicPage()
@Component({
  selector: 'page-points',
  templateUrl: 'points.html',
})

export class PointsPage {
  private pointSum: any;
  private pointsHistory: any;
  private pointTab: boolean = true;
  private pointsHistoryTab: boolean = true;
  private showProgress: boolean = false;
  private redeemPoint: boolean = false;
  private infoList: boolean = false;
  private redeemType = "paytm";
  private redeemMobileNo: any;
  private userMobileNo: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: GetService, private alertUtils: Utils) {
  }

  ionViewDidLoad() {
    Utils.sLog('ionViewDidLoad PointsPage');
  }

  ngOnInit() {
    console.log('paytm', this.redeemType);

    this.alertUtils.getUserInfo().then(info => {
      if (info) {
        Utils.USER_INFO_DATA = info;
        if (Utils.USER_INFO_DATA) {
          this.userMobileNo = Utils.USER_INFO_DATA.mobileno;
          this.redeemMobileNo = Utils.USER_INFO_DATA.mobileno;
        }
        this.fetchPoints();
      }
    }, err => {
      Utils.sLog(err);
    });

  }

  fetchPoints() {
    let data = { "User": { "TransType": "getpoints", "userid": Utils.USER_INFO_DATA.userid, "usertype": APP_USER_TYPE } };
    let data1 = {
      "User": {
        "TransType": "getpointsdetails",
        "userid": Utils.USER_INFO_DATA.userid,
        "usertype": APP_USER_TYPE,
        "apptype": APP_TYPE
      }
    };
    let input = JSON.stringify(data);
    let input1 = JSON.stringify(data1);
    this.showProgress = true;
    this.api.postReq(GetService.getPoints(), input).then(result => {
      this.showProgress = false;
      Utils.sLog(result);
      if (result.result == RES_SUCCESS) {
        if (result.data) {
          this.pointSum = result.data;
          if (!this.pointSum.totalpoints) {
            this.pointSum.totalpoints = 0;
          }
          if (this.pointSum.totalpoints > this.pointSum.redeempoints) {
            this.pointSum['color'] = "success"
          } else {
            this.pointSum['color'] = "danger"
          }
          Utils.sLog(this.pointSum);
          this.showProgress = true;
          this.api.postReq(GetService.getPoints(), input1).then(result1 => {
            this.showProgress = false;
            Utils.sLog(result1);
            if (result1.result == RES_SUCCESS) {
              if (result1.data) {
                this.pointsHistory = result1.data;
                for (let i = 0; i < this.pointsHistory.length; i++) {
                  if (this.pointsHistory[i].status) {
                    if (this.pointsHistory[i].status.toLowerCase() == 'delivered' || this.pointsHistory[i].status.toLowerCase() == 'complete' || this.pointsHistory[i].status.toLowerCase().indexOf('credit') != -1) {
                      this.pointsHistory[i]["color"] = 'success';
                    } else if (this.pointsHistory[i].status.toLowerCase() == 'signup') {
                      this.pointsHistory[i]["color"] = 'warning';
                    } else if (this.pointsHistory[i].status.toLowerCase() == 'referalbonus' || this.pointsHistory[i].status.toLowerCase() == 'inprocess') {
                      this.pointsHistory[i]["color"] = 'primary';
                    } else if (this.pointsHistory[i].status.toLowerCase().indexOf('promocode') != -1) {
                      this.pointsHistory[i]["color"] = 'orange';
                    } else {
                      this.pointsHistory[i]["color"] = 'gray9';
                    }
                  }
                }
                Utils.sLog(this.pointsHistory);
              }
            }
          }).catch(error1 => {
            this.showProgress = false;
            Utils.sLog(error1);
          })
        }
      } else {
        this.alertUtils.showToast(TRY_AGAIN_ERR_MSG);
      }
    }).catch(error => {
      this.showProgress = false;
      Utils.sLog(error);
    })
  }

  showRedeemTab() {
    this.pointTab = false;
    this.pointsHistoryTab = false;
    this.redeemPoint = true;
  }

  btnRedeem() {
    if (this.redeemType) {
      if (this.redeemMobileNo) {
        if (this.alertUtils.validateNumber(this.redeemMobileNo, "Mobile Number", 10, 10)) {
          if (!this.alertUtils.isValidMobile(this.redeemMobileNo)) {
            let data = {
              "User": {
                "TransType": "redeem",
                "status": "inprocess",
                "type": this.redeemType,
                "redeemmobileno": this.redeemMobileNo,
                "registermobileno": this.userMobileNo,
                "redeempoint": this.pointSum.redeempoints,
                "userid": Utils.USER_INFO_DATA.userid,
                "usertype": APP_USER_TYPE,
                "apptype": APP_TYPE
              }
            };
            let input = JSON.stringify(data);
            this.api.postReq(GetService.getPoints(), input).then(result => {
              Utils.sLog(result);
              if (result.result == RES_SUCCESS) {
                this.alertUtils.showToast("Request have been submitted successfully");
                this.pointTab = true;
                this.pointsHistoryTab = true;
                this.redeemPoint = false;
                this.fetchPoints();
              } else {
                this.alertUtils.showToast(TRY_AGAIN_ERR_MSG);
              }

            }).catch(error => {
              Utils.sLog(error);
            })
          }
          else {
            this.alertUtils.showToast(this.alertUtils.ERROR_MES);
          }
        } else {
          this.alertUtils.showToast("Invalid mobile number");
        }
      }
      else {
        this.alertUtils.showToast("Please enter mobile number");
      }
    }
    else {
      this.alertUtils.showToast("Please select redeem Type");
    }
  }

  showInfoList() {
    if (this.infoList)
      this.infoList = false;
    else {
      this.infoList = true;
      this.pointsHistoryTab = true;
    }

  }

  btnCancel() {
    console.log("call cancel");
    this.pointTab = true;
    this.pointsHistoryTab = true;
    this.redeemPoint = false;

  }
}
