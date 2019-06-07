import { Component } from "@angular/core";
import { AlertController, App, NavController } from "ionic-angular";
import { AppRate } from "@ionic-native/app-rate";
import { APP_TYPE, INTERNET_ERR_MSG, RES_SUCCESS, TRY_AGAIN_ERR_MSG, Utils } from "../../app/services/Utils";
import { GetService } from "../../app/services/get.servie";
import { WelcomePage } from "../WelcomePage/Welcome";
import { SocialSharing } from "@ionic-native/social-sharing";
import { TranslateService } from "@ngx-translate/core";


@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  languages = [{ name: "English", code: "en" }, { name: "Arabic", code: "ar" }];
  languageSelected: any;
  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public alertUtils: Utils, private getService: GetService, private appRate: AppRate, private appCtrl: App, private socialSharing: SocialSharing, public translate: TranslateService) {}

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

      this.alertUtils.getLang().then(lang => {
        if (lang) {
          this.languageSelected = lang;
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
      this.getService.getReq(this.getService.fetchUserInfo() + Utils.USER_INFO_DATA.userid + "/" + APP_TYPE).then(res => {
        this.alertUtils.hideLoading();
        this.alertUtils.showLog(res);
        if (res.result == RES_SUCCESS) {
          if (res.data) {

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
    this.socialSharing.shareViaWhatsAppToReceiver("+919121642009", "Hi");
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

    try {
      this.appRate.preferences.storeAppURL = {
        android: 'market://details?id=com.washonclick'
      };
      this.appRate.promptForRating(true);
    } catch (e) {
      Utils.sLog(e);
    }
  }


  customerCareDialog() {
    let alert = this.alertCtrl.create({
      title: "Customer Care",
      message: "Our Customer service offers a variety of customer care and customer support options to help you in every possible manner. \n Office timing : 09:00AM - 05:00PM GST \n\n Customer care number : 9121642009",
      buttons: [
        {
          text: "Close",
          handler: () => {
          }
        },
        {
          text: "Call Now",
          handler: () => {
            this.alertUtils.callNumber("9121642009");
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
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Yes',
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
      // this.alertUtils.showToast("You have successfully logout");
      this.appCtrl.getRootNav().setRoot(WelcomePage);
    } catch (e) {
      this.alertUtils.showLog(e);
      this.alertUtils.showToast("Unable to logout please try again");
    }
  }

  setLanguage() {
    console.log(this.languageSelected);
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
}
