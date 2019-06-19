import {ChangeDetectorRef, Component, ViewChild} from "@angular/core";
import { ModalController, NavController, NavParams, Platform, ViewController } from "ionic-angular";
import { APP_TYPE, APP_USER_TYPE, FRAMEWORK, MOBILE_TYPE, RES_SUCCESS, Utils } from "../../app/services/Utils";
import { GetService } from "../../app/services/get.servie";
import { OrderConfirmation } from "../OrderConfirmationDialog/orderconfirmation";

@Component({
  selector: 'confirm-pg-styles',
  templateUrl: 'ConfirmOrderPage.html'
})
export class ConfirmOrder {
  private proddata: any;
  savingProduct: any;
  productSelected: any;
  brandProducts: any;
  navBack: boolean = true;
  showEditProduct: boolean = false;
  @ViewChild('input') myInput;
  private totalItem: any;
  private totalCost: any;
  private proTotalCost: any;
  private addr: any;
  private calledfrom: any;
  private items: any;
  private isCloseClicked = false;
  private dateOfevent: string;
  private deliveryAddr: any;
  private landmark = "";
  private buildingName = "";
  private minDate: any = new Date().toISOString();
  private loginStatus: boolean = false;
  private dealerID = "";
  private userID = "";
  private title = "Confirm Order";
  private userLat: any;
  private userLng: any;
  private deliverySlot: any;
  private slot1: boolean = false;
  private slot2: boolean = false;
  private slot3: boolean = false;
  private slot4: boolean = false;
  private cHour: any;
  private date: any;
  private selectProducts = [];
  private serviceCharge = 0;
  private expDelCharge = 0;
  private advanceAmt = 0;
  private tAmount = 0;

  private totalAmount: any;
  private cbExpDel: boolean = false;
  private addrData: any;
  private increment: boolean = true;
  private model: any;
  private isModelActive: boolean = false;
  pickedDate: any;

  constructor(platform: Platform, private navCtrl: NavController, private modalCtrl: ModalController, private param: NavParams, private getService: GetService, private alertUtils: Utils, private viewCtrl: ViewController,private ref:ChangeDetectorRef) {

    platform.ready().then(() => {
      platform.registerBackButtonAction(() => this.alertUtils.showLog('backbutton'));
    })
  }

  editProduct() {
    this.showEditProduct = true;
    this.title = "Update Product";
  }

