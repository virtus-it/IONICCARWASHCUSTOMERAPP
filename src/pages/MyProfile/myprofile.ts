import { Component, ChangeDetectorRef } from "@angular/core";
import { APP_TYPE, APP_USER_TYPE, INTERNET_ERR_MSG, RES_SUCCESS, Utils, VALIDATE_EMAIL, IS_WEBSITE, TRY_AGAIN_ERR_MSG } from "../../app/services/Utils";
import { GetService } from "../../app/services/get.servie";
import { AlertController, NavController, NavParams, IonicPage } from "ionic-angular";
import { Diagnostic } from "@ionic-native/diagnostic";
import { TranslateService } from "@ngx-translate/core";

@IonicPage()
@Component({
  templateUrl: 'myprofile.html',
  selector: 'profile-page'
})
export class MyProfile {

  tabBarElement: any;
  private items: any;
  private defpng = ".png";
  private imgURl = "";
  private imageUrl = "";
  private userPassword = "";
  private isEdit: boolean = false;
  private dealerID = "";
  private userID = "";
  private lat: any;
  private lng: any;

  constructor(private translateService: TranslateService, private ref: ChangeDetectorRef, private diagnostic: Diagnostic, private navCtrl: NavController, private navParam: NavParams, private alertUtils: Utils, private getService: GetService, private alertCtrl: AlertController) {
    let lang = "en";
    if (Utils.lang) {
      lang = Utils.lang
    }
    Utils.sLog(lang);
    translateService.use(lang);
    this.imgURl = getService.getImg();
    if (this.items) {
      this.alertUtils.showLog(this.items);
      this.imageUrl = this.imgURl + this.items.user.imageurl + this.defpng;
    }

    if(IS_WEBSITE){
      this.userID = Utils.USER_INFO_DATA.userid;
      this.fetchProfile();
    }



  }



  goBack() {
    // if (!this.isEdit) {
    //   this.isEdit = true;
    // } else {
      this.navCtrl.pop();
    // }
  }

  fetchProfile(){
    try {
      
      this.getService.getReq(this.getService.fetchUserInfo() + Utils.USER_INFO_DATA.userid + "/" + APP_TYPE).then(res => {
        this.alertUtils.showLog(res);
        if (res.result == RES_SUCCESS) {
          if (res.data) {
            this.items = res.data;
          }
        } else {
          this.alertUtils.showToast(TRY_AGAIN_ERR_MSG);
        }
      }, err => {
        this.alertUtils.showToast(this.alertUtils.INTERNET_ERR_MSG);
        this.alertUtils.hideLoading();
        Utils.sLog(err);
      });
    } catch (error) {
      this.alertUtils.showLog(error);
    }
  }

  ngOnInit() {
    try {
      this.alertUtils.getDealerId().then(res => {
        if (res) {
          this.dealerID = res;
          this.alertUtils.getUserId().then(res => {
            if (res) {
              this.userID = res;
            }
          });
          this.alertUtils.getUserInfo().then(value => {
            if (value) {
              Utils.USER_INFO_DATA = value;
              this.alertUtils.showLog(JSON.stringify(Utils.USER_INFO_DATA));
              this.alertUtils.showLog("userinfo updated");
              this.fetchProfile();
            }
          });
        }


      }).catch(err => {
        this.alertUtils.showLog(err);
      });

      setTimeout(() => {
        if (this.items) {
          this.alertUtils.showLog("userinfo called");
          this.alertUtils.setUserAddr(this.items.user.address);
          if (Utils.USER_INFO_DATA) {
            Utils.USER_INFO_DATA.locality = this.items.user.locality;
            Utils.USER_INFO_DATA.buildingname = this.items.user.buildingname;
            this.alertUtils.cacheUserInfo(Utils.USER_INFO_DATA);
          }
        }
      }, 1000)
    } catch (e) {
      this.alertUtils.showLog(e);
    }

  }


  cansInMinus(can) {
    let msg = "";
    if (can > 1)
      msg = "Your " + can + " cans pending with dealer";
    else
      msg = "Your " + can + " can pending with dealer";
    this.alertUtils.showAlert("INFO", msg, "OK");
  }

  changePassword() {
    try {
      this.alertUtils.getUserpd().then(value => {
        this.userPassword = value;
      }, err => {
        this.alertUtils.showLog(err);
      });
      this.showPromptForPwd()
    } catch (error) {
      this.alertUtils.showLog(error);
    }

  }

