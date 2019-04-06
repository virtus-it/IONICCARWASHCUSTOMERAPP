import {Component} from "@angular/core";
import {AlertController, App, NavController} from "ionic-angular";
import {AppRate} from "@ionic-native/app-rate";
import {APP_TYPE, INTERNET_ERR_MSG, RES_SUCCESS, TRY_AGAIN_ERR_MSG, Utils} from "../../app/services/Utils";
import {GetService} from "../../app/services/get.servie";
import { WelcomePage } from "../WelcomePage/Welcome";


@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public alertUtils: Utils, private getService: GetService, private appRate: AppRate, private appCtrl: App) {


  }

  ngOnInit() {

    try {
      this.alertUtils.updateStaticValue();
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
  }

  fetchUserInfo() {
    this.getData();
  }

  
  getData() {
    try {
      this.alertUtils.showLoading();
      this.getService.getReq(this.getService.fetchUserInfo() + Utils.USER_INFO_DATA.userid + "/" + APP_TYPE).subscribe(res => {
        this.alertUtils.hideLoading();
        this.alertUtils.showLog(res);
        if (res.result == RES_SUCCESS) {
          if (res.data) {
            if (res.data.user.stock) {
              let emptyCansArray = [];
              for (let i = 0; i < res.data.user.stock.length; i++) {
                if (res.data.user.stock[i].avaliablecans != 0) {
                  if (res.data.user.stock[i].avaliablecans < 0) {
                    res.data.user.stock[i]["cancolor"] = "danger";
                    var str = res.data.user.stock[i].avaliablecans.toString();
                    res.data.user.stock[i].avaliablecans = str.replace("-", "");
                  }
                  emptyCansArray.push(res.data.user.stock[i]);
                }

              }
              res.data.user["cansarray"] = emptyCansArray;
            }
            this.navCtrl.push('MyProfile', {
              items: res.data
            })
          }
        } else {
          this.alertUtils.showToast(TRY_AGAIN_ERR_MSG);
        }
      }, err => {
        this.alertUtils.showToast(this.alertUtils.INTERNET_ERR_MSG);
        this.alertUtils.hideLoading();
        console.log(err);
      });
    } catch (error) {
      this.alertUtils.showLog(error);
    }
  }

  myPoints() {
    this.navCtrl.push('PointsPage', {
      items: "myaccount"
    })
  }

  mySchedules() {
    this.navCtrl.push('ScheduleOrderPage', {
      items: "myaccount"
    })
  }

  fetchPaymentInfo() {
    this.navCtrl.push('MyPaymentPage', {
      callfrom: "contacts"
    })
  }

  rateUs() {

    this.appRate.preferences.storeAppURL = {
      android: 'market://details?id=com.moya'
    };
    this.appRate.promptForRating(true);
  }


  customerCareDialog() {
    let alert = this.alertCtrl.create({
      title: "CUSTOMER CARE",
      message: "Our Customer service offers a variety of customer care and customer support options to help you in every possible manner. \n Office timing : 09:30AM - 06:30PM IST \n\n Customer care number : 9121642009",
      buttons: [
        {
          text: "CLOSE",
          handler: () => {
          }
        },
        {
          text: "CALL NOW",
          handler: () => {
            this.alertUtils.callNumber("9863636315");
          }
        }
      ]
    });
    alert.present();
  }


  feedback() {
    this.navCtrl.push('Feedback', {
      items: "myaccount"
    })
  }

  inviteFriends() {
    this.navCtrl.push('InviteFriends', {
      items: "myaccount"
    })
  }

  aboutUs() {
    this.navCtrl.push('AboutUs', {
      items: "myaccount"
    })
  }

  logOut() {
    this.showLogOutAlert();
  }

  showLogOutAlert() {
    let alert = this.alertCtrl.create({
      title: 'LOGOUT',
      message: 'Are you sure you want to logout?',
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
              this.logOutTask();
            } else {
              this.alertUtils.showAlert("INTERNET CONNECTION", INTERNET_ERR_MSG, "OK");
            }
          }
        }
      ]
    });
    alert.present();
  }

  logOutTask() {
    try {
      this.alertUtils.setLoginState(false);
      this.alertUtils.cacheInfo("", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");
      this.alertUtils.cacheUserInfo("");
      this.alertUtils.showToast("You have successfully logout");
      this.appCtrl.getRootNav().setRoot(WelcomePage);
    } catch (e) {
      this.alertUtils.showLog(e);
      this.alertUtils.showToast("Unable to logout please try again");
    }
  }
}