  ngOnInit() {
    try {
      this.alertUtils.getLoginState().then(res => {
        if (res) {
          this.loginStatus = res;
          this.alertUtils.getDealerId().then(res => {
            if (res) {
              this.dealerID = res
            }
          });
          this.alertUtils.getUserId().then(res => {
            if (res) {
              this.userID = res
            }
          });
          this.alertUtils.getUserInfo().then(res => {
            if (res)
              Utils.USER_INFO_DATA = res;
          }).catch(err => {
            this.alertUtils.showLog(err);
          });
        }
      }).catch(err => {
        this.alertUtils.showLog(err);
      });
      this.calledfrom = this.param.get('from');
      this.items = this.param.get('items');
      this.totalCost = this.param.get("totalAmount");
      this.totalItem = this.param.get("totalItems");
      this.deliveryAddr = this.param.get("addr");
      this.userLat = this.param.get("lat");
      this.userLng = this.param.get("lng");
      this.proddata = this.param.get("savingobj");

      console.log(this.proddata);

      if (Utils.datePicked) {
        console.log(Utils.datePicked);
        this.pickedDate = Utils.datePicked;
      }
      // car wash change
      this.items = [];
      this.tAmount = 0;
      this.totalItem = 0;

      for (let i = 0; i < Utils.productsList.length; i++) {
        const element = Utils.productsList[i];
        if (element.ischecked) {
          this.items.push(element);
          this.tAmount = this.tAmount + element.pcost;
          this.totalItem++;
        }
      }
      console.log(this.items);

      if (this.calledfrom == "reorder") {
        this.navBack = false;
        let oldData = this.param.get("orderdata");
        this.alertUtils.showLog(oldData);
        let obj = this.param.get("proddata");
        obj["count"] = +oldData.quantity;
        if (oldData.empty_cans && parseInt(oldData.empty_cans) > 0) {
          obj["emptycount"] = parseInt(oldData.empty_cans);
          obj["emptycan"] = true;
        } else {
          obj["emptycount"] = 0;
          obj["emptycan"] = false;
        }
        obj["randomcolor"] = Utils.getRandomRolor();
        if (obj.minorderqty) {
          if (obj.minorderqty > obj.count)
            obj.count = +obj.minorderqty;
        }
        // this.totalCost = obj.count * obj.pcost;
        // this.proTotalCost = obj.count * obj.pcost;
        // this.totalItem = obj.count;
        // this.validateLocalImg(obj);
        // this.brandProducts = [];
        // this.items = [];
        // this.items.push(obj);
        // let obj2 = {
        //   "brandname": "",
        //   "pname": "",
        //   "product_img": "",
        //   "pimage": "",
        //   "pcost": "",
        //   "count": 0,
        //   "color": "",
        //   "productid": 0,
        //   "minorderqty": 0,
        //   "category": "",
        //   "categoryid": 0,
        //   "emptycan": false,
        //   "emptycount": 0,
        //   "stockstatus": 'available',
        //   "products": []
        // };
        // obj2.brandname = obj.brandname;
        // obj2.pname = obj.pname;
        // obj2.product_img = obj.prodimg;
        // obj2.pcost = obj.pcost;
        // obj2.pimage = obj.pimg;
        // obj2.productid = obj.productid;
        // obj2.count = obj.count;
        // obj2.minorderqty = obj.minorderqty;
        // obj2.category = obj.category;
        // obj2.categoryid = obj.categoryid;
        // if (obj.stockstatus)
        //   obj.stockstatus = obj.stockstatus.toLowerCase();
        // obj2.products.push(obj);
        // this.brandProducts.push(obj2);
        this.brandProducts = [];
        this.brandProducts.push(obj);
        let data = obj.products.find(item => item.productid == oldData.prod_id);
        data["count"] = +oldData.quantity
        if (oldData.empty_cans && parseInt(oldData.empty_cans) > 0) {
          data["emptycount"] = parseInt(oldData.empty_cans);
          data["emptycan"] = true;
        } else {
          data["emptycount"] = 0;
          data["emptycan"] = false;
        }
        data["randomcolor"] = Utils.getRandomRolor();
        if (data.minorderqty) {
          if (data.minorderqty > data.count)
            data.count = +data.minorderqty;
        }
        this.totalCost = data.count * data.pcost;
        this.proTotalCost = data.count * data.pcost;
        this.totalItem = data.count;
        this.validateLocalImg(data);
        this.items = [];
        this.items.push(data);
        this.alertUtils.showLog(this.items);
        if (oldData.orderby_address)
          this.deliveryAddr = oldData.orderby_address;
        if (oldData.orderby_latitude) {
          this.userLat = oldData.orderby_latitude;
          this.userLng = oldData.orderby_longitude;
        }
        if (oldData.orderby_locality) {
          this.landmark = oldData.orderby_locality;
        }
        if (oldData.orderby_buildingname) {
          this.buildingName = oldData.orderby_buildingname;
        }

      }


      if (this.items) {
        this.serviceCharge = 0;
        this.expDelCharge = 0;
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].count > 0) {
            this.selectProducts.push(this.items[i]);
            if (this.items[i].servicecharge && this.items[i].servicecharge > 0) {
              this.serviceCharge = this.serviceCharge + (this.items[i].servicecharge * +this.items[i].count);
              this.alertUtils.showLog("Service charge" + this.items[i].servicecharge);
            }
            if (this.items[i].expressdeliverycharges && this.items[i].expressdeliverycharges > 0) {
              this.expDelCharge = this.expDelCharge + this.items[i].expressdeliverycharges;
              this.alertUtils.showLog("Express delivery" + this.items[i].expressdeliverycharges);
            }

            if (this.items[i].emptycan) {
              if (this.items[i].emptycount)
                if (this.items[i].emptycount == this.items[i].count) {
                  this.items[i]["mdemptycount"] = 0;
                } else {
                  this.items[i]["mdemptycount"] = this.items[i].count - this.items[i].emptycount;
                  this.advanceAmt = this.advanceAmt + ((this.items[i].count - this.items[i].emptycount) * 150);
                }
            } else {
              this.items[i]["mdemptycount"] = this.items[i].count;
              this.advanceAmt = this.advanceAmt + (this.items[i].count * 150);

            }
          }
        }
        this.alertUtils.showLog(this.selectProducts);
        this.alertUtils.showLog(" TOTAL Service charge" + this.serviceCharge);
        this.alertUtils.showLog(" TOTAL Express delivery" + this.expDelCharge);
        this.totalAmount = this.totalCost + this.serviceCharge + this.advanceAmt;
        this.alertUtils.showLog("Service charge" + this.serviceCharge);
      }
    } catch (e) {
      this.alertUtils.showLog(e);
    }
    this.dateOfevent = new Date().toISOString();
    this.date = new Date();
    this.cHour = this.date.getHours();
    if (this.date.toISOString().slice(0, 10) == this.dateOfevent.slice(0, 10)) {
      if (this.cHour < 16) {
      } else {
        this.date.setDate(this.date.getDate() + 1);
        this.minDate = this.date.toISOString();
        this.dateOfevent = this.date.toISOString();
      }
      if (this.cHour >= 0 && this.cHour < 7) {
        this.deliverySlot = "8AM-11AM";
        this.slot1 = false;
        this.slot2 = false;
        this.slot3 = false;
        this.slot4 = false;
      } else if (this.cHour >= 7 && this.cHour < 10) {
        this.slot1 = true;
        this.deliverySlot = "11AM-2PM";
        this.slot2 = false;
        this.slot3 = false;
        this.slot4 = false;
      } else if (this.cHour >= 10 && this.cHour < 13) {
        this.deliverySlot = "2PM-5PM";
        this.slot1 = true;
        this.slot2 = true;
        this.slot3 = false;
        this.slot4 = false;
      } else if (this.cHour >= 13 && this.cHour < 16) {
        this.deliverySlot = "5PM-8PM";
        this.slot1 = true;
        this.slot2 = true;
        this.slot3 = true;
        this.slot4 = false;
      } else {
        this.deliverySlot = "8AM-11AM";
        this.slot1 = false;
        this.slot2 = false;
        this.slot3 = false;
        this.slot4 = false;
      }
    }
    this.addrData = this.alertUtils.getAddrData();
    this.alertUtils.showLog(this.addrData);
    if (this.addrData) {
      if (this.addrData.landmark) {
        this.landmark = this.addrData.landmark;
      }
      if (this.addrData.buildingname) {
        this.buildingName = this.addrData.buildingname;
      }
    }

    this.ref.detectChanges();


  }

  emptyCanCheck(item) {
    console.log(1);
    // item.emptycount = item.count;
    // for (let i = 0; i < item.products.length; i++) {
    //   item.products[i].emptycount = item.emptycount;
    //   item.products[i].emptycan = item.emptycan;
    // }

    this.alertUtils.showLog(item.emptycan);
    if (item.emptycan && this.isModelActive == false) {

      item.emptycount = item.count;
      this.model = "";
      this.model = this.modalCtrl.create('EditemptycanPage', { item: item }, {
        showBackdrop: true,
        enableBackdropDismiss: true,
        cssClass: 'editemptycan'
      });
      this.model.onDidDismiss(data => {
        this.isModelActive = false;
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
      this.model.present().then(res => {
        this.isModelActive = true;
      });

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
      this.isModelActive = false;
    }
  }

  emptyCountChange(item) {
    this.alertUtils.showLog(item.emptycount);
    if (item.emptycount > item.count) {
      item.emptycount = item.count;
      this.alertUtils.showAlert("ALERT", "Empty can should not be greater then PRODUCT QUANTITY ,please change it", "OK");

    }
    this.alertUtils.showLog("after" + item.emptycount);
    for (let i = 0; i < item.products.length; i++) {
      item.products[i].emptycount = item.emptycount;
      item.products[i].emptycan = item.emptycan;
    }
  }

  qtyChangeListener(item) {
    if (!item.count) {
      item.count = 0;
    }
    this.totalItem = 0;
    this.proTotalCost = 0;
    this.productSelected = [];
    let pID: any;
    for (let i = 0; i < this.brandProducts.length; i++) {
      if (item.productid == this.brandProducts[i].productid) {
        if (item.count >= item.minorderqty) {
          this.brandProducts[i].count = item.count;
        } else {
          if (item.count != 0) {
            this.brandProducts[i].count = item.minorderqty;
            item.count = item.minorderqty;
          }
        }
      } else {
        this.brandProducts[i].count = 0;
      }
      this.totalItem = this.totalItem + this.brandProducts[i].count;
      this.proTotalCost = this.proTotalCost + (this.brandProducts[i].pcost * this.brandProducts[i].count);
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


  }

  viewItemMinus(item) {
    if (item.count > 0) {
      if (this.increment)
        item.count--;
      this.totalItem = 0;
      this.proTotalCost = 0;
      this.productSelected = item.products;
      let pID: any;
      for (let i = 0; i < this.brandProducts.length; i++) {
        if (item.productid == this.brandProducts[i].productid) {
          if (item.count >= item.minorderqty) {
            this.brandProducts[i].count = item.count;
          } else {
            this.brandProducts[i].count = 0;
            item.count = 0;
          }
        } else {
          this.brandProducts[i].count = 0;
        }
        this.totalItem = this.totalItem + this.brandProducts[i].count;
        this.proTotalCost = this.proTotalCost + (this.brandProducts[i].pcost * this.brandProducts[i].count);
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
    }
  }

  updateOrder() {
    if (this.proTotalCost > 0) {
      if (this.isModelActive) {
        this.closeEmptyDialog();
      } else {
        this.alertUtils.showLog("------------");
        this.alertUtils.showLog(this.brandProducts[0].emptycan);
        if (this.brandProducts[0].emptycan && this.brandProducts[0].emptycount > this.brandProducts[0].count) {
          this.alertUtils.showAlert("ALERT", "Empty can should not be greater then PRODUCT QUANTITY ,please change it", "OK");

        } else {

          this.alertUtils.showLog("update order");
          this.title = "Confirm Order";
          this.showEditProduct = false;
          this.items[0].count = this.brandProducts[0].count;
          this.items[0].emptycan = this.brandProducts[0].emptycan;
          this.items[0].emptycount = this.brandProducts[0].emptycount;

          if (this.items) {
            this.serviceCharge = 0;
            this.expDelCharge = 0;
            this.advanceAmt = 0;
            for (let i = 0; i < this.items.length; i++) {
              if (this.items[i].count > 0) {
                if (this.items[i].servicecharge && this.items[i].servicecharge > 0) {
                  this.serviceCharge = this.serviceCharge + (this.items[i].servicecharge * this.items[i].count);
                  this.alertUtils.showLog("Service charge" + this.items[i].servicecharge);
                }
                if (this.items[i].expressdeliverycharges && this.items[i].expressdeliverycharges > 0) {
                  this.expDelCharge = this.expDelCharge + this.items[i].expressdeliverycharges;
                  this.alertUtils.showLog("Express delivery" + this.items[i].expressdeliverycharges);
                }

                if (this.items[i].emptycan) {
                  if (this.items[i].emptycount)
                    if (this.items[i].emptycount == this.items[i].count) {
                      this.items[i]["mdemptycount"] = 0;
                    } else {
                      this.items[i]["mdemptycount"] = this.items[i].count - this.items[i].emptycount;
                      this.advanceAmt = this.advanceAmt + ((this.items[i].count - this.items[i].emptycount) * 150);
                    }
                } else {
                  this.items[i]["mdemptycount"] = this.items[i].count;
                  this.advanceAmt = this.advanceAmt + (this.items[i].count * 150);

                }
              }
            }
            this.alertUtils.showLog(this.selectProducts);
            this.alertUtils.showLog(" TOTAL Service charge" + this.serviceCharge);
            this.alertUtils.showLog(" TOTAL Express delivery" + this.expDelCharge);
            this.totalAmount = this.proTotalCost + this.serviceCharge + this.advanceAmt;
            this.alertUtils.showLog("Service charge" + this.serviceCharge);
          }
        }
      }
    } else {
      this.alertUtils.showToast('Please select atleast 1 product');
    }
  }

  viewItemPlus(item) {
    if (this.increment)
      item.count++;
    this.totalItem = 0;
    this.proTotalCost = 0;
    let dataPicked = false;
    this.productSelected = item.products;
    let pID: any;
    // this.pickProduct(item, dataPicked, pID);
    for (let i = 0; i < this.brandProducts.length; i++) {
      if (item.productid == this.brandProducts[i].productid) {
        if (item.count >= item.minorderqty) {
          this.brandProducts[i].count = item.count;
        } else {
          this.brandProducts[i].count = item.minorderqty;
          item.count = item.minorderqty;
        }
      } else {
        this.brandProducts[i].count = 0;
      }
      this.totalItem = this.totalItem + this.brandProducts[i].count;
      this.proTotalCost = this.proTotalCost + (this.brandProducts[i].pcost * this.brandProducts[i].count);
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

  }

  changeImage(item) {
    console.log("change image called");
    item.product_img = "";
    if (item.brandname.toLowerCase().indexOf('non-') != -1) {
      item.product_img = "assets/imgs/nonisi";
      item.pimage = "assets/imgs/nonisi";
    } else if (item.brandname.toLowerCase().indexOf('isi') != -1) {
      item.product_img = "assets/imgs/isi";
      item.pimage = "assets/imgs/isi";
    }
  }

  validateLocalImg(items) {
    if (items.brandname.toLowerCase().indexOf('bisleri') != -1 || items.category.toLowerCase().indexOf('bisleri') != -1) {
      items["prodimg"] = "assets/imgs/bisleri";
      items["pimg"] = "assets/imgs/bisleri";
    } else if (items.brandname.toLowerCase().indexOf('aquafina') != -1 || items.category.toLowerCase().indexOf('aquafina') != -1) {
      items["prodimg"] = "assets/imgs/aquafina";
      items["pimg"] = "assets/imgs/aquafina";
    } else if (items.brandname.toLowerCase().indexOf('aquasure') != -1 || items.category.toLowerCase().indexOf('aquasure') != -1) {
      items["prodimg"] = "assets/imgs/aquasure";
      items["pimg"] = "assets/imgs/aquasure";
    } else if (items.brandname.toLowerCase().indexOf('bailey') != -1 || items.category.toLowerCase().indexOf('bailey') != -1) {
      items["prodimg"] = "assets/imgs/bailley";
      items["pimg"] = "assets/imgs/bailley";
    } else if (items.brandname.toLowerCase().indexOf('bailley') != -1 || items.category.toLowerCase().indexOf('bailley') != -1) {
      items["prodimg"] = "assets/imgs/bailley";
      items["pimg"] = "assets/imgs/bailley";
    } else if (items.brandname.toLowerCase().indexOf('kinley') != -1 || items.category.toLowerCase().indexOf('kinley') != -1) {
      items["prodimg"] = "assets/imgs/kinley";
      items["pimg"] = "assets/imgs/kinley";
    } else if (items.brandname.toLowerCase().indexOf('non') != -1 || items.category.toLowerCase().indexOf('non') != -1) {
      if (Utils.USER_INFO_DATA && Utils.USER_INFO_DATA.dealers && Utils.USER_INFO_DATA.dealers.issuperdealer && Utils.USER_INFO_DATA.dealers.issuperdealer == 'true') {
        items["prodimg"] = "assets/imgs/nonisi";
        items["pimg"] = "assets/imgs/nonisi";
      } else {
        items["prodimg"] = this.getService.getImg() + "product_" + items.productid;
      }
    } else if (items.brandname.toLowerCase().indexOf('isi') != -1 || items.category.toLowerCase().indexOf('isi') != -1) {
      if (Utils.USER_INFO_DATA && Utils.USER_INFO_DATA.dealers && Utils.USER_INFO_DATA.dealers.issuperdealer && Utils.USER_INFO_DATA.dealers.issuperdealer == 'true') {
        items["prodimg"] = "assets/imgs/isi";
        items["pimg"] = "assets/imgs/isi";
      } else {
        items["prodimg"] = this.getService.getImg() + "product_" + items.productid;
      }
    } else if (items.pimg) {
      items["prodimg"] = this.getService.getImg() + "product_" + items.productid;
    }
  }

  checkClick() {
    if (this.cbExpDel) {
      this.totalAmount = this.totalAmount + this.expDelCharge;
    } else {
      this.totalAmount = this.totalAmount - this.expDelCharge;
    }
  }

  editAddr() {
    let model = this.modalCtrl.create('EditAddressPage', {
      addr: this.deliveryAddr,
      landmark: this.landmark,
      buildingname: this.buildingName

    }, {
        showBackdrop: true,
        enableBackdropDismiss: true,
        cssClass: 'editaddr'
      });
    model.present();
    model.onDidDismiss(data => {
      if (data) {
        this.alertUtils.showLog(data);
        this.deliveryAddr = data.addr;
        this.landmark = data.landmark;
        this.buildingName = data.buildingname;
      }
    });
  }

  delDateChange() {
    try {
      this.deliverySlot = "";
      this.date = new Date();
      this.cHour = this.date.getHours();
      if (this.date.toISOString().slice(0, 10) == this.dateOfevent.slice(0, 10)) {
        if (this.cHour < 16) {
        } else {
          this.date.setDate(this.date.getDate() + 1);
          this.minDate = this.date.toISOString();
          this.dateOfevent = this.date.toISOString();
        }
        if (this.cHour >= 0 && this.cHour < 7) {
          this.deliverySlot = "8AM-11AM";
          this.slot1 = false;
          this.slot2 = false;
          this.slot3 = false;
          this.slot4 = false;
        } else if (this.cHour >= 7 && this.cHour < 10) {
          this.slot1 = true;
          this.deliverySlot = "11AM-2PM";
          this.slot2 = false;
          this.slot3 = false;
          this.slot4 = false;
        } else if (this.cHour >= 10 && this.cHour < 13) {
          this.deliverySlot = "2PM-5PM";
          this.slot1 = true;
          this.slot2 = true;
          this.slot3 = false;
          this.slot4 = false;
        } else if (this.cHour >= 13 && this.cHour < 16) {
          this.deliverySlot = "5PM-8PM";
          this.slot1 = true;
          this.slot2 = true;
          this.slot3 = true;
          this.slot4 = false;
        } else {
          this.deliverySlot = "8AM-11AM";
          this.slot1 = false;
          this.slot2 = false;
          this.slot3 = false;
          this.slot4 = false;
        }
      } else {
        this.deliverySlot = "8AM-11AM";
        this.slot1 = false;
        this.slot2 = false;
        this.slot3 = false;
        this.slot4 = false;
      }
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  goBack() {
    if (!this.showEditProduct) {
      this.viewCtrl.dismiss();
    } else {
      this.showEditProduct = false;
    }
  }

  placeOrder() {
    if (this.alertUtils.validateText(this.deliveryAddr, "Delivery Address", 5, 500)) {
      if (this.dateOfevent) {
        if (this.deliverySlot) {
          this.placeOrderTask();
        } else {
          this.alertUtils.showToast("Please select availability slot");
        }
      } else {
        this.alertUtils.showToast("Please select delivery time");
      }
    } else {
      this.alertUtils.showToast(this.alertUtils.ERROR_MES);
    }
  }

  showConfirmationDialog(orderResult) {
    if (this.calledfrom == "reorder") {
      let model = this.modalCtrl.create(OrderConfirmation, {
        "from": "reorder",
        "items": this.selectProducts,
        "addr": this.deliveryAddr,
        "totalAmount": this.tAmount,
        "totalItems": this.totalItem,
        "servicecharge": this.serviceCharge,
        "expressdelivery": this.expDelCharge,
        "isExpdelivery": this.cbExpDel,
        "orderResult": orderResult
      });
      model.onDidDismiss(data => {
        this.viewCtrl.dismiss(data);
      });
      model.present();


    } else {
      this.navCtrl.push(OrderConfirmation, {
        "from": "confirmorderpage",
        "items": this.selectProducts,
        "addr": this.deliveryAddr,
        "totalAmount": this.tAmount,
        "totalItems": this.totalItem,
        "servicecharge": this.serviceCharge,
        "expressdelivery": this.expDelCharge,
        "isExpdelivery": this.cbExpDel,
        "orderResult": orderResult
      });
    }
  }

  cancel() {
    if (!this.calledfrom || this.calledfrom == "reorder") {
      this.viewCtrl.dismiss();
    } else {
      // this.navCtrl.push(TabsPage, { from: "confirmorder" }).then(res => {
      //   const index = this.viewCtrl.index;
      //   // then we remove it from the navigation stack
      //   this.navCtrl.remove(index);
      //   this.navCtrl.remove(index - 1);
      // });
    }
  }

  private placeOrderTask() {

    /**
     * {
    "order": {
      "quantity": "1",
      "category": "Bakerys",
      "categoryid": "6",
      "mrp": "120",
      "paymentmode": "cash",
      "orderto": "17",
      "orderfrom": "55",
      "productid": "69",
      "product_quantity": "10 bread",
      "product_type": "Bread",
      "orderstatus": "ordered",
      "product_cost": "100",
      "amt": "100.00",
      "excepted_time": "03-04-2019",
      "loginid": "55",
      "total_items": "6",
      "total_saving": 145,
      "service_charge": "100",
      "total_amt": "1825.0",
      "apptype": "grocery",
      "delivery_address": "8-1-301 & 302, Shaikpet Rd, AP Animal Husbandry Employees Colony, Shaikpet, Hyderabad, Telangana 500008, India, Shaikpet Road",
      "charity_option": "Education"
    }
  }
     *
     *
     *  */
    try {
      this.selectProducts = this.items;
      let result = [];
      for (let i = 0; i < this.selectProducts.length; i++) {
        if (this.selectProducts[i].ischecked) {
          let order = {}, Obj1 = {};
          order["mobiletype"] = MOBILE_TYPE;
          order["framework"] = FRAMEWORK;
          if (Utils.rideSelected && Utils.rideSelected.id) {
            order["rideid"] = Utils.rideSelected.id;
          }

          order["category"] = this.selectProducts[i].category;
          order["categoryid"] = this.selectProducts[i].categoryid;

          order["quantity"] = 1;
          order["product_type"] = this.selectProducts[i].brandname;
          order["product_quantity"] = this.selectProducts[i].ptype;
          order["product_cost"] = this.selectProducts[i].pcost;
          order["amt"] = this.selectProducts[i].pcost * 1;
          order["productid"] = this.selectProducts[i].productid;

          order["total_items"] = this.totalItem;
          order["total_amt"] = this.tAmount;
          order["delivery_address"] = this.deliveryAddr;
          order["delivery_latitude"] = this.userLat;
          order["delivery_longitude"] = this.userLng;
          //order["excepted_time"] = Utils.formatDateToDDMMYYYY(this.dateOfevent) + " " + this.deliverySlot;
          if (this.selectProducts[i].servicecharge && this.selectProducts[i].servicecharge > 0) {
            order["servicecharge"] = (this.selectProducts[i].servicecharge * this.selectProducts[i].count);
          }
          if (this.cbExpDel) {
            order["expressdelivery"] = "true";
            if (this.selectProducts[i].expressdeliverycharges && this.selectProducts[i].expressdeliverycharges > 0) {
              order["expressdeliverycharges"] = this.selectProducts[i].expressdeliverycharges;
            }
          } else {
            order["expressdelivery"] = "false";
          }
          if (this.landmark) {
            order["delivery_locality"] = this.landmark;
          }
          if (this.buildingName) {
            order["delivery_buildingname"] = this.buildingName;
          }

          if (this.dateOfevent) {
            let slotDate = "";
            if (this.deliverySlot == "8AM-11AM") {
              slotDate = Utils.formatDateToYYYYMMDD(this.dateOfevent) + " 11:00:00"
            } else if (this.deliverySlot == "11AM-2PM") {
              slotDate = Utils.formatDateToYYYYMMDD(this.dateOfevent) + " 14:00:00"
            } else if (this.deliverySlot == "2PM-5PM") {
              slotDate = Utils.formatDateToYYYYMMDD(this.dateOfevent) + " 17:00:00"
            } else if (this.deliverySlot == "5PM-8PM") {
              slotDate = Utils.formatDateToYYYYMMDD(this.dateOfevent) + " 20:00:00"
            }
            if (slotDate)
              order["slotdate"] = slotDate;
          }
          if (this.pickedDate)
            order["excepted_time"] = this.pickedDate;
          else
            order["excepted_time"] = Utils.formatDateToDDMMYYYY(this.dateOfevent);

          order["paymentmode"] = "cash";
          order["orderstatus"] = "ordered";
          order["orderfrom"] = Utils.USER_INFO_DATA.userid;
          order["orderto"] = Utils.USER_INFO_DATA.superdealerid;
          order["orderthrough"] = FRAMEWORK + MOBILE_TYPE;
          order["userid"] = Utils.USER_INFO_DATA.userid;
          order["loginid"] = Utils.USER_INFO_DATA.userid;
          order["user_type"] = APP_USER_TYPE;
          order["apptype"] = APP_TYPE;
          Obj1["order"] = order;
          result.push(Obj1);
        }
      }
      let data = JSON.stringify(result);
      this.alertUtils.showLog(result);
      this.alertUtils.showLoading();
      this.getService.postReq(this.getService.placeOrder(), data).then(res => {
        this.alertUtils.hideLoading();
        this.alertUtils.showLog(res);
        if (res.result == RES_SUCCESS) {
          if (res.data) {
            Utils.productsList = [];
            Utils.datePicked = "";
            this.showConfirmationDialog(res)
          } else {
            this.alertUtils.showToast("Something went wrong please try again later");
          }
        } else {
          this.alertUtils.showToast("Something went wrong please try again later");
        }
      }, err => {
        this.alertUtils.hideLoading();
        this.alertUtils.showToast(this.alertUtils.GEN_ERR_MSG);
        this.alertUtils.showLog(err);
      });
    } catch (e) {
      this.alertUtils.hideLoading();
      this.alertUtils.showLog(e);
    }
  }
}
