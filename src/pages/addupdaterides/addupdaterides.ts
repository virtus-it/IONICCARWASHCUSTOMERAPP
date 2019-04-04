import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { GetService } from '../../app/services/get.servie';
import { Utils, APP_TYPE } from '../../app/services/Utils';

/**
 * Generated class for the AddupdateridesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addupdaterides',
  templateUrl: 'addupdaterides.html',
})
export class AddupdateridesPage {
  items: any;
  page1: boolean = true;
  page2: boolean = false;
  page3: boolean = false;
  title: string = "Select Manufacture & Model";
  itemSelected: any;
  city: string = "";
  plateNumber: string = "";
  plateCode: string = "";
  year: string = "";
  pColor: string = "";
  calledFrom: string = "";
  updateItem: any;



  constructor(public navCtrl: NavController, public navParams: NavParams, public alertUtils: Utils, private apiService: GetService, private ref: ChangeDetectorRef, private viewCtrl: ViewController) {
    this.calledFrom = this.navParams.get("from");
    this.updateItem = this.navParams.get("updateitem");
    console.log(this.updateItem);

    if (this.calledFrom == "update") {
      if (this.updateItem.intensity)
        this.pColor = this.updateItem.intensity;
      if (this.updateItem.city)
        this.city = this.updateItem.city;
      if (this.updateItem.modelcode)
        this.plateCode = this.updateItem.modelcode;
      if (this.updateItem.modelnumber)
        this.plateNumber = this.updateItem.modelnumber;
      if (this.updateItem.modelnumber)
        this.year = this.updateItem.modelyear;


    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddupdateridesPage');
  }
  pickColor(color) {
    this.pColor = color;
  }
  continue() {
    if (!this.alertUtils.validateText(this.year, "year", 4, 4)) {
      this.alertUtils.showToast(this.alertUtils.ERROR_MES);
      return false;
    }
    if (this.alertUtils.isValidQty(this.year)) {
      this.alertUtils.showToast("Invalid year");
      return false;
    }
    if (this.year) {
      if (parseInt(this.year) > 2019) {
        this.alertUtils.showToast("Invalid year");
        return false;
      }
    }

    if (!this.pColor) {
      this.alertUtils.showToast("Pick color");
      return false;
    }
    if (!this.alertUtils.validateText(this.city, "plate number", 2, 100)) {
      this.alertUtils.showToast(this.alertUtils.ERROR_MES);
      return false;
    }
    if (!this.alertUtils.validateText(this.plateNumber, "plate number", 1, 15)) {
      this.alertUtils.showToast(this.alertUtils.ERROR_MES);
      return false;
    }
    if (!this.alertUtils.validateText(this.plateCode, "plate code", 1, 15)) {
      this.alertUtils.showToast(this.alertUtils.ERROR_MES);
      return false;
    }

    let input = { "User": { "id": this.itemSelected.entityid, "manufacturer": this.itemSelected.manufacturer, "model": this.itemSelected.model, "code": this.plateCode, "number": this.plateNumber, "intensity": this.pColor, "year": this.year, "TransType": "extrainformation", "apptype": APP_TYPE, "city": this.city, "userid": Utils.USER_INFO_DATA.userid } };
    if (this.calledFrom == "update") {
      input.User.TransType = "updateextrainformation";
    }
    console.log(JSON.stringify(input));
    this.apiService.postReq(GetService.ride(), input).then(res => {
      console.log(res);
      if (res && res.data) {
        this.alertUtils.showToast("Ride created successfully");
        this.viewCtrl.dismiss('success');

      }
    })
  }

  pickedItem(item) {
    console.log(item);
    if (item) {
      this.itemSelected = item;
      this.page1 = false;
      this.page2 = true;
      this.title = "Enter details below"

    }
  }

  ngOnInit() {
    this.fetchRides();
  }
  onChange(c) {
    if (c.checked) {
      c.checked = false;
    } else {
      c.checked = true;
    }
    this.ref.detectChanges();
  }
  fetchRides() {
    let input = { "root": { "usertype": "customer" } };
    this.apiService.postReq(GetService.entities(), input).then(res => {
      console.log(res)
      if (res && res.data) {
        this.items = res.data;
        if (this.calledFrom == "update") {
          for (let i = 0; i < this.items.length; i++) {
            const element = this.items[i];
            if (element.manufacturer && element.manufacturer.toLowerCase() == this.updateItem.manufacturer && element.model && element.model.toLowerCase() == this.updateItem.model) {
              this.itemSelected = element;
            }

          }
        }
      }
    })
  }

}
