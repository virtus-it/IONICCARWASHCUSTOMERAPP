import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { Content, ModalController, NavController, NavParams, Platform, Slides, ViewController } from "ionic-angular";
import { GetService } from "../../app/services/get.servie";
import { APP_TYPE, APP_USER_TYPE, RES_SUCCESS, Utils } from "../../app/services/Utils";
import { SignUp } from "../SignUp/SignUp";
import { Keyboard } from "@ionic-native/keyboard";

@Component({
  selector: 'page-product',
  templateUrl: 'ProductsPage.html'
})
export class ProductsPage {
  @ViewChild(Content) content: Content;
  increment: boolean = true;
  orderItem: any;
  calledFrom = "";
  @ViewChild(Slides) slides: Slides;
  // private matchObj: any;
  pos: number = 0;
  private items: any;
  private defpng = ".png";
  private totalamt = 0;
  private totalitem = 0;
  private exMobNumber: any;
  private showRefresh = true;
  private isExisting = false;
  private exMobileno = "";
  private exUserInfo: any;
  private userLatlng: any;
  private userAddr: any;
  private referCode: string = "";
  private brandProducts = [];
  private categoryList = [];
  private showProgress: boolean = false;
  private productSelected: any;
  private hideHeader = true;
  private savingProduct: any;
  private model: any;


  constructor(private viewCtrl: ViewController, private modalCtrl: ModalController, private ref: ChangeDetectorRef, private navCtrl: NavController, private param: NavParams, private getService: GetService, private alertUtils: Utils, public platform: Platform, public keyBoard: Keyboard) {
    try {
      this.calledFrom = this.param.get("calledfrom");
      this.alertUtils.showLog(this.calledFrom);
      this.isExisting = this.param.get("isExisting");
      this.exMobileno = this.param.get("exMobileno");
      this.exUserInfo = this.param.get("exUserInfo");
      this.userAddr = this.param.get("userAddr");
      this.referCode = this.param.get("referCode");
      this.userLatlng = this.param.get("userLatlng");

      Utils.sLog(this.exUserInfo);

      if (this.calledFrom == "myorders") {
        this.orderItem = this.param.get("orderitem");
        this.alertUtils.showLog(this.orderItem);
        // this.getData(true, false, "");
        this.alertUtils.getUserInfo().then(info => {
          Utils.sLog(info);
          Utils.USER_INFO_DATA = info;
          this.getData(true, false, "");

        }).catch(err => {
          this.alertUtils.showLog(err);
        });


      } else {
        if (this.isExisting) {
          this.showRefresh = false;

          this.items = this.param.get("items");
          if (this.items && this.items.length > 0) {
            for (let i = 0; i < this.items.length; i++) {
              this.validateLocalImg(i, false);
              this.validateExistingCustomerProducts(i)
            }
            this.calTotalAmt();
            this.alertUtils.showLog(this.brandProducts);
            this.modifyList();

          } else {
            this.fetchProducts();
          }

        } else {
          this.fetchProducts();
        }
      }
    } catch (e) {
      this.alertUtils.showLog(e);
    }

  }