  showPromptForPwd() {
    let prompt = this.alertCtrl.create({
      title: 'Update Password',
      inputs: [
        {
          name: 'currentPwd',
          placeholder: 'Current password',
          type: 'password'
        },
        {
          name: 'newPwd',
          placeholder: 'New password',
          type: 'password'
        },
        {
          name: 'confirmPwd',
          placeholder: 'Confirm password',
          type: 'password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Update',
          handler: data => {
            if (data.currentPwd) {
              if (this.alertUtils.validateText(data.currentPwd, "Current password", 5, 20)) {
                if (data.newPwd) {
                  if (this.alertUtils.validateText(data.newPwd, "New password", 5, 20)) {
                    if (data.confirmPwd) {
                      if (this.alertUtils.validateText(data.confirmPwd, "Confirm password", 5, 20)) {
                        if (data.confirmPwd == data.newPwd) {
                          if (data.currentPwd == this.userPassword) {
                            this.updatePassword(data);
                          } else {
                            this.alertUtils.showToast("Current password invalid");
                            return false;
                          }
                        } else {
                          this.alertUtils.showToast("New password and confirm password doesn't match");
                          return false;
                        }
                      } else {
                        this.alertUtils.showToast(this.alertUtils.ERROR_MES);
                        return false;
                      }
                    } else {
                      this.alertUtils.showToast("Please enter confirm password");
                      return false;
                    }
                  } else {
                    this.alertUtils.showToast(this.alertUtils.ERROR_MES);
                    return false;
                  }
                } else {
                  this.alertUtils.showToast("Please enter new password");
                  return false;
                }
              } else {
                this.alertUtils.showToast(this.alertUtils.ERROR_MES);
                return false;
              }
            } else {
              this.alertUtils.showToast("Please enter current password");
              return false;
            }

          }
        }
      ]
    });
    prompt.present();
  }

  updatePassword(data) {
    let input = {
      "User": {
        "userid": this.userID,
        "user_type": APP_USER_TYPE,
        "oldpwd": this.userPassword,
        "pwd": data.confirmPwd,
        "apptype": APP_TYPE
      }
    };
    let inputData = JSON.stringify(input);
    this.alertUtils.showLoading();
    this.getService.putReq(this.getService.updateUser(), inputData).then(res => {
      this.alertUtils.hideLoading();
      this.alertUtils.showLog(res);
      if (res.result == this.alertUtils.RESULT_SUCCESS) {
        this.alertUtils.setUserpd(this.userPassword);
        this.alertUtils.showToast("Password updated successfully ");
      } else {
        this.alertUtils.showToast("Request failed ");
      }
    }).catch(error => {
      this.alertUtils.hideLoading();
      this.alertUtils.showLog(error)
    });
  }


  getAddress() {
    // this.diagnostic.isLocationEnabled().then(enable => {
    //   if (enable) {
    //     this.navCtrl.push(MapView, {
    //       from: "myprofile"
    //     });
    //   } else {
    //     this.alertUtils.dialogForLocationSetting("LOCATION", "Your GPS seems to be disabled, please enable it", "OK");
    //   }
    // }, reason => {
    //   this.alertUtils.showAlert("LOCATION ERROR", reason.toString(), "OK");
    // });
  }

