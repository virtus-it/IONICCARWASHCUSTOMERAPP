import { Component, ChangeDetectorRef } from "@angular/core";
import { AlertController, NavController, NavParams } from "ionic-angular";
import {
  APP_TYPE,
  APP_USER_TYPE,
  FRAMEWORK,
  INTERNET_ERR_MSG,
  MOBILE_TYPE,
  RES_SUCCESS,
  TRY_AGAIN_ERR_MSG,
  Utils
} from "../../app/services/Utils";
import { GetService } from "../../app/services/get.servie";
import { MapView } from "../MapView/MapView";
import { ServiceArea } from "../../app/services/servicearea";

@Component({
  selector: 'signup-page',
  templateUrl: 'signup.html'
})
export class SignUp {
  private proddata: any;
  action: any;
  signClass: "login_active";
  errorText: string = "";
  public type = 'password';
  public showPass = false;
  private items: any;
  private info: any;
  private deliveryAddr: string;
  private deliveryTime: string;
  private userName: any;
  private mobileNumber: any;
  private userRegisterType = "Residential";
  private password: String = "";
  private showButtonRegistered: boolean = true;
  private showPasswordBox: boolean = false;
  private disableMobileNo: boolean = true;
  private disableUserName: boolean = true;
  private showPasswordBoxMsg: boolean = false;
  private doingLogin = false;
  private showButtonLogInForSignUp = false;
  private showButtonLogInForSignIn = false;
  private titleText = "SIGN UP";
  private switchLogin = true;
  private totalAmt = "";
  private totalItems = "";
  private isExisting = false;
  private exMobileno = "";
  private exUserInfo: any;
  private latitude: any;
  private longitude: any;
  private userLatlng: any;
  private userAddr: any;
  private referCode: string = "";
  private verCode: any;
  private selectProducts = [];
  private tgPwd: boolean = false;
  private cbTerms: boolean = false;
  private timer;
  private maxTime = 30;
  private addrData: any;
  country: string = "AED";

  constructor(private alertCtrl: AlertController, public navCtrl: NavController, public param: NavParams,private serviceArea: ServiceArea, public alertUtils: Utils, private apiService: GetService, private ref: ChangeDetectorRef) {

  }

