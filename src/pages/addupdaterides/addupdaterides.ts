import {ChangeDetectorRef, Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {GetService} from '../../app/services/get.servie';
import {APP_TYPE, Utils} from '../../app/services/Utils';
import {TranslateService} from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-addupdaterides',
  templateUrl: 'addupdaterides.html',
})
export class AddupdateridesPage {
  items: any;
  filterItems: any;
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
  searchTerm: string = "";


  constructor(public navCtrl: NavController, public navParams: NavParams, public alertUtils: Utils, private apiService: GetService, private ref: ChangeDetectorRef, private viewCtrl: ViewController, private translateService: TranslateService) {
    let lang = "en";
    if (Utils.lang) {
      lang = Utils.lang
    }
    console.log(lang);
    translateService.use(lang);

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

  filterItem() {
    this.filterItems = this.items.filter(item => item.manufacturer.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1 || item.model.toLowerCase().indexOf(this.searchTerm.toLowerCase()) > -1);
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
      console.log("YEAR : " + new Date().getFullYear())
      if (parseInt(this.year) > new Date().getFullYear()) {
        this.alertUtils.showToast("Invalid year");
        return false;
      }
    }

    if (!this.pColor) {
      this.alertUtils.showToast("Pick color");
      return false;
    }
    if (!this.alertUtils.validateText(this.city, "city", 2, 100)) {
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

    let input = {
      "User": {
        "manufacturer": this.itemSelected.manufacturer,
        "model": this.itemSelected.model,
        "code": this.plateCode,
        "number": this.plateNumber,
        "intensity": this.pColor,
        "year": this.year,
        "TransType": "extrainformation",
        "apptype": APP_TYPE,
        "city": this.city,
        "userid": Utils.USER_INFO_DATA.userid
      }
    };
    if (this.calledFrom == "update") {
      input.User.TransType = "updateextrainformation";
      if (this.updateItem && this.updateItem.entityid) {
        input.User["id"] = this.updateItem.entityid;
      }
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
    let input = {"root": {"usertype": "customer"}};
    this.apiService.postReq(GetService.entities(), input).then(res => {
      console.log(res)
      if (res && res.data) {
        this.items = res.data;
        this.filterItems = res.data;
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
