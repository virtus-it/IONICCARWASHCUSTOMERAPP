import { Component } from "@angular/core";
import { APP_TYPE, APP_USER_TYPE, RES_SUCCESS, Utils, IS_WEBSITE } from "../../app/services/Utils";
import { GetService } from "../../app/services/get.servie";
import { Contacts } from "@ionic-native/contacts";
import { ModalController, IonicPage } from "ionic-angular";
import { SocialSharing } from "@ionic-native/social-sharing";
import { TranslateService } from "@ngx-translate/core";

@IonicPage()
@Component({
  templateUrl: 'InviteFriends.html',
  selector: 'invitefriend-page'
})
export class InviteFriends {
  referData: any;
  tabBarElement: any;
  private contactList = [];
  private filterList = [];
  private showContactsList: boolean = false;
  private showInvite: boolean = false;
  private name: string = "";
  private customMessage: string = "";
  private mobileNumber: any;
  private isCustomMsg: boolean = false;
  private showProgress: boolean = false;
  private showLoading: boolean = false;



  constructor(private translateService: TranslateService, private socialSharing: SocialSharing, private apiService: GetService, private modalCtrl: ModalController, private alertUtils: Utils, private getService: GetService, private contacts: Contacts) {
    let lang = "en";
    if (Utils.lang) {
      lang = Utils.lang
    }
    console.log(lang);
    translateService.use(lang);


    if (IS_WEBSITE) {
      this.getTempleteTask();
    }


  }

  ngOnInit() {
    this.alertUtils.getLoginState().then(res => {
      if (res) {
        this.alertUtils.getUserInfo().then(info => {
          Utils.USER_INFO_DATA = info;
          this.alertUtils.showLog(Utils.USER_INFO_DATA.userid);
          this.getTempleteTask();

        }).catch(err => {
          this.alertUtils.showLog(err);
        })
      }
    }).catch(err => {
      this.alertUtils.showLog(err);
    });
  }

  showInviteForm() {
    this.showInvite = true;
  }

  getTempleteTask() {

    let data = {
      "User": {
        "transtype": "get",
        "id": Utils.USER_INFO_DATA.userid,
        "apptype": APP_TYPE,
        "usertype": APP_USER_TYPE
      }
    };
    // this.alertUtils.showLoading();
    this.showLoading = true;
    let input = JSON.stringify(data);
    this.apiService.postReq(GetService.getTemplate(), input).then(res => {
      this.showLoading = false;
      this.alertUtils.showLog(res);
      if (res && res.result == RES_SUCCESS) {
        if (res.data) {
          if (res.data.referral_code) {
            this.referData = res.data;
          }
        }
      }
      // this.alertUtils.hideLoading();
    }).catch(err => {
      this.showLoading = false;
      this.alertUtils.showLog(err);
    });
  }

  shareCode() {
    if (this.referData && this.referData.template_desc) {
      this.socialSharing.share(this.referData.template_desc).then(res => {

      }).catch(() => {
        this.alertUtils.showToast("failed")
      });
    } else {
      this.alertUtils.showToast("Invitation Code not available right now, please try again later");
    }
  }

  checkClick() {
    this.customMessage = "Hi " + this.name + " , I d like to invite you to install WashOnClick app !\n\nThanks";
  }

  pickContact(contact) {
    console.log(contact.checked);
  }

  inviteFriend() {
    if (this.showContactsList) {
      // this.contactList = [{ "name": "Abb", "phonenumber": "9863636315", "checked": false }, { "name": "Csl", "phonenumber": "4674651352", "checked": false }, { "name": "Jcgjh", "phonenumber": "5438718555", "checked": false }];
      if (this.filterList.length > 0) {
        this.alertUtils.showLog(this.filterList);
        this.sendInvitaionTaskMulti();
      }
    } else {
      this.singleInvite();
    }
  }

  singleInvite() {
    if (this.name) {
      if (this.alertUtils.validateText(this.name, "Name", 3, 100)) {
        if (this.mobileNumber) {
          if (!this.alertUtils.isValidMobile(this.mobileNumber)) {
            if (this.isCustomMsg) {
              if (this.customMessage) {
                if (this.alertUtils.validateText(this.customMessage, "Custom Message", 3, 250)) {
                  this.sendInvitaionTask();
                } else {
                  this.alertUtils.showToast(this.alertUtils.ERROR_MES);
                }
              } else {
                this.alertUtils.showToast("Please enter custom message");
              }
            } else {
              this.sendInvitaionTask();
            }
          } else
            this.alertUtils.showToast("Invalid Mobile Number");
        } else
          this.alertUtils.showToast("Please enter Mobile Number");

      } else
        this.alertUtils.showToast(this.alertUtils.ERROR_MES);
    } else
      this.alertUtils.showToast("Please enter Name");
  }