  ngOnInit() {
    try {
      this.platform.ready().then(ready => {
        this.keyBoard.onKeyboardShow().subscribe(data => {

          this.hideHeader = false;
          this.content.resize();
        });


        this.keyBoard.onKeyboardHide().subscribe(data => {
          this.hideHeader = true;
          this.content.resize();
        })
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }


  getData(isFirst: boolean, isRefresh: boolean, refresher) {
    try {
      this.totalamt = 0;
      this.totalitem = 0;
      let input = {
        "root": {
          "userid": Utils.USER_INFO_DATA.superdealerid,
          "dealerid": Utils.USER_INFO_DATA.superdealerid,
          "distributorid": Utils.USER_INFO_DATA.superdealerid,
          "usertype": APP_USER_TYPE,
          "loginid": Utils.USER_INFO_DATA.userid,
          "apptype": APP_TYPE,
          "getdiscountedproducts": "1"
        }
      };
      let data = JSON.stringify(input);
      if (isFirst)
        this.showProgress = true;
      this.getService.postReq(this.getService.getProductsByDistributerId(), data).then(res => {
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
                this.items.push(res.data[0].products[i]);
                this.validateLocalImg(i, true);
                this.validateExistingCustomerProducts(i);
              }
            }
            this.alertUtils.showLog(this.brandProducts);
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

            this.modifyList();

            // if coming from myorders page for editing order
            if (this.calledFrom == 'myorders') {
              let breakOuterLoop = false;
              this.pos = 0;
              for (let i = 0; i < this.brandProducts.length; i++) {
                if (breakOuterLoop)
                  break;
                for (let insideProd of this.brandProducts[i].products) {
                  if (insideProd.productid == this.orderItem.prod_id) {
                    this.pos = i;
                    this.alertUtils.showLog(this.brandProducts[i]);
                    this.alertUtils.showLog("GOT IT PRODUCT");
                    this.brandProducts[i].count = this.orderItem.quantity;
                    this.brandProducts[i]["color"] = 'primary';
                    insideProd["selected"] = true;
                    insideProd["selectedCount"] = this.orderItem.quantity;
                    // insideProd["defSerCharge"] = insideProd.servicecharge;
                    insideProd["defSerCharge"] = this.brandProducts[i].products[0].servicecharge;
                    this.productSelected = [];
                    this.productSelected.push(insideProd);
                    this.totalitem = this.orderItem.quantity;
                    this.totalamt = (this.brandProducts[i].pcost * this.orderItem.quantity);
                    breakOuterLoop = true;
                    this.savingProduct = insideProd;
                    console.log(this.savingProduct)                  
                    break;
                  }
                }
              }
              this.alertUtils.showLog(this.pos);

            }


            this.ref.detectChanges();
            setTimeout(() => {
              if (this.calledFrom == 'myorders') {
                if (this.pos > 0) {
                  this.alertUtils.showLog("greater position : " + this.pos);
                  if (this.slides)
                    this.slides.slideTo(this.pos, 100);
                }
              } else {
                if (this.brandProducts.length > 0) {
                  if (this.slides)
                    this.slides.slideTo(0, 100);
                }
              }
            }, 1000);

            this.alertUtils.showLog(this.items);
            this.alertUtils.showLog(this.brandProducts);
          } else {
            this.alertUtils.showToast("Found no products, please try again");
          }
        }
      }, err => {
        this.hideProgress(isFirst, isRefresh, refresher);
        this.alertUtils.showToast(this.alertUtils.INTERNET_ERR_MSG);
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


  changeEmptyCan(item) {
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
            item.emptycan = false;
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
    this.alertUtils.showLog("input chnaged listner");
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


  validateExistingCustomerProducts(i) {
    let obj = {
      "brandname": "",
      "pname": "",
      "product_img": "",
      "pimage": "",
      "pcost": "",
      "count": 0,
      "color": "",
      "stockstatus": "available",
      "productid": 0,
      "minorderqty": 0,
      "category": "",
      "categoryid": 0,
      "emptycan": false,
      "products": []
    };
    let bName = this.items[i].brandname;
    let categoryid = this.items[i].categoryid;
    if (this.brandProducts.length == 0) {
      obj.brandname = this.items[i].brandname;
      obj.pname = this.items[i].pname;
      obj.product_img = this.items[i].product_img;
      obj.pcost = this.items[i].pcost;
      obj.pimage = this.items[i].pimage;
      obj.productid = this.items[i].productid;
      if (this.items[i].stockstatus)
        obj.stockstatus = this.items[i].stockstatus.toLowerCase();
      obj.count = this.items[i].count;
      obj.minorderqty = this.items[i].minorderqty;
      obj.category = this.items[i].category;
      obj.categoryid = this.items[i].categoryid;
      if (this.calledFrom != 'myorders')
        obj.color = "primary";
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
        obj.product_img = this.items[i].product_img;
        obj.pimage = this.items[i].pimage;
        obj.pcost = this.items[i].pcost;
        obj.productid = this.items[i].productid;
        if (this.items[i].stockstatus)
          obj.stockstatus = this.items[i].stockstatus.toLowerCase();
        obj.count = this.items[i].count;
        obj.minorderqty = this.items[i].minorderqty;
        obj.category = this.items[i].category;
        obj.categoryid = this.items[i].categoryid;
        obj.products.push(this.items[i]);
        this.brandProducts.push(obj);
      }

    }
  }

  doRefresh(refresher) {
    if (this.calledFrom == 'myorders') {
      this.getData(false, true, refresher);
    } else
      this.getDataByAreaWise(false, true, refresher);
    setTimeout(() => {
      refresher.complete();
    }, 30000);
  }

  changeSlide(item, index) {
    let pos = 0;
    for (let i = 0; i < this.brandProducts.length; i++) {
      if (item.categoryid == this.brandProducts[i].categoryid) {
        pos = i;
        break;
      }
    }
    this.slides.slideTo(pos, 100);
  }

  goToNextSlide(item) {
    this.slides.slideNext(100);
  }

  goToPreviousSlide(item) {
    this.slides.slidePrev(100);
  }

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

  changeImage(item) {
    this.alertUtils.showLog("change image called");
    item.product_img = "";
    if (item.category && item.brandname)
      if (item.brandname.toLowerCase().indexOf('non-') != -1) {
        item.product_img = "assets/imgs/nonisi";
        item.pimage = "assets/imgs/nonisi";
      } else if (item.brandname.toLowerCase().indexOf('isi') != -1) {
        item.product_img = "assets/imgs/isi";
        item.pimage = "assets/imgs/isi";
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

  nextPage() {
    try {
      if (this.totalamt > 0) {
        if (this.calledFrom == "myorders") {
          let obj = { "savingProduct": this.savingProduct }
          let model = this.modalCtrl.create('PreviewPage', {
            from: "myorders",
            item: this.productSelected,
            totalAmount: this.totalamt,
            totalItems: this.totalitem,
            orderitem: this.orderItem,
            savingobj: obj
          });
          model.present();
          model.onDidDismiss(res => {
            if (res) {
              this.alertUtils.showLog(res);
              this.viewCtrl.dismiss(res);
            }
          });
        } else {
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
            this.alertUtils.showAlert("ALERT", "Empty can should not be greater then product quantity ,please change it", "OK");
          } else {
            let obj = { "savingProduct": this.savingProduct }

            this.navCtrl.push(SignUp, {
              item: this.productSelected,
              totalAmount: this.totalamt,
              totalItems: this.totalitem,
              isExisting: this.isExisting,
              isExMobileNo: this.exMobileno,
              exUserInfo: this.exUserInfo,
              userAddr: this.userAddr,
              userLatlng: this.userLatlng,
              referCode: this.referCode,
              savingobj: obj
            });
          }
        }
      } else {
        this.alertUtils.showToast('Please select atleast 1 product');
      }
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  viewItemMinus(item) {
    if (item.count > 0) {
      if (this.increment)
        item.count--;
      this.totalitem = 0;
      this.totalamt = 0;
      let pID: any;
      let cID: any;
      let pos = 0;
      this.productSelected = item.products;
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
          this.categoryList[i]["selCnt"] = this.brandProducts[pos].count
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

  hideProgress(isFirst, isRefresh, refresh) {
    this.showProgress = false;
    if (isRefresh)
      refresh.complete();
  }

  validateLocalImg(i, check) {
    if (this.items[i].brandname.toLowerCase().indexOf('bisleri') != -1 || this.items[i].category.toLowerCase().indexOf('bisleri') != -1) {
      this.items[i]["pimage"] = "assets/imgs/bisleri";
      this.items[i]["product_img"] = "assets/imgs/bisleri";
    } else if (this.items[i].brandname.toLowerCase().indexOf('aquafina') != -1 || this.items[i].category.toLowerCase().indexOf('aquafina') != -1) {
      this.items[i]["pimage"] = "assets/imgs/aquafina";
      this.items[i]["product_img"] = "assets/imgs/aquafina";
    } else if (this.items[i].brandname.toLowerCase().indexOf('aquasure') != -1 || this.items[i].category.toLowerCase().indexOf('aquasure') != -1) {
      this.items[i]["pimage"] = "assets/imgs/aquasure";
      this.items[i]["product_img"] = "assets/imgs/aquasure";
    } else if (this.items[i].brandname.toLowerCase().indexOf('bailey') != -1 || this.items[i].category.toLowerCase().indexOf('bailey') != -1) {
      this.items[i]["pimage"] = "assets/imgs/bailley";
      this.items[i]["product_img"] = "assets/imgs/bailley";
    } else if (this.items[i].brandname.toLowerCase().indexOf('bailley') != -1 || this.items[i].category.toLowerCase().indexOf('bailley') != -1) {
      this.items[i]["pimage"] = "assets/imgs/bailley";
      this.items[i]["product_img"] = "assets/imgs/bailley";
    } else if (this.items[i].brandname.toLowerCase().indexOf('kinley') != -1 || this.items[i].category.toLowerCase().indexOf('kinley') != -1) {
      this.items[i]["pimage"] = "assets/imgs/kinley";
      this.items[i]["product_img"] = "assets/imgs/kinley";
    } else if (this.items[i].brandname.toLowerCase().indexOf('non') != -1 || this.items[i].category.toLowerCase().indexOf('non') != -1) {
      if (check) {
        if (Utils.USER_INFO_DATA && Utils.USER_INFO_DATA.dealers && Utils.USER_INFO_DATA.dealers.issuperdealer && Utils.USER_INFO_DATA.issuperdealer == 'true') {
          this.items[i]["pimage"] = "assets/imgs/nonisi";
          this.items[i]["product_img"] = "assets/imgs/nonisi";
        } else {
          this.items[i]["pimage"] = this.getService.getImg() + "product_" + this.items[i].productid;
          this.items[i]["product_img"] = this.getService.getImg() + "product_" + this.items[i].productid;
        }
      } else {
        this.items[i]["pimage"] = "assets/imgs/nonisi";
        this.items[i]["product_img"] = "assets/imgs/nonisi";
      }
    } else if (this.items[i].brandname.toLowerCase().indexOf('isi') != -1 || this.items[i].category.toLowerCase().indexOf('isi') != -1) {
      if (check) {
        if (Utils.USER_INFO_DATA && Utils.USER_INFO_DATA.dealers && Utils.USER_INFO_DATA.dealers.issuperdealer && Utils.USER_INFO_DATA.issuperdealer == 'true') {
          this.items[i]["pimage"] = "assets/imgs/isi";
          this.items[i]["product_img"] = "assets/imgs/isi";
        } else {
          this.items[i]["pimage"] = this.getService.getImg() + "product_" + this.items[i].productid;
          this.items[i]["product_img"] = this.getService.getImg() + "product_" + this.items[i].productid;
        }
      } else {
        this.items[i]["pimage"] = "assets/imgs/isi";
        this.items[i]["product_img"] = "assets/imgs/isi";
      }

    } else if (this.items[i].brandname.toLowerCase().indexOf('rich') != -1 || this.items[i].category.toLowerCase().indexOf('rich') != -1) {
      this.items[i]["pimage"] = "assets/imgs/hrich";
      this.items[i]["product_img"] = "assets/imgs/hrich";
    } else {
      this.items[i]["pimage"] = this.getService.getImg() + "product_" + this.items[i].productid;
      this.items[i]["product_img"] = this.getService.getImg() + "product_" + this.items[i].productid;
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

  private calTotalAmt() {
    this.totalamt = 0;
    this.totalitem = 0;
    for (let i = 0; i < this.brandProducts.length; i++) {
      this.totalitem = this.totalitem + this.brandProducts[i].count;
      this.totalamt = this.totalamt + (this.brandProducts[i].pcost * this.brandProducts[i].count);
    }
  }

  private fetchProducts() {
    this.getDataByAreaWise(true, false, "");
  }

  private getDataByAreaWise(isFirst: boolean, isRefresh: boolean, refresher) {

    try {
      this.totalamt = 0;
      this.totalitem = 0;
      let input = {
        "root": {
          "userid": "0",
          "dealerid": "0",
          "areaid": 0,
          "areaname": "Tolichowki",
          "pincode": "500008",
          "loginid": "0",
          "apptype": APP_TYPE,
          "usertype": APP_USER_TYPE,
          "areawise": "1"
        }
      };
      try {
        if (this.userLatlng && this.userLatlng.lat) {
          input.root["latitude"] = this.userLatlng.lat;
          input.root["longitude"] = this.userLatlng.lng;
        }
        if (this.userAddr) {
          var addr = this.userAddr;
          input.root["address"] = addr.trim();
        }
      } catch (e) {
        Utils.sLog(e);
      }


      let data = JSON.stringify(input);
      if (isFirst)
        this.showProgress = true;
      this.getService.postReq(this.getService.getAreaWiseProducts(), data).then(res => {
        if (res.result == RES_SUCCESS) {
          if (res.data) {
            this.alertUtils.showLog(res.data[0].products);
            this.items = res.data[0].products;
            this.brandProducts = [];
            for (let i = 0; i < this.items.length; i++) {
              if (this.items[i].product_cost && this.items[i].category && this.items[i].brandname) {
                this.items[i]["count"] = 0;
                this.items[i]["ptype"] = this.items[i].product_type;
                this.items[i]["pcost"] = this.items[i].product_cost;
                this.items[i]["pname"] = this.items[i].product_name;
                if (!this.items[i].stockstatus)
                  this.items[i].stockstatus = "available";
                if (!this.items[i].minorderqty) {
                  this.items[i].minorderqty = 1;
                }
                this.items[i]["emptycount"] = 0;
                this.items[i]["randomcolor"] = Utils.getRandomRolor();
                this.validateLocalImg(i, false);
                this.validateExistingCustomerProducts(i);
              }
            }
            this.alertUtils.showLog(this.brandProducts);
            this.modifyList();

            this.slides.slideTo(0, 100);
          }
        }
        this.hideProgress(isFirst, isRefresh, refresher);
      }
        ,
        err => {
          this.hideProgress(isFirst, isRefresh, refresher);
          this.alertUtils.showLog(err);
        }
      );
    } catch (e) {
      this.hideProgress(isFirst, isRefresh, refresher);
      this.alertUtils.showLog(e);
    }

  }

}
