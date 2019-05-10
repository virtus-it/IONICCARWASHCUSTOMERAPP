import {Component} from "@angular/core";
import {IonicPage, ModalController, NavController, NavParams, ViewController} from "ionic-angular";
import {GetService} from "../../app/services/get.servie";
import {APP_TYPE, APP_USER_TYPE, RES_SUCCESS, Utils} from "../../app/services/Utils";
import { TranslateService } from "@ngx-translate/core";


@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
})
export class ModalPage {
  userType = {subject: "", message: ""};
  validationError = "";


  constructor(private translateService: TranslateService,public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public modalCtrl: ModalController, public getService: GetService, private alertUtils: Utils) {
    let lang = "en";
    if (Utils.lang) {
      lang = Utils.lang
    }
    console.log(lang);
    translateService.use(lang);

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

   next() {
    this.validationError = "";

    if (!this.userType.subject) {
      this.validationError = "the subject";
      return false;
    }
    if (this.userType.subject.length <= 3) {
      this.validationError = "min 4 characters and max 50 characters for subject";
      return false;
    }
    if (!this.userType.message) {
      this.validationError = "the message";
      return false;
    }
    if (this.userType.message.length <= 3) {
      this.validationError = "min 4 characters and max 250 characters for message";
      return false;
    }
    if (this.userType.message.indexOf("'") > -1 || this.userType.message.indexOf("'") > -1) {
      alert("Single Quote(') not allowed in address field ");
      return false;
    }
    Utils.sLog(this.userType.subject + " " + this.userType.message);
    let input = {
      "root": {
        "issuetype": "Feedback",
        "subject": this.userType.subject,
        "details": this.userType.message,
        "loginid": Utils.USER_INFO_DATA.userid,
        "userid": Utils.USER_INFO_DATA.superdealerid,
        "apptype": APP_TYPE,
        "usertype": APP_USER_TYPE
      }
    };
    let data = JSON.stringify(input);
    console.log(data);
    this.getService.postReq(this.getService.createFeedback(), data).then(res => {
      this.alertUtils.showLog(res);
      if (res.result == RES_SUCCESS) {
        this.alertUtils.showToast("Message sent successfully ");
        this.viewCtrl.dismiss(res);
      } else {
        this.alertUtils.showToast("Message failed ");
      }
    }).catch(error => {
      this.alertUtils.showLog(error)
    });
  }

  ngOnInit() {
    this.alertUtils.getUserInfo().then(info => {
      if (info) {
        Utils.USER_INFO_DATA = info;
      }
    }, err => {
      Utils.sLog(err);
    });
  }

}
