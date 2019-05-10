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

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, private alertUtils: Utils) { }
  continue() {
    let isProductSel = false;
    for (let i = 0; i < this.productList.length; i++) {
      const element = this.productList[i];
      if (element.ischecked) {
        isProductSel = true;
      }
    }
    if (isProductSel)
      this.closeModal();
    else this.alertUtils.showToast("Please select atleast one service");
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
  changeImage(item) {
    item.imgurl = "http://executive-carwash.com/wp-content/uploads/2012/10/detail-icon.png";
  }
  ngOnInit() {
    console.log(Utils.productsList)
    this.pageDetails = this.navParams.get("category");
    this.productList = Utils.categoryList.get(this.pageDetails);
    Utils.productsList = this.productList;

  }

}
