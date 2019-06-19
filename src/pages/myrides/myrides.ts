import {ChangeDetectorRef, Component} from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { GetService } from '../../app/services/get.servie';
import { Utils, INTERNET_ERR_MSG, APP_TYPE } from '../../app/services/Utils';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-myrides',
  templateUrl: 'myrides.html',
})
export class MyridesPage {
  items: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertUtils: Utils, private apiService: GetService, private modalCtrl: ModalController, private alertCtrl: AlertController, private translateService: TranslateService,private ref:ChangeDetectorRef) {
    let lang = "en";
    if (Utils.lang) {
      lang = Utils.lang
    }
    console.log(lang);
    translateService.use(lang);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyridesPage');
  }


  ngOnInit() {
    this.fetchRides();
  }

  update(item) {
    let model = this.modalCtrl.create('AddupdateridesPage', { "from": "update", "updateitem": item });
    model.onDidDismiss(data => {
      if (data) {
        this.alertUtils.showLog(data);
        if (this.alertUtils.networkStatus()) {
          this.fetchRides();
        } else {
          this.alertUtils.showAlert("INTERNET CONNECTION", INTERNET_ERR_MSG, "OK");
        }
      }
    });
    model.present();
    this.ref.detectChanges();
  }
  delete(item) {
    console.log(item);

    let alert = this.alertCtrl.create({
      title: 'Warning',
      message: 'Are you sure you want to delete?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            if (this.alertUtils.networkStatus()) {

              this.deleteTask(item);
            } else {
              this.alertUtils.showAlert("INTERNET CONNECTION", INTERNET_ERR_MSG, "OK");
            }
          }
        }
      ]
    });
    alert.present();

  }

  deleteTask(item) {
    let input = { "User": { "id": item.id, "userid": Utils.USER_INFO_DATA.userid, "apptype": APP_TYPE, "TransType": "deleteextrainformation" } };
    this.apiService.postReq(GetService.ride(), JSON.stringify(input)).then(res => {
      console.log(res);
      if (res && res.data) {
        this.fetchRides();

      }
    },err =>{
      console.log(err);
    })
  }

  addNewRide() {
    let model = this.modalCtrl.create('AddupdateridesPage', { "from": "create" });
    model.onDidDismiss(data => {
      if (data) {
        this.alertUtils.showLog(data);
        if (this.alertUtils.networkStatus()) {
          this.fetchRides();
        } else {
          this.alertUtils.showAlert("INTERNET CONNECTION", INTERNET_ERR_MSG, "OK");
        }
      }
    });
    model.present();

    this.ref.detectChanges();

  }


  fetchRides() {
    this.items = null;
    let input = { "User": { "userid": Utils.USER_INFO_DATA.userid, "apptype": APP_TYPE, "TransType": "getextrainformation" } };
    let data = JSON.stringify(input);
    this.apiService.postReq(GetService.ride(), data).then(res => {
      console.log(res);
      if (res && res.data) {
        this.items = res.data;
      }
      this.ref.detectChanges();
    },err =>{
      console.log(err);
    })
  }

}
