import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Utils } from '../../app/services/Utils';

/**
 * Generated class for the ProductsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {
  pageDetails: any;
  productList: any;
  totalamt: number;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) { }
  continue() {
    this.closeModal();
  }
  add(item) {
    item.ischecked = !item.ischecked;
    this.calculateTotalAmt();
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }
  onChange(item) {
    this.calculateTotalAmt();
  }
  calculateTotalAmt() {
    this.totalamt = 0;
    for (let i = 0; i < this.productList.length; i++) {
      const element = this.productList[i];
      if (element.ischecked) {
        this.totalamt = this.totalamt + element.pcost;
      }
    }
  }
  ngOnInit() {
    console.log(Utils.productsList)
    this.productList = Utils.productsList;
    this.pageDetails = this.navParams.get("category");

  }

}
