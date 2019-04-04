import {Component} from "@angular/core";
import {APP_TYPE, APP_USER_TYPE, GEN_ERR_MSG, INTERNET_ERR_MSG, RES_SUCCESS, Utils} from "../../app/services/Utils";
import {GetService} from "../../app/services/get.servie";
import {AlertController, ModalController, IonicPage} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
  selector: 'page-schedule',
  templateUrl: 'ScheduleOrder.html'
})
export class ScheduleOrderPage {
  tabBarElement: any;
  private loginStatus: boolean = false;
  private dealerID = "";
  private userID = "";
  private items: any;
  private showProgress = false;
  private noRecords = false;

  constructor(private translateService: TranslateService, private alertCtrl: AlertController, private alertUtils: Utils,
              private getService: GetService, private modalCtrl: ModalController) {
    translateService.setDefaultLang('en');
    translateService.use('en');

    // this.userID = "1914";
    // this.dealerID = "289";
    // this.fetchScheduleOrderTask(true, false, "");
   

  }

  ngOnInit() {
    try {
      this.alertUtils.getLoginState().then(res => {
        if (res) {
          this.loginStatus = res;
          this.alertUtils.getDealerId().then(res => {
            if (res) {
              this.dealerID = res;
              this.alertUtils.getUserId().then(res => {
                if (res) {
                  this.userID = res;
                  this.fetchScheduleOrderTask(true, false, "");
                }
              });
            }
          });
        }
      }).catch(err => {
        this.alertUtils.showLog(err);
      })
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  doRefresh(refresh) {
    this.fetchScheduleOrderTask(false, true, refresh);
    setTimeout(() => {
      refresh.complete();
    }, 30000);
  }

  showDeleteOrderAlert(item) {
    let alert = this.alertCtrl.create({
      title: 'DELETE SCHEDULE',
      message: 'Are you sure you want to delete schedule?',
      buttons: [
        {
          text: 'NO',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'YES',
          handler: () => {
            if (this.alertUtils.networkStatus()) {
              this.deleteScheduleOrderTask(item);
            } else {
              this.alertUtils.showAlert("INTERNET CONNECTION", INTERNET_ERR_MSG, "OK");
            }
          }
        }
      ]
    });
    alert.present();
  }

  private fetchScheduleOrderTask(isFirst: boolean, isRefresh: boolean, refresh) {

    try {
      if (isFirst)
        this.showProgress = true;
      this.getService.getReq(this.getService.getSchedules() + this.userID + "/" + APP_TYPE + "/" + APP_USER_TYPE + "/" + this.dealerID).subscribe(res => {
          this.alertUtils.showLog(res);
          this.hideProgress(isFirst, isRefresh, refresh);
          if (res.result == RES_SUCCESS) {
            this.noRecords = false;
            if (res.data) {
              for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].scheduletype) {
                  res.data[i].scheduletype = res.data[i].scheduletype.toLowerCase();
                }
              }
              this.items = res.data;
            }
          } else {
            this.noRecords = true;
          }
        }, err => {
          this.hideProgress(isFirst, isRefresh, refresh);
          this.alertUtils.showToast(this.alertUtils.INTERNET_ERR_MSG);
          this.alertUtils.showLog(err);
        }
      );
    } catch (e) {
      this.hideProgress(isFirst, isRefresh, refresh);
      this.alertUtils.showLog(e);
    }

  }

  hideProgress(isFirst, isRefresh, refresh) {
    if (isFirst)
      this.showProgress = false;
    if (isRefresh)
      refresh.complete();
  }

  private editScheduleOrder(item) {
    try {
      this.alertUtils.showLog('Update Order');
      let modal = this.modalCtrl.create('EditScheduleOrderPage', {
        from: "edit", items: item
      });

      modal.onDidDismiss(data => {
        if (data) {
          this.fetchScheduleOrderTask(true, false, "");
        }
      });
      modal.present();
    } catch (e) {
      this.alertUtils.showLog(e);
    }

  }

  private createSchedule() {
    try {
      this.alertUtils.showLog('Create Order');
      let modal = this.modalCtrl.create('EditScheduleOrderPage', {
        from: "create"
      });
      modal.onDidDismiss(data => {
        if (data) {
          this.fetchScheduleOrderTask(true, false, "");
        }
      });
      modal.present();
    } catch (e) {
      this.alertUtils.showLog(e);
    }

  }

  private deleteScheduleOrder(item) {
    this.showDeleteOrderAlert(item);
  }

  private deleteScheduleOrderTask(item) {
    let input = {
      "product": {
        "scheid": item.id,
        "loginid": this.userID,
        "activate": "false",
        "usertype": APP_USER_TYPE,
        "apptype": APP_TYPE
      }
    };
    let data = JSON.stringify(input);

    this.getService.postReq(this.getService.changeScheduleStatus(), data).then(res => {
      // this.alertUtils.hideLoading();
      if (res.result == RES_SUCCESS) {
        this.alertUtils.showToast("Record successfully deleted");
        this.fetchScheduleOrderTask(true, false, "");
      }
    }, err => this.alertUtils.showToast(GEN_ERR_MSG));
  }

}