  ngOnInit() {
    try {
      this.exMobileno = this.param.get("isExMobileNo");
      this.totalAmt = this.param.get("totalAmount");
      this.totalItems = this.param.get("totalItems");
      this.isExisting = this.param.get("isExisting");
      this.exUserInfo = this.param.get("exUserInfo");
      this.userAddr = this.param.get("userAddr");
      this.userLatlng = this.param.get("userLatlng");
      this.items = this.param.get("item");
      this.referCode = this.param.get("referCode");
      this.proddata = this.param.get("savingobj");

      if (this.items) {
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].selectedCount) {
            if (parseInt(this.items[i].selectedCount) > 0) {
              this.items[i].count = parseInt(this.items[i].selectedCount);
              this.items[i]["productselected"] = true;
              this.selectProducts.push(this.items[i]);
            } else {
              this.items[i]["productselected"] = false;
            }
          }
        }
      }
      Utils.sLog(this.exUserInfo);
      if (this.exUserInfo) {
        if (this.exUserInfo.lastname)
          this.userName = this.exUserInfo.firstname + " " + this.exUserInfo.lastname;
        else
          this.userName = this.exUserInfo.firstname;
      }

      this.mobileNumber = this.exMobileno;

      this.alertUtils.getVersionCode().then(code => {
        this.verCode = code;
      }).catch(err => {
        this.alertUtils.showLog(this.selectProducts);
      });

      this.addrData = this.alertUtils.getAddrData();
      this.alertUtils.showLog(this.addrData);
      this.alertUtils.showLog(this.addrData);

    } catch (err) {
      this.alertUtils.showLog(err);
    }
  }


  StartTimer() {
    this.timer = setTimeout(x => {
      if (this.maxTime <= 0) {
        return;
      }
      this.maxTime -= 1;
      this.StartTimer();

    }, 1000)
  }

  getCounter() {
    this.StartTimer();
  }

  inputMobilecall() {
    if (this.errorText != "")
      this.errorText = "";
  }

  showPassword() {
    this.showPass = !this.showPass;
    if (this.showPass) {
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

  goBack() {
    this.navCtrl.pop();
  }


  SignInAfterSignUp(password) {
    let pwd: string = password;

    if (pwd) {
      let input = {
        "User": {
          "emailid": this.mobileNumber,
          "mobileno": this.mobileNumber,
          "pwd": pwd,
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
      this.alertUtils.showLog(data);
      this.alertUtils.showLoading();

      this.apiService.postReq(this.apiService.login(), data).then(res => {
        this.alertUtils.hideLoading();
        this.alertUtils.showLog(res);
        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          if (res.data && res.data.user) {
            // try {
            //   Utils.USER_INFO_DATA['userid'] = res.data.user.userid;
            //   Utils.USER_INFO_DATA['superdealerid'] = res.data.user.superdealerid;
            //   this.serviceArea.fetchServiceAreas();
            // } catch (error) {
            //   Utils.sLog(error);
            // }
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
            if (this.info.last_name) {
              if (this.info.first_name)
                userName = this.info.first_name + " " + this.info.last_name;
            }
            else {
              if (this.info.first_name)
                userName = this.info.first_name;
            }
            if (!this.info.email)
              this.info.email = "";

            if (!this.info.imagename)
              this.info.imagename = "";

            this.alertUtils.cacheInfo(this.info.userid, password, this.mobileNumber, this.info.email, APP_USER_TYPE, userName, dealerid, dealermobileno, this.info.imagename, imageVer, this.info.address, this.info.city, this.info.state, this.info.pincode, dealerName, this.info.latitude, this.info.longitude);
            this.alertUtils.setLoginState(true);
            this.alertUtils.sliderName = res.data.user.first_name;
            this.alertUtils.getLoginState().then(res => {
              this.alertUtils.showLog(res);
            }, err => {
              this.alertUtils.showLog(err);
            });
            this.alertUtils.cacheUserInfo(res.data.user);

            this.alertUtils.showToast("You have successfully login");
            this.showConfirmOrderDialog(true);
          } else {
            this.alertUtils.showAlert("ERROR", JSON.stringify(res), "OK");
          }
        } else {
          this.errorText = "Invalid password";
        }
      }, err => {
        this.alertUtils.hideLoading();
        Utils.sLog(err);
      });

    } else {
      this.alertUtils.showToast("Password required");
    }

  }

  SignIn(password) {

    let mobMin = 9;
    let mobMax = 9;
    try {
      if (this.alertUtils.validateNumber(this.mobileNumber, "Mobile Number", mobMin, mobMax)) {
        // if (!this.alertUtils.isValidMobile(this.mobileNumber)) {
        if (this.alertUtils.validateText(password, "Password", 3, 20)) {
          let input = {
            "User": {
              "emailid": this.mobileNumber,
              "mobileno": this.mobileNumber,
              "pwd": password,
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
          this.alertUtils.showLog(data);
          this.alertUtils.showLoading();
          this.apiService.postReq(this.apiService.login(), data).then(res => {
            this.alertUtils.hideLoading();
            this.alertUtils.showLog(res);
            if (res.result == this.alertUtils.RESULT_SUCCESS) {
              if (res.data && res.data.user) {
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
                if (this.info.last_name) {
                  if (this.info.first_name)
                    userName = this.info.first_name + " " + this.info.last_name;
                } else {
                  if (this.info.first_name)
                    userName = this.info.first_name;
                }
                if (!this.info.email)
                  this.info.email = "";

                if (!this.info.imagename)
                  this.info.imagename = "";

                this.alertUtils.setLoginState(true);
                this.alertUtils.cacheInfo(this.info.userid, password, this.mobileNumber, this.info.email, APP_USER_TYPE, userName, dealerid, dealermobileno, this.info.imagename, imageVer, this.info.address, this.info.city, this.info.state, this.info.pincode, dealerName, this.info.latitude, this.info.longitude);
                this.alertUtils.cacheUserInfo(res.data.user);
                this.showConfirmOrderDialog(false);
              } else {
                this.alertUtils.showAlert("ERROR", JSON.stringify(res), "OK");
              }
            } else {
              this.errorText = "Invalid Credentials";
            }
          }, err => {
            this.alertUtils.hideLoading();
            Utils.sLog(err);
          });
        } else {
          this.alertUtils.showToast(this.alertUtils.ERROR_MES)
        }
        // } else {
        //   this.alertUtils.showToast("Invalid mobile number");
        // }
      } else {
        this.alertUtils.showToast(this.alertUtils.ERROR_MES)
      }
    } catch (e) {
      this.alertUtils.showLog(e);
      this.alertUtils.showAlert("ERROR", JSON.stringify(e), "OK");
    }
  }

  resendOtp() {
    if (this.mobileNumber) {
      if (this.maxTime == 0) {
        let data = {};
        data['mobileno'] = this.mobileNumber;
        this.alertUtils.showLog(data);
        this.forgotPwdTask(data, true);
      }
    } else {
      this.alertUtils.showToast("Invalid mobile number");
    }
  }

  editMobileNo() {
    this.showButtonRegistered = true;
    this.disableMobileNo = true;
    this.disableUserName = true;
    this.showPasswordBox = false;
    this.showButtonLogInForSignUp = false;
    this.showPasswordBoxMsg = false;
    this.maxTime = 30;

  }

  viewLogin() {
    this.switchLogin = false;
    this.doingLogin = true;
    this.showButtonLogInForSignIn = true;
    this.showButtonLogInForSignUp = false;
    this.showButtonRegistered = false;
    this.disableUserName = false;
    this.showPasswordBoxMsg = false;
    this.disableMobileNo = true;
    this.showPasswordBox = true;
    this.titleText = "LOG IN";
    this.action = "Login";
    this.refreshUI();


  }

  viewSignUp() {
    this.switchLogin = true;
    this.doingLogin = false;
    this.showButtonLogInForSignIn = false;
    this.showButtonLogInForSignUp = false;
    this.showButtonRegistered = true;
    this.disableUserName = true;
    this.disableMobileNo = true;
    this.showPasswordBox = false;
    this.titleText = "SIGN UP";
    this.showPasswordBoxMsg = false;
    this.action = "Signup";
    this.refreshUI();
  }
  refreshUI() {
    this.ref.detectChanges();
  }
  signUp() {
    this.alertUtils.showLog(this.userName);
    this.alertUtils.showLog(this.mobileNumber);
    if (this.userName) {
      if (this.alertUtils.validateText(this.userName, "Name", 3, 100)) {
        let mobMin = 9;
        let mobMax = 9;

        if (this.alertUtils.validateNumber(this.mobileNumber, "Mobile Number", mobMin, mobMax)) {
          // if (!this.alertUtils.isValidMobile(this.mobileNumber)) {
          if (this.cbTerms) {
            if (this.alertUtils.networkStatus()) {
              // if (this.exUserInfo && this.exUserInfo.user_id) {
              //   this.doRegisterExisting();
              // } else {
              this.doRegisterNew();
              // }
            } else {
              this.alertUtils.showAlert("INTERNET CONNECTION", INTERNET_ERR_MSG, "OK");
            }
          } else {
            this.alertUtils.showToast("Please agree to terms");
          }
          // } else {
          //   this.alertUtils.showToast("Invalid mobile number");
          // }
        } else {
          this.alertUtils.showToast(this.alertUtils.ERROR_MES);
        }
      } else {
        this.alertUtils.showToast(this.alertUtils.ERROR_MES);
      }
    } else {
      this.alertUtils.showToast("Please enter your name");
    }

  }


  forgotPwd() {
    this.showPromptForPwd()
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
          max: 9,
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

            if (this.alertUtils.validateNumber(data.mobileno, "Mobile Number", 9, 9)) {
              this.forgotPwdTask(data, false);
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

  forgotPwdTask(data, opt: boolean) {
    try {
      if (this.alertUtils.networkStatus()) {
        this.alertUtils.showLoading();
        this.apiService.getReq(this.apiService.forgotPwd() + data.mobileno).then(res => {
          this.alertUtils.showLog(res);
          this.alertUtils.hideLoading();
          if (res.result == RES_SUCCESS) {
            if (opt) {
              this.alertUtils.showAlert("Success", "OTP sent to your registered phone number", "OK")
            } else {
              this.alertUtils.showAlert("Success", "Password sent to your registered phone number", "OK")
            }
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
        this.alertUtils.showToast("Login success");
      }
    }, err => {
      this.alertUtils.showLog(err);
    })
  }

  showAlert() {
    var mesg = "You have earned " + this.info.pointsdetails.points + " points by sign up on MOYA.Thank you for choosing MOYA - The Water Man !";
    let alert = this.alertCtrl.create({
      title: 'CONGRATULATIONS',
      message: mesg,
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel',
          handler: () => {
            Utils.sLog('Cancel clicked');
          }
        },
        {
          text: 'VIEW DETAILS',
          handler: () => {
            alert.dismiss().then(() => {
              this.navCtrl.push('PointsPage').catch(err => {
                this.alertUtils.showToast(TRY_AGAIN_ERR_MSG);
              })
            })
          }
        }
      ]
    });
    alert.present();
  }

  private showConfirmOrderDialog(isNew: boolean) {
    try {
      this.navCtrl.setRoot(MapView,{ from: "signup" }).then(value => {
        this.setGCMDetails();
        if (this.info.pointsdetails && this.info.pointsdetails.points)
          this.showAlert();
      });

      // if (!this.userLatlng) {
      //   this.userLatlng = {
      //     lat: "",
      //     lng: ""
      //   }
      // }
      // this.navCtrl.push(ConfirmOrder, {
      //   from: "signup",
      //   items: this.selectProducts,
      //   "totalAmount": this.totalAmt,
      //   "totalItems": this.totalItems,
      //   "addr": this.userAddr,
      //   "lat": this.userLatlng.lat,
      //   "lng": this.userLatlng.lng,
      //   "savingobj": this.proddata
      // }).then(value => {
      //   this.setGCMDetails();
      //   if (this.info.pointsdetails && this.info.pointsdetails.points)
      //     this.showAlert();
      // });
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  private doRegisterExisting() {
    if (!this.userLatlng) {
      this.userLatlng = {
        lat: "",
        lng: ""
      }
    }
    let input = {
      "User": {
        "userid": this.exUserInfo.user_id,
        "user_type": APP_USER_TYPE,
        "firstname": this.userName,
        "address": this.userAddr,
        "latitude": this.userLatlng.lat,
        "longitude": this.userLatlng.lng,
        "mobileno": this.mobileNumber,
        "isdistributorcustomerupdate": "1",
        "apptype": APP_TYPE,
        "mobiletype": MOBILE_TYPE,
        "framework": FRAMEWORK
      }
    };
    if (this.verCode) {
      input.User["versionnumber"] = this.verCode;
    }
    if (this.referCode) {
      if (this.referCode != "") {
        input.User["referCode"] = this.referCode;
      }
    }
    if (this.addrData) {
      if (this.addrData.landmark) {
        input.User["locality"] = this.addrData.landmark;
      }
      if (this.addrData.buildingname) {
        input.User["buildingname"] = this.addrData.buildingname;
      }
    }
    if (this.userRegisterType) {
      let registerType: string = "";
      if (this.userRegisterType == "Residential")
        registerType = "residential";
      else if (this.userRegisterType == "Commercial")
        registerType = "commercial";
      else if (this.userRegisterType == "Corporate")
        registerType = "corporate";
      if (registerType)
        input.User["registertype"] = registerType;
    }
    let data = JSON.stringify(input);
    this.alertUtils.showLog(data);
    this.alertUtils.showLoading();
    this.apiService.putReq(this.apiService.updateUser(), data).then(res => {
      this.alertUtils.hideLoading();
      if (res.result == this.alertUtils.RESULT_SUCCESS) {
        this.showButtonRegistered = false;
        this.disableMobileNo = false;
        this.disableUserName = false;
        this.showPasswordBox = true;
        this.showButtonLogInForSignUp = true;
        this.showPasswordBoxMsg = true;
        this.getCounter();
        this.ref.detectChanges();
      } else {
        this.alertUtils.showToast(this.alertUtils.GEN_ERR_MSG);
      }
    }, err => {
      this.alertUtils.hideLoading();
      this.alertUtils.showToast(this.alertUtils.GEN_ERR_MSG);
    });
  }

  private doRegisterNew() {
    if (!this.userLatlng) {
      this.userLatlng = {
        lat: "",
        lng: ""
      };
    }
    let input = {
      "User": {
        "TransType": "create",
        "apptype": APP_TYPE,
        "areaname": "",
        "user_type": APP_USER_TYPE,
        "mobileno": this.mobileNumber,
        "aliasname": this.userName,
        "firstname": this.userName,
        "address": this.userAddr,
        "latitude": this.userLatlng.lat,
        "longitude": this.userLatlng.lng,
        "assigned": "no",
        "mobiletype": MOBILE_TYPE,
        "country": this.country,
        "framework": FRAMEWORK
      }
    };
    if (this.verCode) {
      input.User["versionnumber"] = this.verCode;
    }
    if (this.referCode) {
      if (this.referCode != "") {
        input.User["referCode"] = this.referCode;

      }
    }
    if (this.addrData) {
      if (this.addrData.landmark) {
        input.User["locality"] = this.addrData.landmark;
      }
      if (this.addrData.buildingname) {
        input.User["buildingname"] = this.addrData.buildingname;
      }
    }
    if (this.userRegisterType) {
      let registerType: string = "";
      if (this.userRegisterType == "Residential")
        registerType = "residential";
      else if (this.userRegisterType == "Commercial")
        registerType = "commercial";
      else if (this.userRegisterType == "Corporate")
        registerType = "corporate";
      if (registerType)
        input.User["registertype"] = registerType;
    }
    let data = JSON.stringify(input);
    this.alertUtils.showLog(data);
    this.alertUtils.showLoading();
    this.apiService.postReq(this.apiService.getSignUpUrl(), data).then(res => {
      this.alertUtils.hideLoading();
      this.alertUtils.showLog(res);
      if (res.result == this.alertUtils.RESULT_SUCCESS) {
        if (res.data.code) {
          if (res.data.code == 404) {
            this.alertUtils.showAlert("USER ALREADY EXIST", "Please try to login", "OK")
          }
        } else {
          this.showButtonRegistered = false;
          this.disableMobileNo = false;
          this.disableUserName = false;
          this.showPasswordBox = true;
          this.showButtonLogInForSignUp = true;
          this.showPasswordBoxMsg = true;
          this.getCounter();
          this.ref.detectChanges();
        }
      } else {
        this.alertUtils.showAlert("ERROR", JSON.stringify(res), "OK");
      }
    }, err => {
      this.alertUtils.hideLoading();
      this.alertUtils.showLog(err);
    });

  }


}
