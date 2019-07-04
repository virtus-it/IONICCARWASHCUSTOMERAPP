import { Component } from "@angular/core";
import { APP_TYPE, APP_USER_TYPE, RES_SUCCESS, Utils, INTERNET_ERR_MSG, IS_WEBSITE } from "../../app/services/Utils";
import { GetService } from "../../app/services/get.servie";
import { AlertController, IonicPage, ModalController } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";
@IonicPage()
@Component({
  templateUrl: 'Feedback.html',
  selector: 'feedback-style'
})
export class Feedback {

  items: any;
  tabBarElement: any;
  private loginStatus: boolean = false;
  private dealerID = "";
  private userID = "";
  private showProgress = false;
  private noRecords = false;

  constructor(private translateService: TranslateService, private alertUtils: Utils, private getService: GetService, private alertCtrl: AlertController, public modalCtrl: ModalController) {
    let lang = "en";
    if (Utils.lang) {
      lang = Utils.lang
    }
    Utils.sLog(lang);
    translateService.use(lang);

    if (IS_WEBSITE) {
      this.userID = Utils.USER_INFO_DATA.userid;
      this.dealerID = Utils.USER_INFO_DATA.superdealerid;
      this.feedback(true, false, "");
    }



  }


  ngOnInit() {
    this.alertUtils.getLoginState().then(res => {
      if (res) {
        this.loginStatus = res;
        this.alertUtils.getDealerId().then(res => {
          if (res) {
            this.dealerID = res;
            this.alertUtils.getUserId().then(res => {
              if (res) {
                this.userID = res;
                this.feedback(true, false, "");
              }
            })
          }
        });
      }
    }).catch(err => {
      this.alertUtils.showLog(err);
    })

  }

  doRefresh(refresher) {
    this.feedback(false, true, refresher);
    setTimeout(() => {
      refresher.complete();
    }, 30000);
  }


  feedback(isFirst: boolean, isRefresh: boolean, refresher) {
    let input = {
      "root": {
        "userid": this.userID,
        "loginid": this.userID,
        "customerid": this.userID,
        "usertype": APP_USER_TYPE,
        "apptype": APP_TYPE
      }
    };
    let data = JSON.stringify(input);
    if (isFirst)
      this.showProgress = true;
    this.getService.postReq(this.getService.getFeedback(), data).then(res => {
      if (isFirst)
        this.showProgress = false;
      if (isRefresh)
        refresher.complete();
      this.alertUtils.showLog(res);
      if (res.result == RES_SUCCESS) {
        this.noRecords = false;
        if (res.data) {
          this.items = res.data;
          for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].createdby) {
              if (this.items[i].createdby.lastname == null) {
                this.items[i].createdby.lastname = "";
              }
            }
          }
        }
      } else {
        this.noRecords = true;
      }
    }, err => {
      if (isFirst)
        this.showProgress = false;
      if (isRefresh)
        refresher.complete();
      this.alertUtils.showToast(this.alertUtils.INTERNET_ERR_MSG);
      Utils.sLog(err);
    });
  }

  // createFeedback() {
  //   this.showPrompt();
  // }

  showPrompt() {
    let prompt = this.alertCtrl.create({
      // title: 'SEND FEEDBACK',
      // message: "We value your feedback and welcome any comments you may have to help improve our programs and services.",
      // inputs: [
      //   {
      //     name: 'subject',
      //     placeholder: 'Subject'
      //   },
      //
      //   {
      //     name: 'message',
      //     placeholder: 'Message'
      //   },
      // ],
      buttons: [
        // {
        //   text: 'Cancel',
        //   handler: cancel => {
        //   }
        // },
        {
          text: 'Send',
          handler: data => {
            if (data.subject) {
              if (this.alertUtils.validateText(data.subject, "Subject", 3, 50)) {
                if (data.message) {
                  if (this.alertUtils.validateText(data.message, "Message", 3, 250)) {
                    this.createFeedbackTask(data)
                  } else {
                    this.alertUtils.showToast(this.alertUtils.ERROR_MES);
                    return false;
                  }
                } else {
                  this.alertUtils.showToast("Please type Message");
                  return false;
                }
              } else {
                this.alertUtils.showToast(this.alertUtils.ERROR_MES);
                return false;
              }
            } else {
              this.alertUtils.showToast("Please type Subject");
              return false;
            }
          }
        }
      ]
    });
    prompt.present();
  }


  createFeedbackTask(value: any) {
    let input = {
      "root": {
        "issuetype": "Feedback",
        "subject": value.subject,
        "details": value.message,
        "loginid": this.userID,
        "userid": this.dealerID,
        "apptype": APP_TYPE,
        "usertype": APP_USER_TYPE
      }
    };
    let data = JSON.stringify(input);
    this.getService.postReq(this.getService.createFeedback(), data).then(res => {
      this.alertUtils.showLog(res);
      if (res.result == RES_SUCCESS) {
        this.alertUtils.showToast("Message sent successfully ");
        this.feedback(true, false, "");
      } else {
        this.alertUtils.showToast("Message failed ");
      }
    }).catch(error => {
      this.alertUtils.showLog(error)
    });
  }

  replyToFeedBack(value) {
    this.alertUtils.showLog(JSON.stringify(value));
    this.showReplyPrompt(value);
  }

  showReplyPrompt(value) {
    let prompt = this.alertCtrl.create({
      title: 'Send Reply',
      message: "Please write your reply.",
      inputs: [
        {
          name: 'message',
          placeholder: 'Message'

        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Send',
          handler: data => {
            if (data.message) {
              if (this.alertUtils.validateText(data.message, "Message", 3, 250)) {

                this.replyToFeedBackTask(value, data.message);
              } else {
                this.alertUtils.showToast(this.alertUtils.ERROR_MES);
                return false;
              }
            } else {
              this.alertUtils.showToast("Please type Message");
              return false;
            }
          }
        }
      ]
    });
    prompt.present();
  }

  replyToFeedBackTask(value, message) {
    let input = {
      "root": {
        "issueid": value,
        "issuetype": "feedback",
        "loginid": this.userID,
        "userid": this.userID,
        "message": message,
        "apptype": APP_TYPE
      }
    };
    let data = JSON.stringify(input);
    this.alertUtils.showLoading();
    this.getService.postReq(this.getService.createFeedbackReply(), data).then(res => {
      this.alertUtils.hideLoading();
      this.alertUtils.showLog(res);
      if (res.result == "success") {
        if (res.data) {
          this.feedback(true, false, "");
        }
      } else {
      }
    }, err => {
      this.alertUtils.hideLoading();
      this.alertUtils.showLog(err);
    });
  }

  createFeedback() {
    //var modalPage = this.modalCtrl.create('ModalPage');
    // modalPage.present();
    let model = this.modalCtrl.create('ModalPage', [], {
      showBackdrop: true,
      enableBackdropDismiss: true,
      cssClass: 'editFeedback'
    });
    model.present();
    model.onDidDismiss(data => {
      if (data) {
        this.alertUtils.showLog(data);
        if (this.alertUtils.networkStatus()) {
          this.feedback(true, false, "");
        } else {
          this.alertUtils.showAlert("INTERNET CONNECTION", INTERNET_ERR_MSG, "OK");
        }
      }
    });
  }


}
