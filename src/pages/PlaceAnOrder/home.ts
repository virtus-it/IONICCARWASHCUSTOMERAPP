import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { Content, ModalController, NavController, Platform, Slides } from "ionic-angular";
import { GetService } from "../../app/services/get.servie";
import { APP_TYPE, APP_USER_TYPE, RES_SUCCESS, TRY_AGAIN_ERR_MSG, Utils } from "../../app/services/Utils";
import { ConfirmOrder } from "../ConfirmOrderPage/ConfirmOrderPage";
import { Keyboard } from "@ionic-native/keyboard";


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild(Content) content: Content;
  increment: boolean = true;
  showProgressReorder: boolean = false;
  @ViewChild(Slides) public slides: Slides;
  public slideIndex = 0;
  private items = [];
  private defpng = ".png";
  private colorHome = "";
  private totalamt = 0;
  private totalitem = 0;
  private loginStatus: boolean = false;
  private showLastOrder: boolean = false;
  private hideFooter: boolean = true;
  private dealerID;
  private userID;
  private showRefresh = true;
  private showProgress = false;
  private hideHeader = true;
  private brandProducts = [];
  private productSelected: any;
  private lastOrderData: any;
  private resultData: any;
  private savingProduct: any;
  private model: any;
  private categoryList = [];


  constructor(private modalCtrl: ModalController, private ref: ChangeDetectorRef, private navCtrl: NavController, private getService: GetService, private alertUtils: Utils, public platform: Platform, public keyBoard: Keyboard) {
    // this.userID = Utils.USER_INFO_DATA.userid;
    // this.dealerID = Utils.USER_INFO_DATA.superdealerid;
    // this.fetchOrders(true);
    Utils.sLog("Place an order page constructor");

    try {
      if (Utils.NotificationPageData && Utils.NotificationPageData.isactive && Utils.NotificationPageData.redirectto && Utils.NotificationPageData.from) {
        Utils.NotificationPageData.isactive = false;
        var goto: string = Utils.NotificationPageData.redirectto;
        this.navCtrl.push(goto, { from: Utils.NotificationPageData.from });
      }
    } catch (e) {
      Utils.sLog(e);
    }
  }

  refreshTask() {
    this.fetchOrders(false);
    this.getData(true, false, "");
  }

  ngOnInit() {
    try {
      this.platform.ready().then(ready => {
        this.fetchProducts();


        this.keyBoard.onKeyboardShow().subscribe(data => {
          this.hideHeader = false;
          this.hideFooter = true;
          this.content.resize();
        });


        this.keyBoard.onKeyboardHide().subscribe(data => {
          this.hideHeader = true;
          this.hideFooter = false;
          this.content.resize();
        })
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }

  }

  changeSlide(item, index) {
    this.colorHome = "";
    this.showLastOrder = false;
    this.hideFooter = false;
    this.alertUtils.showLog(index);
    this.alertUtils.showLog("changeSlide");
    this.alertUtils.showLog(this.brandProducts.length);
    // item.color = "success";
    // for (let i = 0; i < this.brandProducts.length; i++) {
    //   if (item.productid != this.brandProducts[i].productid) {
    //     this.brandProducts[i].color = ""
    //   }
    //
    // }
    if (index == 0) {
      this.brandProducts[0].color = "primary"
    }
    setTimeout(() => {
      // if (index < this.brandProducts.length) {
      //   if (this.slides)
      //     this.slides.slideTo(index, 500);
      // }

      let pos = 0;
      for (let i = 0; i < this.brandProducts.length; i++) {
        if (item.categoryid == this.brandProducts[i].categoryid) {
          pos = i;
          break;
        }
      }
      this.slides.slideTo(pos, 100);
    }, 100);
  }


  goToNextSlide() {
    this.slides.slideNext(100);
  }

  goToPreviousSlide() {
    this.slides.slidePrev(100);
  }

  // slideChanged() {
  //   this.alertUtils.showLog(this.slides.getActiveIndex());
  //   this.alertUtils.showLog(this.slides.length());
  //   this.alertUtils.showLog(this.brandProducts.length);
  //   for (let i = 0; i < this.brandProducts.length; i++) {
  //     if (this.slides.getActiveIndex() == i) {
  //       this.brandProducts[i].color = "primary";
  //     } else {
  //       this.brandProducts[i].color = "";
  //     }
  //   }
  //   this.slideIndex = this.slides.getActiveIndex();
  //   this.alertUtils.showLog(this.slideIndex);
  //
  //   this.ref.detectChanges();
  // }
  slideChanged() {
    this.alertUtils.showLog("---------------");
    this.alertUtils.showLog(this.slides.getActiveIndex());
    this.alertUtils.showLog(this.brandProducts.length);
    this.alertUtils.showLog("---------------");
    if (this.slides.getActiveIndex() < this.brandProducts.length) {
      let cId = this.brandProducts[this.slides.getActiveIndex()].categoryid;

      for (let i = 0; i < this.categoryList.length; i++) {
        if (cId == this.categoryList[i].categoryid) {
          this.categoryList[i].color = "primary";
        } else {
          this.categoryList[i].color = "";
        }
      }
    }
  }


  getData(isFirst: boolean, isRefresh: boolean, refresher) {
    try {
      this.totalamt = 0;
      this.totalitem = 0;
      let input = {
        "root": {
          "userid": this.dealerID,
          "dealerid": this.dealerID,
          "distributorid": this.dealerID,
          "usertype": APP_USER_TYPE,
          "loginid": this.userID,
          "apptype": APP_TYPE,
          "getdiscountedproducts": "1"
        }
      };
      let data = JSON.stringify(input);
      if (isFirst)
        this.showProgress = true;
      this.getService.postReq(this.getService.getProductsByDistributerId(), data).then(res => {
        if (!this.hideFooter) {
          this.hideFooter = false;
        }
        this.hideProgress(isFirst, isRefresh, refresher);
        this.alertUtils.showLog(res);
        if (res.result == RES_SUCCESS) {
          if (res.data && res.data[0].products) {

            this.brandProducts = [];
            this.items = [];
            for (let i = 0; i < res.data[0].products.length; i++) {
              if (res.data[0].products[i].pcost && res.data[0].products[i].category && res.data[0].products[i].brandname) {
                res.data[0].products[i]["count"] = 0;
                if (!res.data[0].products[i].minorderqty) {
                  res.data[0].products[i].minorderqty = 1;
                }
                if (!res.data[0].products[i].stockstatus) {
                  res.data[0].products[i].stockstatus = "available";
                }
                res.data[0].products[i]["emptycount"] = 0;
                res.data[0].products[i]["randomcolor"] = Utils.getRandomRolor();
                this.validateLocalImg(i, res.data[0].products);
                this.items.push(res.data[0].products[i]);
                this.validateExistingCustomerProducts(i);
              }
            }
            if (res.data[0].discountedproducts) {
              if (res.data[0].discountedproducts.length > 0) {
                for (let j = 0; j < res.data[0].discountedproducts.length; j++) {
                  if (res.data[0].discountedproducts[j].pcost) {
                    for (let i = 0; i < this.items.length; i++) {
                      if (this.items[i].productid == res.data[0].discountedproducts[j].productid) {
                        if (this.items[j].stockstatus && this.items[j].stockstatus.toLowerCase() != "soldout") {
                          if (res.data[0].discountedproducts[j].default_qty) {
                            this.items[i]["count"] = res.data[0].discountedproducts[j].default_qty;
                          } else {
                            this.items[i]["count"] = 0;
                          }
                          if (res.data[0].discountedproducts[j].pcost)
                            this.items[i]["pcost"] = res.data[0].discountedproducts[j].pcost;
                          break;
                        }
                      }
                    }
                  }
                }
                this.calTotalAmt();
              }
            }
            if (this.brandProducts.length > 0) {
              if (!this.lastOrderData) {
                this.brandProducts[0].color = "primary";
              }
            }
            this.alertUtils.showLog("before modifying list", this.brandProducts);
            this.modifyList();


            //   if (this.slides)
            //     this.slides.slideTo(0, 100);
            //
            //   this.slideIndex = this.slides.getActiveIndex();
            // }
            this.ref.detectChanges();
            this.alertUtils.showLog(this.items);
            this.alertUtils.showLog("After modified list", this.brandProducts);
          } else {
            this.alertUtils.showToast("Found no products, please try again");
          }
        }
      }, err => {
        this.hideProgress(isFirst, isRefresh, refresher);
        if (!this.alertUtils.networkStatus()) {
          this.alertUtils.showToast(this.alertUtils.INTERNET_ERR_MSG);
        }
        this.alertUtils.showLog(err);
      }
      );
    }
    catch
    (e) {
      this.hideProgress(isFirst, isRefresh, refresher);
      this.alertUtils.showLog(e);
    }

  }

  modifyList() {
    this.categoryList = [];
    for (let i = 0; i < this.brandProducts.length; i++) {
      let catId = this.brandProducts[i].categoryid;
      if (i == 0) {
        this.categoryList.push(this.brandProducts[i]);
      } else {
        let fObj = this.categoryList.find(function (obj) {
          return obj.categoryid === catId;
        });
        if (!fObj) {
          this.categoryList.push(this.brandProducts[i]);
        }
      }
    }
    let finalList = [];
    for (let i = 0; i < this.categoryList.length; i++) {
      let catId = this.categoryList[i].categoryid;
      let bName = this.categoryList[i].brandname;
      finalList.push(this.categoryList[i]);
      for (let j = 0; j < this.brandProducts.length; j++) {
        if (catId == this.brandProducts[j].categoryid && bName != this.brandProducts[j].brandname) {
          finalList.push(this.brandProducts[j]);
        }
      }
    }
    this.brandProducts = [];
    this.brandProducts = finalList;
  }

  hideProgress(isFirst, isRefresh, refresh) {
    this.showProgress = false;
    if (isRefresh)
      refresh.complete();
  }

  nextPage() {
    console.log(this.savingProduct);
    if (this.totalamt > 0) {
      let goNext = true;
      for (let prod of this.productSelected) {
        if (prod.emptycan && prod.emptycount <= prod.selectedCount) {
          goNext = false;
          this.alertUtils.showLog(prod);
          break;
        }
        if (!prod.emptycan && prod.selectedCount > 0) {
          goNext = false;
          this.alertUtils.showLog(prod);
          break;
        }
      }
      if (goNext) {
        this.alertUtils.showAlert("ALERT", "Empty can should not be greater then product quantity, please change it", "OK");
      } else {
        let obj = { "savingProduct": this.savingProduct }
        this.navCtrl.push('PreviewPage', {
          item: this.productSelected,
          totalAmount: this.totalamt,
          totalItems: this.totalitem,
          savingobj: obj

        });
      }
    } else {
      this.alertUtils.showToast('Please select atleast 1 product');
    }
  }

  emptyCanCheck(item) {
    if (item.emptycan) {
      item.emptycount = item.count;

      this.model = this.modalCtrl.create('EditemptycanPage', { item: item }, {
        showBackdrop: true,
        enableBackdropDismiss: true,
        cssClass: 'editemptycan'
      });
      this.model.onDidDismiss(data => {
        if (data) {
          if (data.eCount > 0) {
            item.emptycount = data.eCount;
            for (let i = 0; i < item.products.length; i++) {
              item.products[i].emptycount = item.emptycount;
              item.products[i].emptycan = item.emptycan;
            }

          } else {
            this.alertUtils.showLog("empty dialog else called");
            item.emptycan = false;
            for (let i = 0; i < item.products.length; i++) {
              item.products[i].emptycount = 0;
              item.products[i].emptycan = false;
            }
          }
        }
      });
      this.model.present();
    } else {
      for (let i = 0; i < item.products.length; i++) {
        item.products[i].emptycount = 0;
        item.products[i].emptycan = false;
      }
      this.closeEmptyDialog();
    }
  }

  closeEmptyDialog() {
    if (this.model) {
      this.model.dismiss({ eCount: 0 });
    }
  }

  emptyCountChange(item) {
    this.alertUtils.showLog(item.emptycount);
    if (item.emptycount > item.count) {
      // item.emptycount = item.count;
      this.alertUtils.showAlert("ALERT", "Empty can should not be greater then product quantity, please change it", "OK");
    }
    this.alertUtils.showLog("after" + item.emptycount);
    this.ref.detectChanges();
    for (let i = 0; i < item.products.length; i++) {
      item.products[i].emptycount = item.emptycount;
      item.products[i].emptycan = item.emptycan;
    }
  }

  qtyChangeListener(item) {
    if (!item.count) {
      item.count = 0;
    }
    this.productSelected = [];
    this.totalitem = 0;
    this.totalamt = 0;
    let pID: any;
    let cID: any;
    let pos = 0;
    if (item.count > 0) {
      this.productSelected = item.products;
      for (let i = 0; i < this.brandProducts.length; i++) {
        if (item.productid == this.brandProducts[i].productid) {
          pos = i;
          cID = this.brandProducts[i].categoryid;
          if (item.count >= item.minorderqty) {
            this.brandProducts[i].count = item.count;
          } else {
            this.brandProducts[i].count = item.minorderqty;
            item.count = item.minorderqty;
          }
        } else {
          this.brandProducts[i].count = 0;
        }
        this.totalitem = this.totalitem + this.brandProducts[i].count;
        this.totalamt = this.totalamt + (this.brandProducts[i].pcost * this.brandProducts[i].count);
      }

      for (let i = item.products.length; i--;) {
        if (item.products[i].minorderqty <= item.count) {
          this.alertUtils.showLog("Selected");
          this.alertUtils.showLog(item.products[i]);
          item.products[i]["selected"] = true;
          item.products[i]["selectedCount"] = item.count;
          item.products[i]["defSerCharge"] = item.products[0].servicecharge;
          pID = item.products[i].productid;
          this.savingProduct = item.products[i];
          break;
        }
      }
      for (let i = 0; i < item.products.length; i++) {
        if (pID != item.products[i].productid) {
          item.products[i].selected = false;
          item.products[i].selectedCount = 0;
        }
      }
      for (let i = 0; i < this.categoryList.length; i++) {
        if (cID == this.categoryList[i].categoryid) {
          this.categoryList[i]["selCnt"] = this.brandProducts[pos].count;
        } else {
          this.categoryList[i]["selCnt"] = 0;
        }
      }
    }
  }

  viewItemMinus(item) {
    if (item.count > 0) {
      if (this.increment)
        item.count--;
      this.totalitem = 0;
      this.totalamt = 0;
      this.productSelected = item.products;
      let pID: any;
      let cID: any;
      let pos = 0;
      for (let i = 0; i < this.brandProducts.length; i++) {
        if (item.productid == this.brandProducts[i].productid) {
          pos = i;
          cID = this.brandProducts[i].categoryid;
          if (item.count >= item.minorderqty) {
            this.brandProducts[i].count = item.count;
          } else {
            this.brandProducts[i].count = 0;
            item.count = 0;
          }
        } else {
          this.brandProducts[i].count = 0;
        }
        this.totalitem = this.totalitem + this.brandProducts[i].count;
        this.totalamt = this.totalamt + (this.brandProducts[i].pcost * this.brandProducts[i].count);
      }

      for (let i = item.products.length; i--;) {
        if (item.products[i].minorderqty <= item.count) {
          this.alertUtils.showLog("Selected");
          this.alertUtils.showLog(item.products[i]);
          item.products[i]["selected"] = true;
          item.products[i]["selectedCount"] = item.count;
          item.products[i]["defSerCharge"] = item.products[0].servicecharge;
          item.products[i].emptycan = item.emptycan;
          item.products[i].emptycount = item.emptycount;
          pID = item.products[i].productid;
          this.savingProduct = item.products[i];
          break;
        }
      }
      for (let i = 0; i < item.products.length; i++) {
        if (pID != item.products[i].productid) {
          item.products[i].selected = false;
          item.products[i].selectedCount = 0;
        }
      }
      for (let i = 0; i < this.categoryList.length; i++) {
        if (cID == this.categoryList[i].categoryid) {
          this.categoryList[i]["selCnt"] = this.brandProducts[pos].count;
        } else {
          this.categoryList[i]["selCnt"] = 0;
        }
      }
    }
  }

  viewItemPlus(item) {
    if (this.increment)
      item.count++;
    this.totalitem = 0;
    this.totalamt = 0;
    let dataPicked = false;
    this.productSelected = item.products;
    let pID: any;
    let cID: any;
    let pos = 0;
    for (let i = 0; i < this.brandProducts.length; i++) {
      if (item.productid == this.brandProducts[i].productid) {
        pos = i;
        cID = this.brandProducts[i].categoryid;
        if (item.count >= item.minorderqty) {
          this.brandProducts[i].count = item.count;
        } else {
          this.brandProducts[i].count = item.minorderqty;
          item.count = item.minorderqty;
        }
      } else {
        this.brandProducts[i].count = 0;
      }
      this.totalitem = this.totalitem + this.brandProducts[i].count;
      this.totalamt = this.totalamt + (this.brandProducts[i].pcost * this.brandProducts[i].count);
    }
    for (let i = item.products.length; i--;) {
      if (item.products[i].minorderqty <= item.count) {
        this.alertUtils.showLog("Selected");
        this.alertUtils.showLog(item.products[i]);
        item.products[i]["selected"] = true;
        item.products[i]["selectedCount"] = item.count;
        item.products[i]["defSerCharge"] = item.products[0].servicecharge;
        item.products[i].emptycan = item.emptycan;
        item.products[i].emptycount = item.emptycount;
        pID = item.products[i].productid;
        this.savingProduct = item.products[i];

        break;
      }
    }
    for (let i = 0; i < item.products.length; i++) {
      if (pID != item.products[i].productid) {
        item.products[i].selected = false;
        item.products[i].selectedCount = 0;
      }
    }
    for (let i = 0; i < this.categoryList.length; i++) {
      if (cID == this.categoryList[i].categoryid) {
        this.categoryList[i]["selCnt"] = this.brandProducts[pos].count;
      } else {
        this.categoryList[i]["selCnt"] = 0;
      }
    }
  }

  validateLocalImg(i, items) {
    if (items[i].brandname && items[i].brandname)
      if (items[i].brandname.toLowerCase().indexOf('bisleri') != -1 || items[i].category.toLowerCase().indexOf('bisleri') != -1) {
        items[i]["prodimg"] = "assets/imgs/bisleri";
        items[i]["pimg"] = "assets/imgs/bisleri";
      } else if (items[i].brandname.toLowerCase().indexOf('aquafina') != -1 || items[i].category.toLowerCase().indexOf('aquafina') != -1) {
        items[i]["prodimg"] = "assets/imgs/aquafina";
        items[i]["pimg"] = "assets/imgs/aquafina";
      } else if (items[i].brandname.toLowerCase().indexOf('aquasure') != -1 || items[i].category.toLowerCase().indexOf('aquasure') != -1) {
        items[i]["prodimg"] = "assets/imgs/aquasure";
        items[i]["pimg"] = "assets/imgs/aquasure";
      } else if (items[i].brandname.toLowerCase().indexOf('bailey') != -1 || items[i].category.toLowerCase().indexOf('bailey') != -1) {
        items[i]["prodimg"] = "assets/imgs/bailley";
        items[i]["pimg"] = "assets/imgs/bailley";
      } else if (items[i].brandname.toLowerCase().indexOf('bailley') != -1 || items[i].category.toLowerCase().indexOf('bailley') != -1) {
        items[i]["prodimg"] = "assets/imgs/bailley";
        items[i]["pimg"] = "assets/imgs/bailley";
      } else if (items[i].brandname.toLowerCase().indexOf('kinley') != -1 || items[i].category.toLowerCase().indexOf('kinley') != -1) {
        items[i]["prodimg"] = "assets/imgs/kinley";
        items[i]["pimg"] = "assets/imgs/kinley";
      } else if (items[i].brandname.toLowerCase().indexOf('non') != -1 || items[i].category.toLowerCase().indexOf('non') != -1) {
        if (Utils.USER_INFO_DATA && Utils.USER_INFO_DATA.dealers && Utils.USER_INFO_DATA.dealers.issuperdealer && Utils.USER_INFO_DATA.dealers.issuperdealer == 'true') {
          items[i]["prodimg"] = "assets/imgs/nonisi";
          items[i]["pimg"] = "assets/imgs/nonisi";
        } else {
          items[i]["prodimg"] = this.getService.getImg() + "product_" + items[i].productid;
          items[i]["pimg"] = this.getService.getImg() + "product_" + items[i].productid;
        }
      } else if (items[i].brandname.toLowerCase().indexOf('isi') != -1 || items[i].category.toLowerCase().indexOf('isi') != -1) {
        if (Utils.USER_INFO_DATA && Utils.USER_INFO_DATA.dealers && Utils.USER_INFO_DATA.dealers.issuperdealer && Utils.USER_INFO_DATA.dealers.issuperdealer == 'true') {
          items[i]["prodimg"] = "assets/imgs/isi";
          items[i]["pimg"] = "assets/imgs/isi";
        } else {
          items[i]["prodimg"] = this.getService.getImg() + "product_" + items[i].productid;
          items[i]["pimg"] = this.getService.getImg() + "product_" + items[i].productid;
        }
      } else if (items[i].brandname.toLowerCase().indexOf('rich') != -1 || items[i].category.toLowerCase().indexOf('rich') != -1) {
        items[i]["prodimg"] = "assets/imgs/hrich";
        items[i]["pimg"] = "assets/imgs/hrich";
      } else if (items[i].pimg) {
        items[i]["prodimg"] = this.getService.getImg() + "product_" + items[i].productid;
      }
  }

  validateExistingCustomerProducts(i) {
    let obj = {
      "brandname": "",
      "pname": "",
      "product_img": "",
      "pimage": "",
      "pcost": "",
      "count": 0,
      "color": "",
      "productid": 0,
      "minorderqty": 0,
      "category": "",
      "categoryid": 0,
      "emptycan": false,
      "emptycount": 0,
      "stockstatus": 'available',
      "products": []
    };
    let bName = this.items[i].brandname;
    let categoryid = this.items[i].categoryid;

    if (this.brandProducts.length == 0) {
      obj.brandname = this.items[i].brandname;
      obj.pname = this.items[i].pname;
      obj.product_img = this.items[i].prodimg;
      obj.pcost = this.items[i].pcost;
      obj.pimage = this.items[i].pimg;
      obj.productid = this.items[i].productid;
      obj.count = this.items[i].count;
      obj.minorderqty = this.items[i].minorderqty;
      if (this.items[i].stockstatus)
        obj.stockstatus = this.items[i].stockstatus.toLowerCase();
      obj.category = this.items[i].category;
      obj.categoryid = this.items[i].categoryid;
      obj.products.push(this.items[i]);
      this.brandProducts.push(obj);

    } else {

      let fObj = this.brandProducts.find(function (obj) {
        return obj.brandname === bName && obj.categoryid === categoryid;
      });
      if (fObj) {
        for (let j = 0; j < this.brandProducts.length; j++) {
          if (this.brandProducts[j].brandname.toLowerCase() == fObj.brandname.toLowerCase() && this.brandProducts[j].categoryid == fObj.categoryid) {
            this.brandProducts[j].products.push(this.items[i]);
          }
        }
      } else {
        obj.brandname = this.items[i].brandname;
        obj.pname = this.items[i].pname;
        obj.product_img = this.items[i].prodimg;
        obj.pimage = this.items[i].pimg;
        obj.pcost = this.items[i].pcost;
        obj.productid = this.items[i].productid;
        obj.count = this.items[i].count;
        obj.minorderqty = this.items[i].minorderqty;
        obj.category = this.items[i].category;
        obj.categoryid = this.items[i].categoryid;
        if (this.items[i].stockstatus)
          obj.stockstatus = this.items[i].stockstatus.toLowerCase();
        obj.products.push(this.items[i]);
        this.brandProducts.push(obj);
      }

    }
  }

  changeImage(item) {
    console.log("change image called");
    item.product_img = "";
    if (item.category && item.brandname)
      if (item.brandname.toLowerCase().indexOf('non-') != -1 || item.category.toLowerCase().indexOf('non-') != -1) {
        item.product_img = "assets/imgs/nonisi";
        item.pimage = "assets/imgs/nonisi";
      } else if (item.brandname.toLowerCase().indexOf('isi') != -1 || item.category.toLowerCase().indexOf('isi') != -1) {
        item.product_img = "assets/imgs/isi";
        item.pimage = "assets/imgs/isi";
      }
  }

  showSlider(value) {
    if (this.brandProducts.length > 0) {

      if (value) {
        this.showLastOrder = false;
        this.hideFooter = false;
        this.colorHome = "";
        if (this.slides) {
          if (this.slides.getActiveIndex() == 0)
            this.brandProducts[0].color = "primary";
          else {
            this.brandProducts[this.slides.getActiveIndex()].color = "primary";
          }

        }
      } else {
        this.showLastOrder = true;
        this.hideFooter = true;
        this.colorHome = "primary";
        for (let i = 0; i < this.brandProducts.length; i++) {
          this.brandProducts[i].color = "";
        }
      }
    }
  }

  fetchOrders(callProduct) {
    try {
      let input = {
        "order": {
          "userid": this.userID,
          "priority": this.userID,
          "usertype": APP_USER_TYPE,
          "status": "all",
          "lastrecordtimestamp": "15",
          "pagesize": "1",
          "apptype": APP_TYPE
        }
      };

      let data = JSON.stringify(input);
      this.showProgress = true;
      this.getService.postReq(this.getService.getOrderListByStatus(), data).then(res => {
        if (callProduct)
          this.getData(true, false, "");
        else
          this.showProgress = false;
        this.alertUtils.showLog(res);
        if (res.result == this.alertUtils.RESULT_SUCCESS) {
          if (res.data && res.data.length > 0) {
            for (let i = 0; i < res.data.length; i++) {
              if (res.data[i].paymenttype == "cod"
                || res.data[i].paymenttype == "cash") {
                res.data[i].paymenttype = "COD";
              } else if (res.data[i].paymenttype == "credit") {
                res.data[i].paymenttype = "CREDIT";
              }
              if (res.data[i].prod_id) {
                res.data[i]["productid"] = res.data[i].prod_id
              }
              if (res.data[i].productdetails && res.data[i].productdetails.category)
                res.data[i]["category"] = res.data[i].productdetails.category;
              this.validateLocalImg(i, res.data);
            }
            this.resultData = res.data;
            if (this.resultData && this.resultData.length > 0) {
              this.colorHome = "primary";
              this.showLastOrder = true;
              this.hideFooter = true;
              this.getLastOrderObj();
            }
            this.alertUtils.showLog("LAST ORDER DATA");
            this.alertUtils.showLog(this.resultData);

          } else {
            this.hideFooter = false;
          }
        } else {
          this.hideFooter = false;
        }
      }).catch(error => {
        this.hideFooter = false;
        if (callProduct)
          this.getData(true, false, "");
        if (!this.alertUtils.networkStatus()) {
          this.alertUtils.showToast(this.alertUtils.INTERNET_ERR_MSG);
        }
        this.alertUtils.showLog(error);
        this.showProgress = false;

      });
    } catch (e) {
      this.showProgress = false;
      if (this.brandProducts.length == 0) {
        if (callProduct)
          this.getData(true, false, "");
      }
      this.alertUtils.showLog(e);
    }
  }

  getLastOrderObj() {
    let max = Math.max.apply(Math, this.resultData.map(function (item) {
      return item.order_id;
    }));
    this.alertUtils.showLog(max);
    var obj = this.resultData.find(function (obj) {
      return obj.order_id === max;
    });
    if (obj)
      this.lastOrderData = obj;
  }

  reorder() {
    try {
      this.showProgressReorder = true;
      let orderCatoryList = this.brandProducts.find(item => item.category == this.lastOrderData.category);
      if (orderCatoryList && orderCatoryList.products) {
        this.showProgressReorder = false;
        let model = this.modalCtrl.create(ConfirmOrder, {
          "proddata": orderCatoryList,
          "orderdata": this.lastOrderData,
          "from": "reorder"
        });
        model.onDidDismiss(data => {
          if (data) {
            this.fetchOrders(false);
          }
        });
        model.present();
      } else {
        if (this.lastOrderData) {
          this.getService.getReq(GetService.getProductDetailsById() + this.userID + "/" + this.lastOrderData.prod_id + "/" + APP_TYPE).subscribe(res => {
            this.showProgressReorder = false;
            if (res.result == this.alertUtils.RESULT_SUCCESS) {
              this.alertUtils.showLog(res);
              let model = this.modalCtrl.create(ConfirmOrder, {
                "proddata": res.data[0],
                "orderdata": this.lastOrderData,
                "from": "reorder"
              });
              model.onDidDismiss(data => {
                if (data) {
                  this.fetchOrders(false);
                }
              });
              model.present();
            } else {
              this.alertUtils.showToast(TRY_AGAIN_ERR_MSG);
            }
          }, err => {
            this.showProgressReorder = false;
            this.alertUtils.showLog(err);
          });
        }
      }
    } catch (e) {
      this.showProgressReorder = false;
      this.alertUtils.showLog(e);
    }

  }

  private calTotalAmt() {
    this.totalamt = 0;
    this.totalitem = 0;
    for (let i = 0; i < this.items.length; i++) {
      this.totalitem = this.totalitem + this.items[i].count;
      this.totalamt = this.totalamt + (this.items[i].pcost * this.items[i].count);
    }
  }

  private fetchProducts() {
    console.log('fetchProducts called');
    this.alertUtils.getUserInfo().then(user => {
      if (user)
        Utils.USER_INFO_DATA = user;
    }).catch(err => {
      this.alertUtils.showLog(err);
    });
    this.alertUtils.getLoginState().then(resLStatus => {
      if (resLStatus) {
        this.loginStatus = resLStatus;
        this.alertUtils.getUserId().then(res => {
          if (res) {
            this.userID = res;
            this.alertUtils.getDealerId().then(res => {
              if (res) {
                this.dealerID = res;
                this.fetchOrders(true);

              }
            });
          }
        });
      }
    }).catch(err => {
      this.alertUtils.showLog(err);
    })
  }
}
