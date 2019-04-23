import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ViewController } from "ionic-angular";
import { Utils, APP_TYPE, APP_USER_TYPE, INTERNET_ERR_MSG, RES_SUCCESS } from "../../app/services/Utils";
import { GetService } from "../../app/services/get.servie";
import { TranslateService } from "@ngx-translate/core";
@IonicPage()
@Component({
  selector: 'page-raise-complain',
  templateUrl: 'raise-complain.html',
})
export class RaiseComplainPage {
  private item: any;
  private userComment: string = "";
  private showSuccess: boolean = false;
  private showProgress: boolean = false;
  private showClose: boolean = false;

  constructor(private translateService: TranslateService, private viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, private apiService: GetService, private alertUtils: Utils) {
    let lang = "en";
    if (Utils.lang) {
      lang = Utils.lang
    }
    console.log(lang);
    // translateService.setDefaultLang(lang);
    translateService.use(lang);

  }

  ionViewDidLoad() {
    this.alertUtils.showLog('ionViewDidLoad RaiseComplainPage');
  }

  ngOnInit() {
    this.item = this.navParams.get('data');
    this.alertUtils.getUserInfo().then(value => {
      if (value) {
        Utils.USER_INFO_DATA = value;
        this.alertUtils.showLog(JSON.stringify(Utils.USER_INFO_DATA));
      }
    }).catch(reason => {
      this.alertUtils.showLog(reason);
    });
  }

  sendComplain() {
    if (this.alertUtils.validateText(this.userComment, "Comments", 3, 450)) {
      if (this.alertUtils.networkStatus()) {
        this.createMessage();
      } else {
        this.alertUtils.showAlert("INTERNET CONNECTION", INTERNET_ERR_MSG, "OK");
      }
    } else {
      this.alertUtils.showToast(this.alertUtils.ERROR_MES);
    }
  }

  closeModal() {
    this.navCtrl.pop();
  }

  createMessage() {
    try {
      this.showProgress = true;
      let input = {
        "order": {
          "orderid": this.item.order_id,
          "customerid": Utils.USER_INFO_DATA.userid,
          "usertype": APP_USER_TYPE,
          "orderstatus": "Message",
          "reason": this.userComment,
          "ispublic": "2",
          "loginid": Utils.USER_INFO_DATA.userid,
          "apptype": APP_TYPE
        }
      };
      this.alertUtils.showLog(JSON.stringify(input));
      let data = JSON.stringify(input);
      this.apiService.postReq(this.apiService.createMessageOnOrder(), data).then(res => {
        this.showProgress = false;
        this.alertUtils.showLog(res);
        if (res.result == RES_SUCCESS) {
          this.showSuccess = true;
          this.showClose = true;
          this.userComment = "";
          // setTimeout(() => {
          //   this.closeModal();
          // }, 5000)
        } else {
          this.alertUtils.showToast("Message failed ");
        }
      }).catch(error => {
        this.showProgress = false;
        this.alertUtils.showLog(error)
      });
    } catch (e) {
      this.showProgress = false;
      this.alertUtils.showLog(e);
    }
  }

}
