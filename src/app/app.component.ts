import { Component, ViewChild } from "@angular/core";
import { AlertController, Nav, Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { WelcomePage } from "../pages/WelcomePage/Welcome";
import { APP_TYPE, APP_USER_TYPE, Utils, IS_WEBSITE } from "./services/Utils";
import { Push, PushObject, PushOptions } from "@ionic-native/push";
import { AboutPage } from "../pages/MyOrders/about";
import { NotificationPage } from "../pages/NotificationTemplate/NotificationPage";
// import {HomePage} from "../pages/PlaceAnOrder/home";
import { ContactPage } from "../pages/MyAccount/contact";
import { TranslateService } from "@ngx-translate/core";
import { GetService } from "./services/get.servie";
import { Login } from "../pages/LoginIn/Login";
import { MapView } from "../pages/MapView/MapView";
import { Subject } from 'rxjs/Subject';
import { ServiceArea } from "./services/servicearea";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  showProgress: boolean = true;
  pages: Array<{ title: string, component: any, icon: string }>;
  activePage: any;
  private isNotification: boolean = false;
  sliderName: string = 'Hi User';
  buildVersion: string = "v1";

  constructor(private apiService: GetService, private translateService: TranslateService,
    private platform: Platform, statusBar: StatusBar, public splashScreen: SplashScreen, public push: Push,
    private alertCtrl: AlertController, private serviceArea: ServiceArea,private alertUtils: Utils) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      translateService.setDefaultLang('en');
      translateService.use('en');
      statusBar.styleDefault();
      this.alertUtils.getUserInfo().then(info => {
        if (info) {
          Utils.USER_INFO_DATA = info;
          this.alertUtils.sliderName = Utils.USER_INFO_DATA.first_name;
          this.sliderName = this.alertUtils.sliderName;
        }
      }, err => {
        Utils.sLog(err);
      });

      this.alertUtils.getVersionCode().then(code => {
        this.alertUtils.getVersionNumber().then(num => {
          this.buildVersion = num + "-" + code;
        }).catch(err => {
          this.alertUtils.showLog(err)
        });
      }).catch(err => {
        this.alertUtils.showLog(err)
      });

      this.initPushNotification();

      if (IS_WEBSITE) {
       // this.sliderName = Utils.USER_INFO_DATA.first_name;
      }

    });
    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: MapView, icon: "md-home" },
      { title: 'My Orders', component: AboutPage, icon: 'md-reorder' },
      { title: 'My Rides', component: 'MyridesPage', icon: 'md-albums' },
      // {title: 'Packages', component: 'CategoryServicesPage', icon: 'md-calendar'},
      { title: 'My Account', component: ContactPage, icon: 'md-contact' }

    ];

  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
    this.activePage = page;
    // if(page.title == 'Home'){
    //   this.serviceArea.fetchServiceAreas();
    // }
  }

  checkActive(p) {
    return p == this.activePage;
  }

  initPushNotification() {
    this.alertUtils.showLog("initPushNotification");
    try {
      if (!this.platform.is('cordova')) {
        this.showProgress = false;
        this.rootPage = WelcomePage;
        this.alertUtils.showLog('Push notifications not initialized. Cordova is not available - Run in physical device');
        return;
      }
      const options: PushOptions = {
        android: {
          senderID: '530358294125',
          sound: true,
          forceShow: true
        },
        ios: {
          alert: 'true',
          badge: false,
          sound: 'true'
        },
        windows: {},
        browser: {
          pushServiceURL: 'http://push.api.phonegap.com/v1/push'
        }
      };
      const pushObject: PushObject = this.push.init(options);

      pushObject.on('registration').subscribe((data: any) => {
        this.alertUtils.showLog('device token -> ' + data.registrationId);
        this.alertUtils.saveGcmId(data.registrationId);
      });
      pushObject.on('notification').subscribe((notification: any) => {
        this.alertUtils.showLog('Received a notification');
        this.isNotification = true;
        this.alertUtils.updateStaticValue();
        this.alertUtils.getLoginState().then(value => {
          if (value) {
            this.showProgress = false;
            this.splashScreen.hide();
            this.alertUtils.showLog(this.isNotification);
            let data = JSON.stringify(notification);
            this.alertUtils.showLog(data);
            if (notification.additionalData.foreground) {
              // if application open, show popup
              // let confirmAlert = this.alertCtrl.create({
              //   title: 'New Notification',
              //   message: data,
              //   buttons: [{
              //     text: 'OK',
              //     handler: () => {
              //       Utils.sLog(JSON.stringify(data));
              //     }
              //   }]
              // });
              // confirmAlert.present();
            } else {
              this.alertUtils.showLog('Push notification clicked');
              //if user NOT using app and push notification comes
              if (notification.additionalData.status == "createmessage") {
                if (notification.additionalData.obj.message.order.orderid) {
                  this.nav.push('OrderDetails', {
                    callfrom: "pushnotification",
                    orderid: notification.additionalData.obj.message.order.orderid
                  }).then(res => {
                    this.updateNotificationStatus(notification);
                  });
                } else {
                  this.nav.push(AboutPage, { callfrom: "pushnotification" }).then(res => {
                    this.updateNotificationStatus(notification);
                  });
                }
              } else if (notification.additionalData.status == "ordered") {
                this.nav.push(AboutPage, { callfrom: "pushnotification" }).then(res => {
                  this.updateNotificationStatus(notification);
                });
              } else if (notification.additionalData.status == "delivered") {
                this.nav.push(AboutPage, { callfrom: "pushnotification" }).then(res => {
                  this.updateNotificationStatus(notification);
                });
              } else if (notification.additionalData.status == "doorlock") {
                this.nav.push(AboutPage, { callfrom: "pushnotification" }).then(res => {
                  this.updateNotificationStatus(notification);
                });
              } else if (notification.additionalData.status == "rejected") {
                this.nav.push(AboutPage, { callfrom: "pushnotification" }).then(res => {
                  this.updateNotificationStatus(notification);
                });
              } else if (notification.additionalData.status == "not_reachable") {
                this.nav.push(AboutPage, { callfrom: "pushnotification" }).then(res => {
                  this.updateNotificationStatus(notification);
                });
              } else if (notification.additionalData.status == "cannot_deliver") {
                this.nav.push(AboutPage, { callfrom: "pushnotification" }).then(res => {
                  this.updateNotificationStatus(notification);
                });
              } else if (notification.additionalData.status == "confirm") {
                this.nav.push('MyPaymentPage', { callfrom: "pushnotification" }).then(res => {
                  this.updateNotificationStatus(notification);
                });
              } else if (notification.additionalData.status == "orderupdated") {
                this.nav.push(AboutPage, { callfrom: "pushnotification" }).then(res => {
                  this.updateNotificationStatus(notification);
                });
              } else if (notification.additionalData.status == "assigned") {
                this.nav.push(AboutPage, { callfrom: "pushnotification" }).then(res => {
                  this.updateNotificationStatus(notification);
                });
              } else if (notification.additionalData.status == "notification") {
                this.nav.push(NotificationPage, {
                  callfrom: "pushnotification",
                  data: notification
                }).then(res => {
                  this.updateNotificationStatus(notification);
                });
              } else {
                if (notification.additionalData.redirectpage == "AboutPage") {
                  this.nav.push(AboutPage, { callfrom: "pushnotification" }).then(res => {
                    this.updateNotificationStatus(notification);
                  });
                } else if (notification.additionalData.redirectpage == "HomePage") {
                  this.nav.push(MapView, { callfrom: "pushnotification" }).then(res => {
                    this.updateNotificationStatus(notification);
                  });
                } else if (notification.additionalData.redirectpage == "ContactPage") {
                  this.nav.push(ContactPage, { callfrom: "pushnotification" }).then(res => {
                    this.updateNotificationStatus(notification);
                  });
                } else if (notification.additionalData.redirectpage == "OrderDetails") {
                  this.nav.push('OrderDetails', {
                    callfrom: "pushnotification",
                    orderid: notification.additionalData.obj.message.order.orderid
                  }).then(res => {
                    this.updateNotificationStatus(notification);
                  });
                } else {
                  this.showProgress = false;
                  this.rootPage = WelcomePage;
                }
              }
            }
          } else {
            this.splashScreen.hide();
            this.showProgress = false;
            this.rootPage = Login;
          }
        }).catch(reason => {
          this.splashScreen.hide();
          this.showProgress = false;
          this.rootPage = Login;
        });
      }, error2 => {
        this.splashScreen.hide();
        this.showProgress = false;
        this.rootPage = WelcomePage;
      }
      );
      pushObject.on('error').subscribe(error => this.alertUtils.showLog('Error with Push plugin' + error));

      this.alertUtils.showLog('before setTimeout');
      setTimeout(() => {
        this.alertUtils.showLog('END');
        this.alertUtils.showLog(this.isNotification);
        if (!this.isNotification) {
          this.splashScreen.hide();
          this.showProgress = false;
          this.rootPage = WelcomePage;
        }
      }, 1000);
    } catch (e) {
      this.showProgress = false;
      this.rootPage = WelcomePage;
      this.alertUtils.showLog("CATCH BLOCK");
      this.alertUtils.showLog(JSON.stringify(e));
    }
  }

  updateNotificationStatus(notification) {
    try {
      let input = {
        "User": {
          "transtype": "updatenotificationstatus",
          "apptype": APP_TYPE,
          "user_type": APP_USER_TYPE
        }
      };
      if (Utils.APP_USER_ID) {
        input["customerid"] = Utils.APP_USER_ID;
        input["createdby"] = Utils.APP_USER_ID;
      }
      if (Utils.APP_USER_DEALERID) {
        input["dealerid"] = Utils.APP_USER_DEALERID;
      }
      if (notification && notification.additionalData && notification.additionalData.obj && notification.additionalData.obj.title) {
        input["notificationtag"] = notification.additionalData.obj.title;
      }
      if (notification && notification.additionalData && notification.additionalData.obj && notification.additionalData.obj.type) {
        input["notificationtype"] = notification.additionalData.obj.type;
      }
      if (notification && notification.additionalData && notification.additionalData.obj && notification.additionalData.obj.notifyuniqueid) {
        input["notifyuniqueid"] = notification.additionalData.obj.notifyuniqueid;
      }
      if (this.alertUtils.getDeviceUUID()) {
        input["useruniqueid"] = this.alertUtils.getDeviceUUID();
      }
      let data = JSON.stringify(input);
      this.alertUtils.showLog(data);
      this.apiService.postReq(GetService.notificationResponse(), data).then(response => {
        if (response)
          this.alertUtils.showLog(response);
      }, err => {
        this.alertUtils.showLog(err);
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }

  }
}
