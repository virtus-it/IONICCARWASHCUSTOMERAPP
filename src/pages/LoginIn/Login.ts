import { Component } from "@angular/core";
import { AlertController, NavController, NavParams, ViewController } from "ionic-angular";
import {
  APP_TYPE,
  APP_USER_TYPE,
  FRAMEWORK,
  INTERNET_ERR_MSG,
  MOBILE_TYPE,
  RES_SUCCESS,
  Utils
} from "../../app/services/Utils";
import { GetService } from "../../app/services/get.servie";
import { MapView } from "../MapView/MapView";


@Component({
  selector: 'loginView',
  templateUrl: 'Login.html'
})
export class Login {
  items: any;
  info: any;
  mobileNumber: string;
  password: any;
  cameFrom: string;
  successLogin: boolean;
  showProgress = false;
  showLogin = true;
  public online: boolean = true;
  public type = 'password';
  public showPass = false;
  errorText: string = "";
  private verCode: any;

  constructor(private navCtrl: NavController, private param: NavParams, public alertUtils: Utils, private apiService: GetService, private alertCtrl: AlertController, private viewCtrl: ViewController) {
    this.cameFrom = this.param.get("items");


  }

  ngOnInit() {
    this.alertUtils.getVersionCode().then(code => {
      this.verCode = code;
    }, err => {
      this.alertUtils.showLog(err);
    });

    this.alertUtils.getAppFirstInfo().then(data => {
      if (data) {
        if (data.mobileno) {
          this.alertUtils.showLog(data.mobileno);
          this.mobileNumber = data.mobileno;
        }
      }
    }).catch(reason => {
      this.alertUtils.showLog(reason);
    })
  }

  showPassword() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  inputMobilecall() {
    if (this.errorText != "")
      this.errorText = "";
  }

  ionViewWillLeave() {
    console.log('login view will leave');
    if (this.cameFrom) {
      console.log(this.cameFrom);
      if (this.cameFrom == "orderspage") {
        if (this.successLogin) {
          this.navCtrl.getPrevious().data.myDataKey = "fetchData";
        } else {
          this.navCtrl.getPrevious().data.myDataKey = this.cameFrom;
        }
      } else {
        this.navCtrl.getPrevious().data.myDataKey = this.cameFrom;
      }
    }
  }

  goBack() {
    if (this.navCtrl.length() > 1)
      this.navCtrl.pop();
    else
      this.viewCtrl.dismiss();
  }

  logIn() {
    try {
      if (this.mobileNumber) {
        if (this.alertUtils.validateNumber(this.mobileNumber, "Mobile Number", 9, 10)) {
          // if (!this.alertUtils.isValidMobile(this.mobileNumber)) {
          if (this.password) {
            if (this.password.length > 4 && this.password.length <= 20) {
              let input = {
                "User": {
                  "emailid": this.mobileNumber,
                  "mobileno": this.mobileNumber,
                  "pwd": this.password,
                  "apptype": APP_TYPE,
                  "mobiletype": MOBILE_TYPE,
                  "framework": FRAMEWORK,
                  "user_type": APP_USER_TYPE
                }
              };
              if (this.verCode) {
                input.User["versionnumber"] = this.verCode;
              }
              if (this.alertUtils.getDeviceUUID()) {
                input.User["useruniqueid"] = this.alertUtils.getDeviceUUID();
              }
              let data = JSON.stringify(input);
              if (this.alertUtils.networkStatus()) {
                this.showLogin = false;
                this.showProgress = true;
                this.apiService.postReq(this.apiService.login(), data).then(res => {
                  this.alertUtils.showLog(JSON.stringify(res));
                  if (res.result == this.alertUtils.RESULT_SUCCESS) {
                    if (res.data && res.data.user) {
                      if (res.data.user.USERTYPE == APP_USER_TYPE) {
                        let imageVer = "", dealerName = "", userName = "", dealerid = "", dealermobileno = "";
                        this.info = res.data.user;
                        if (this.info.imgversion)
                          imageVer = this.info.imgversion;
                        else
                          imageVer = "0";
                        if (this.info.dealers) {
                          if (this.info.dealers.lastname && this.info.dealers.firstname)
                            dealerName = this.info.dealers.firstname + " " + this.info.dealers.lastname;
                          else {
                            if (this.info.dealers.firstname) {
                              dealerName = this.info.dealers.firstname;
                            }
                          }
                        }
                        if (this.info.superdealerid) {
                          dealerid = this.info.superdealerid;
                        }
                        if (this.info.dealers && this.info.dealers.mobileno) {
                          dealermobileno = this.info.dealers.mobileno;
                        }
                        if (this.info.last_name)
                          userName = this.info.first_name + " " + this.info.last_name;
                        else
                          userName = this.info.first_name;
                        if (!this.info.email)
                          this.info.email = "";

                        if (!this.info.imagename)
                          this.info.imagename = "";

                        if (!this.info.latitude)
                          this.info.latitude = "";
                        if (!this.info.longitude)
                          this.info.longitude = "";

                        this.alertUtils.setLoginState(true);
                        this.successLogin = true;
                        this.alertUtils.cacheInfo(this.info.userid, this.password, this.mobileNumber, this.info.email, APP_USER_TYPE, userName, dealerid, dealermobileno, this.info.imagename, imageVer, this.info.address, this.info.city, this.info.state, this.info.pincode, dealerName, this.info.latitude, this.info.longitude);
                        this.alertUtils.cacheUserInfo(res.data.user);
                        this.alertUtils.sliderName = res.data.user.first_name;
                        this.navCtrl.setRoot(MapView).then(next => {
                          //const index = this.viewCtrl.index;
                          // then we remove it from the navigation stack
                          //this.navCtrl.remove(index);
                          //this.navCtrl.remove(index - 1);
                          // if (!this.info.latitude && this.info.latitude == "") {
                          //   this.alertUtils.showToast("Please wait");
                          //   this.navCtrl.push(MapView, {
                          //     from: "login"
                          //   });
                          // }
                          this.setGCMDetails();
                        });
                      } else {
                        this.alertUtils.showAlert("Wrong Application", "It's Customer Application\nTry to use ADMIN application", "OK");
                        this.showLogin = true;
                        this.showProgress = false
                      }
                    } else {
                      this.alertUtils.showAlert("ERROR", JSON.stringify(res), "OK");
                    }

                  } else {
                    this.errorText = "Invalid Credentials";
                    this.showLogin = true;
                    this.showProgress = false
                  }
                }, err => {
                  this.showLogin = true;
                  this.showProgress = false
                });
              } else {
                this.alertUtils.showAlert("INTERNET CONNECTION", INTERNET_ERR_MSG, "OK");
              }
            } else
              this.alertUtils.showToast("min 4 max 20 characters allowed in password");
          } else
            this.alertUtils.showToast("Please enter password");
          // } else {
          //   this.alertUtils.showToast("Invalid mobile number");
          // }
        } else {
          this.alertUtils.showToast(this.alertUtils.ERROR_MES);
        }
      } else {
        this.alertUtils.showToast("please enter mobile number");
      }
    } catch (e) {
      this.alertUtils.showLog(e);
    }

  }

