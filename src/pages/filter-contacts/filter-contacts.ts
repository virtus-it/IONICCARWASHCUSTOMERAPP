import {ChangeDetectorRef, Component} from "@angular/core";
import {NavController, NavParams, ViewController, IonicPage} from "ionic-angular";
import {Utils} from "../../app/services/Utils";

@IonicPage()
@Component({
  selector: 'page-filter-contacts',
  templateUrl: 'filter-contacts.html',
})
export class FilterContactsPage {
  input = {};
  private contacts: any;
  private calledFrom: any;
  private searchContacts: any;

  constructor(private ref: ChangeDetectorRef, public viewCtrl: ViewController, private alertUtils: Utils, public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit() {

    this.contacts = this.navParams.get('contacts');
    this.calledFrom = this.navParams.get('calledfrom');
    // this.contacts = [
    //   {"name": "Abb", "phonenumber": "9863636315", "checked": false},
    //   {"name": "Csl", "phonenumber": "4674651352", "checked": false},
    //   {"name": "Jcgjh", "phonenumber": "5438718555", "checked": false}
    // ];
    // this.alertUtils.showLog(this.contacts);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  onChange(c) {
    if (c.checked) {
      c.checked = false;
    } else {
      c.checked = true;
    }
    this.ref.detectChanges();
  }

  chooseItem() {
    var obj = this.contacts.find(function (obj) {
      return obj.checked === true;
    });
    // this.alertUtils.showLog(obj);
    if (obj) {
      let pickArray = [];
      for (let i = 0; i < this.contacts.length; i++) {
        if (this.contacts[i].checked) {
          pickArray.push(this.contacts[i]);
        }
      }
      this.alertUtils.showLog(pickArray);
      this.viewCtrl.dismiss(pickArray);

    } else {
      this.alertUtils.showToast("Please select atleast one contact");
    }
  }
}