  ionViewWillEnter() {
    try {
      let myGetPageRes = this.navParam.get('myDataKey') || null;
      if (myGetPageRes) {
        if (myGetPageRes.from == "mapview") {
          this.items.user.address = myGetPageRes.address;
          this.lat = myGetPageRes.lat;
          this.lng = myGetPageRes.lng;
          if (this.alertUtils.getAddrData()) {
            let addrData = this.alertUtils.getAddrData();
            this.alertUtils.showLog(addrData);
            if (addrData) {
              if (addrData.landmark) {
                this.items.user.locality = addrData.landmark;
              }
              if (addrData.buildingname) {
                this.items.user.buildingname = addrData.buildingname;
              }
              this.ref.detectChanges();
            }
          }
        }
      }

    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  updateProfile() {
    if (this.items.user.firstname) {
      if (this.alertUtils.validateText(this.items.user.firstname, "First Name", 2, 100)) {
        if (this.items.user.lastname) {
          if (this.alertUtils.validateText(this.items.user.lastname, "Last Name", 1, 100)) {
            if (this.items.user.locality) {
              if (this.alertUtils.validateText(this.items.user.locality, "Landmark", 3, 100)) {
                if (this.items.user.buildingname) {
                  if (this.alertUtils.validateText(this.items.user.buildingname, "Flat Number", 3, 100)) {
                    if (this.items.user.address) {
                      if (this.alertUtils.validateText(this.items.user.address, "Address", 2, 500)) {
                        if (this.items.user.emailid) {
                          if (VALIDATE_EMAIL.test(this.items.user.emailid)) {
                            if (this.items.user.emailid.indexOf("'") == -1) {
                              if (this.alertUtils.networkStatus()) {
                                this.doUpdateProfile();
                              } else {
                                this.alertUtils.showAlert("INTERNET CONNECTION", INTERNET_ERR_MSG, "OK");
                              }
                            } else {
                              this.alertUtils.showToast("Single coat not allowed in email");
                              return false;
                            }
                          } else {
                            this.alertUtils.showToast("Invalid email");
                            return false;
                          }
                        } else {
                          this.alertUtils.showToast("Please enter email");
                          return false;
                        }
                      } else {
                        this.alertUtils.showToast(this.alertUtils.ERROR_MES);
                        return false;
                      }
                    } else {
                      this.alertUtils.showToast("Please enter address");
                      return false;
                    }
                  } else {
                    this.alertUtils.showToast(this.alertUtils.ERROR_MES);
                    return false;
                  }
                } else {
                  this.alertUtils.showToast("Please enter flat number");
                  return false;
                }
              } else {
                this.alertUtils.showToast(this.alertUtils.ERROR_MES);
                return false;
              }
            } else {
              this.alertUtils.showToast("Please enter landmark");
              return false;
            }
          } else {
            this.alertUtils.showToast(this.alertUtils.ERROR_MES);
            return false;
          }
        } else {
          this.alertUtils.showToast("Please enter last name");
          return false;
        }
      } else {
        this.alertUtils.showToast(this.alertUtils.ERROR_MES);
        return false;
      }
    } else {
      this.alertUtils.showToast("Please enter first name");
      return false;
    }
  }

  editProfile() {
    // if (this.isEdit) {
    //   this.isEdit = false;
    // } else {
    //   this.isEdit = true;
    // }
  }

  doUpdateProfile() {
    let input = {
      "User": {
        "userid": this.userID,
        "user_type": APP_USER_TYPE,
        "firstname": this.items.user.firstname,
        "lastname": this.items.user.lastname,
        "emailid": this.items.user.emailid,
        "address": this.items.user.address,
        "apptype": APP_TYPE
      }
    };
    if (this.lat) {
      input.User["latitude"] = this.lat;
      input.User["longitude"] = this.lng;
    }
    if (this.items.user.locality) {
      input.User["locality"] = this.items.user.locality;
    }
    if (this.items.user.buildingname) {
      input.User["buildingname"] = this.items.user.buildingname;
    }
    this.alertUtils.showLog(JSON.stringify(input));
    let inputData = JSON.stringify(input);
    this.alertUtils.showLoading();

    this.getService.putReq(this.getService.updateUser(), inputData).then(res => {
      this.alertUtils.hideLoading();
      this.alertUtils.showLog(res);
      if (res.result == RES_SUCCESS) {
        // this.isEdit = true;
        this.alertUtils.showToast("Profile updated successfully");
        this.items.user.firstname = res.data.firstname;
        this.items.user.lastname = res.data.lastname;
        this.items.user.address = res.data.address;
        this.items.user.emailid = res.data.emailid;
        this.alertUtils.setUserAddr(this.items.user.address);
        this.alertUtils.setUserEmailId(this.items.user.emailid);
        this.alertUtils.setUserName(this.items.user.firstname + " " + this.items.user.lastname);
        if (this.lat) {
          this.alertUtils.setUserLatLng(this.lat, this.lng);
          Utils.USER_INFO_DATA.latitude = this.lat;
          Utils.USER_INFO_DATA.longitude = this.lng;
        }

        if (this.items.user.address) {
          Utils.USER_INFO_DATA.address = this.items.user.address;
        }
        if (this.items.user.locality) {
          Utils.USER_INFO_DATA.locality = this.items.user.locality;
        }
        if (this.items.user.buildingname) {
          Utils.USER_INFO_DATA.buildingname = this.items.user.buildingname;
        }
        this.alertUtils.cacheUserInfo(Utils.USER_INFO_DATA);
      } else {
        this.alertUtils.showToast("request failed ");
      }

    }
    ).catch(error => {
      this.alertUtils.hideLoading();
      this.alertUtils.showLog(error)
    });
  }
}
