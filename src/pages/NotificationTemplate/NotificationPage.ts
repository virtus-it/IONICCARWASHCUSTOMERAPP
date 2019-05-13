import {ChangeDetectorRef, Component} from "@angular/core";
import {App, NavController, NavParams, ViewController} from "ionic-angular";
import {APP_TYPE, APP_USER_TYPE, RES_SUCCESS, Utils} from "../../app/services/Utils";
import {GetService} from "../../app/services/get.servie";
import { MapView } from "../MapView/MapView";
// import {TabsPage} from "../tabs/tabs";

@Component({
  selector: 'notification-my-page',
  templateUrl: 'NotificationPage.html'
})
export class NotificationPage {
  private from: string = "";
  private items: any;
  private userComment: string = "";

  constructor(private ref: ChangeDetectorRef, public appCtrl: App, private apiService: GetService, private alertUtils: Utils, private navCtrl: NavController, private param: NavParams, private viewCtrl: ViewController) {
  }

  ngOnInit() {
    this.alertUtils.updateStaticValue();
    this.from = this.param.get("callfrom");
    this.items = this.param.get("data");
    this.alertUtils.showLog(this.items);
    try {
      if (this.items.additionalData.obj.option && this.items.additionalData.obj.type.toLowerCase() == "checkbox") {
        let checkBoxList = [];
        for (let i = 0; i < this.items.additionalData.obj.option.length; i++) {
          let obj = {
            "title": this.items.additionalData.obj.option[i],
            "value": false
          };
          checkBoxList.push(obj);
        }
        this.items.additionalData.obj["checkoptionlist"] = checkBoxList;
      }
      if (this.items.additionalData.obj.option && this.items.additionalData.obj.type.toLowerCase() == "radio") {
        let radioList = [];
        for (let i = 0; i < this.items.additionalData.obj.option.length; i++) {
          let obj = {
            "title": this.items.additionalData.obj.option[i],
            "value": false
          };
          radioList.push(obj);
        }
        this.items.additionalData.obj["radiooptionlist"] = radioList;
      }
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }


  close() {
    if (this.navCtrl.length() > 1) {
      this.navCtrl.pop();
    } else {
      this.appCtrl.getRootNav().setRoot(MapView, {from: "pushnotification"});
    }
  }


  onChange(item, check) {
    if (check) {
      if (item.value) {
        item.value = false;
      } else {
        item.value = true;
      }
    }
    if (!check) {
      for (let i = 0; i < this.items.additionalData.obj.radiooptionlist.length; i++) {
        if (item.title == this.items.additionalData.obj.radiooptionlist[i].title) {
          if (item.value) {
            item.value = false;
          } else {
            item.value = true;
          }
        } else {
          this.items.additionalData.obj.radiooptionlist[i].value = false;
        }
      }
    }
    this.ref.detectChanges();
  }

  updateResponse(btnclicked) {

    this.alertUtils.showLog(btnclicked);
    this.alertUtils.showLog(this.items.additionalData.obj.radiooptionlist);
    try {
      if (this.items.additionalData.obj.type.toLowerCase() == "playstore") {
        if (btnclicked.actiontype.toLowerCase() == "playstore") {
          this.alertUtils.rateUs();
        } else {
          this.submitResponse(btnclicked.text);
        }
      } else if (this.items.additionalData.obj.type.toLowerCase() == "website") {
        window.open(this.items.additionalData.obj.redirecturl, '_system');
      } else if (this.items.additionalData.obj.type.toLowerCase() == "radio") {
        var obj = this.items.additionalData.obj.radiooptionlist.find(function (obj) {
          return obj.value === true;
        });
        if (obj) {
          this.submitResponse(btnclicked.text);
        } else {
          this.alertUtils.showToast("Please select atleast one option");
        }
      } else if (this.items.additionalData.obj.type.toLowerCase() == "checkbox") {
        var obj = this.items.additionalData.obj.checkoptionlist.find(function (obj) {
          return obj.value === true;
        });
        if (obj) {
          this.submitResponse(btnclicked.text);
        } else {
          this.alertUtils.showToast("Please select atleast one option");
        }
      } else if (this.items.additionalData.obj.type.toLowerCase() == "navigateto") {
        if (this.items.additionalData.obj.navigateto) {
          this.navigateTo(this.items.additionalData.obj.navigateto);
        } else {
          this.submitResponse(btnclicked.text);
        }
      } else {
        this.submitResponse(btnclicked.text);
      }
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  navigateTo(goto: string) {
    if (this.navCtrl.length() > 1) {
      this.navCtrl.push(goto, {from: "notificationpage"}).then(res => {
        this.viewCtrl.dismiss();
      });
    } else {
      let data = {
        from: "notificationpage",
        redirectto: goto,
        isactive: true
      };
      if (goto) {
        Utils.NotificationPageData = data;
      }
      this.appCtrl.getRootNav().setRoot(MapView, {from: "pushnotification"});
    }
  }


  submitResponse(btnclicked) {
    try {
      let input = {
        "User": {
          "customerid": Utils.APP_USER_ID,
          "dealerid": Utils.APP_USER_DEALERID,
          "notificationtag": this.items.additionalData.obj.title,
          "createdby": Utils.APP_USER_ID,
          "userresponse": btnclicked,
          "apptype": APP_TYPE,
          "notificationtype": this.items.additionalData.obj.type,
          "user_type": APP_USER_TYPE
        }
      };
      if (this.userComment) {
        input.User["usercomments"] = this.userComment;
      }
      if (this.items.additionalData.obj.type == "checkbox") {
        input.User["usercheckresponse"] = this.items.additionalData.obj.checkoptionlist;
      }
      if (this.items.additionalData.obj.type == "radio") {
        input.User["usercheckresponse"] = this.items.additionalData.obj.radiooptionlist;
      }
      let data = JSON.stringify(input);
      this.alertUtils.showLog(data);
      this.apiService.postReq(GetService.notificationResponse(), data).then(response => {
        this.alertUtils.showLog(response);
        if (response.result == RES_SUCCESS) {
          this.alertUtils.showToast("Thank you for your response");
          if (this.navCtrl.length() > 1) {
            this.navCtrl.pop();
          } else {
            this.appCtrl.getRootNav().setRoot(MapView, {from: "pushnotification"});
          }
        }
      }, err => {
        this.alertUtils.showLog(err);
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }
}
