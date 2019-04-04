import {Component} from "@angular/core";
import {NavController, NavParams, ViewController, IonicPage} from "ionic-angular";
import {Utils} from "../../app/services/Utils";
@IonicPage()
@Component({
  selector: 'page-edit-address',
  templateUrl: 'edit-address.html',
})
export class EditAddressPage {
  addr: string = "";
  landmark: string = "";
  buildingName: string = "";

  constructor(public alertUtils: Utils, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit() {
    this.addr = this.navParams.get('addr');
    this.landmark = this.navParams.get('landmark');
    this.buildingName = this.navParams.get('buildingname');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  chooseItem() {
    if (this.alertUtils.validateText(this.addr, "Address", 3, 450)) {
      if (this.alertUtils.validateText(this.landmark, "Landmark", 3, 100)) {
        if (this.alertUtils.validateText(this.buildingName, "Flat Number", 3, 100)) {
          let data = {
            addr: this.addr,
            landmark: this.landmark,
            buildingname: this.buildingName
          };
          this.viewCtrl.dismiss(data);
        } else {
          this.alertUtils.showToast(this.alertUtils.ERROR_MES);
        }
      } else {
        this.alertUtils.showToast(this.alertUtils.ERROR_MES);
      }
    } else {
      this.alertUtils.showToast(this.alertUtils.ERROR_MES);
    }
  }
}