  sendInvitaionTaskMulti() {
    let messageType = "predefined";
    if (this.isCustomMsg) {
      messageType = "custom"
    }
    let input = [];
    for (let i = 0; i < this.filterList.length; i++) {
      if (this.filterList[i].checked) {
        let obj = {
          "root": {
            "referto_name": this.contactList[i].name,
            "referto_mobileno": this.contactList[i].phonenumber,
            "message_type": "predefined",
            "message": this.customMessage + " \n https://play.google.com/store/apps/details?id=com.washonclick&hl=en",
            "loginid": Utils.USER_INFO_DATA.userid,
            "apptype": APP_TYPE
          }
        };
        input.push(obj);
      }
    }

    let data = JSON.stringify(input);
    this.alertUtils.showLog(data);
    this.getService.postReq(this.getService.invitefriends(), data).then(res => {
      this.alertUtils.showLog(res);
      if (res.result == this.alertUtils.RESULT_SUCCESS) {
        this.name = "";
        this.mobileNumber = "";
        this.isCustomMsg = false;
        this.customMessage = "";
        this.showContactsList = false;
        this.alertUtils.showToast("Message sent successfully ");
      } else {
        this.alertUtils.showToast("Message failed ");
      }
    }).catch(error => {
      this.alertUtils.showLog(error)
    });
  }

  sendInvitaionTask() {
    let messageType = "predefined";
    if (this.isCustomMsg) {
      messageType = "custom"
    }
    let input = [{
      "root": {
        "referto_name": this.name,
        "referto_mobileno": this.mobileNumber,
        "message_type": "predefined",
        "message": this.customMessage + " \n https://play.google.com/store/apps/details?id=com.washonclick&hl=en",
        "loginid": Utils.USER_INFO_DATA.userid,
        "apptype": APP_TYPE
      }
    }];
    let data = JSON.stringify(input);
    this.alertUtils.showLog(data);
    this.getService.postReq(this.getService.invitefriends(), data).then(res => {
      this.alertUtils.showLog(res);
      if (res.result == this.alertUtils.RESULT_SUCCESS) {
        this.name = "";
        this.mobileNumber = "";
        this.isCustomMsg = false;
        this.customMessage = "";
        this.alertUtils.showToast("Message sent successfully ");
      } else {
        this.alertUtils.showToast("Message failed ");
      }
    }).catch(error => {
      this.alertUtils.showLog(error)
    });
  }

  showFilterDialog() {
    if (this.contactList.length > 0) {
      this.showProgress = false;
      let modal = this.modalCtrl.create('FilterContactsPage', {
        contacts: this.contactList,
        calledfrom: 'invitefriends'
      });
      modal.onDidDismiss(data => {
        if (data) {
          this.filterList = data;
          this.showContactsList = true;
        } else {
          this.showContactsList = false;
        }
      });
      modal.present();
    }
  }

  private importContact() {
    try {
      this.showProgress = true;
      this.contacts.find(['displayName', 'name', 'phoneNumbers', 'emails'], { filter: "", multiple: true })
        .then(data => {
          if (data.length > 0) {
            this.contactList = [];
            this.filterList = [];
            for (let i = 0; i < data.length; i++) {
              let obj = {
                "name": "",
                "phonenumber": "",
                "checked": false
              };
              if (data[i].displayName) {
                obj.name = data[i].displayName;
              }
              if (data[i].phoneNumbers && data[i].phoneNumbers.length > 0) {
                let pickContact = data[i].phoneNumbers[0].value;
                this.alertUtils.showLog(pickContact);
                // pickContact = pickContact.replace(/ /g, '');
                pickContact = pickContact.replace(new RegExp(" ", 'g'), "");
                pickContact = pickContact.replace(new RegExp("-", 'g'), "");
                pickContact = pickContact.replace("(", "");
                pickContact = pickContact.replace(")", "");
                if (pickContact.indexOf("+") != -1) {
                  obj.phonenumber = pickContact.substring(3);
                } else {
                  obj.phonenumber = pickContact;
                }
                this.alertUtils.showLog(pickContact);
              }
              if (obj.phonenumber.length == 10)
                this.contactList.push(obj);
            }
            this.alertUtils.showLog(this.contactList);
            if (this.contactList.length > 0)
              this.showFilterDialog();
            else
              this.alertUtils.showToast("No contacts found");
          }
        }).catch(reason => {
          this.showProgress = false;
          this.alertUtils.showToast(JSON.stringify(reason));
        });
    } catch (e) {
      this.showProgress = false;
    }
  }
}