  forgotPwd() {
    this.showPromptForPwd()
  }

  setGCMDetails() {
    let registrationId = this.alertUtils.getGcmId();
    let input = {
      "User": {
        "userid": this.info.userid,
        "gcm_mailid": this.info.email,
        "gcm_regid": registrationId,
        "gcm_name": APP_USER_TYPE,
        "mobileno": this.mobileNumber
      }
    };
    let gcmData = JSON.stringify(input);
    this.apiService.postReq(this.apiService.setGCMRegister(), gcmData).then(gcm => {
      if (gcm.result == this.alertUtils.RESULT_SUCCESS) {
        this.alertUtils.showToast("You have successfully logged in");

      } else {
        this.alertUtils.showToast("Could not register device");
      }
    }, err => {
      this.alertUtils.showToast("Could not register device");
      this.alertUtils.showLog(err);
    })
  }

  showPromptForPwd() {
    let prompt = this.alertCtrl.create({
      title: 'FORGOT PASSWORD',
      inputs: [
        {
          name: 'mobileno',
          placeholder: 'Mobile number',
          type: 'tel',
          min: 9,
          max: 10,
          value: this.mobileNumber

        },

      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
          }
        },
        {
          text: 'Submit',
          handler: data => {

            if (this.alertUtils.validateNumber(data.mobileno, "Mobile Number", 10, 10)) {
              if (!this.alertUtils.isValidMobile(data.mobileno)) {
                this.forgotPwdTask(data);

              } else {
                this.alertUtils.showToast("Invalid mobile number");
                return false;
              }
            } else {
              this.alertUtils.showToast(this.alertUtils.ERROR_MES);
              return false;
            }


          }
        }
      ]
    });
    prompt.present();
  }

  forgotPwdTask(data) {

    try {
      if (this.alertUtils.networkStatus()) {
        this.alertUtils.showLoading();
        this.apiService.getReq(this.apiService.forgotPwd() + data.mobileno).then(res => {
          this.alertUtils.showLog(res);
          this.alertUtils.hideLoading();
          if (res.result == RES_SUCCESS) {
            this.alertUtils.showAlert("Success", "Password sent to your registered phone number", "OK")
          } else {
            this.alertUtils.showAlert("Warning", "Phone number not found in database", "OK")
          }
        }, err => {
          this.alertUtils.hideLoading();
          this.alertUtils.showLog(err);
        });
      } else {
        this.alertUtils.showAlert("INTERNET CONNECTION", INTERNET_ERR_MSG, "OK");
      }
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

}
