import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Utils } from '../../app/services/Utils';

@IonicPage()
@Component({
  selector: 'page-cancel-order',
  templateUrl: 'cancel-order.html',
})
export class CancelOrderPage {

  private orderItem: any;
  private cancelList: "";
  private msg: any;
  constructor(public alertUtils: Utils, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
  }
  private dismiss() {
    this.viewCtrl.dismiss();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad CancelOrderPage');
  }

  private update() {
    if (this.cancelList) {
      if (this.cancelList == 'other') {
        if (this.alertUtils.validateText(this.msg, "Reason", 3, 250)) {
          this.viewCtrl.dismiss(this.msg);

        } else {
          this.alertUtils.showToast(this.alertUtils.ERROR_MES);
        }
      } else {
        this.viewCtrl.dismiss(this.cancelList);
      }
    } else {
      this.alertUtils.showToast("Please select any one reason")
    }
  }
  ngOnInit() {
    this.orderItem = this.navParams.get('data');
  }





}
