import { Component } from "@angular/core";
import { NavController, NavParams, ViewController, IonicPage } from "ionic-angular";
import {
  APP_TYPE,
  APP_USER_TYPE,
  INTERNET_ERR_MSG,
  RES_SUCCESS,
  TRY_AGAIN_ERR_MSG,
  Utils
} from "../../app/services/Utils";
import { GetService } from "../../app/services/get.servie";
import { TranslateService } from "@ngx-translate/core";
@IonicPage()
@Component({
  selector: 'edit-schedule-page',
  templateUrl: 'EditScheduleOrder.html'
})
export class EditScheduleOrderPage {
  selectProd: any;
  showWeekDays = true;
  scheduleTypeSel: any;
  cbSun: boolean = false;
  cbMon: boolean = false;
  cbTue: boolean = false;
  cbWed: boolean = false;
  cbThur: boolean = false;
  cbFri: boolean = false;
  cbSat: boolean = false;
  cbDay1: boolean = false;
  cbDay2: boolean = false;
  cbDay3: boolean = false;
  cbDay4: boolean = false;
  cbDay5: boolean = false;
  cbDay6: boolean = false;
  cbDay7: boolean = false;
  cbDay8: boolean = false;
  cbDay9: boolean = false;
  cbDay10: boolean = false;
  cbDay11: boolean = false;
  cbDay12: boolean = false;
  cbDay13: boolean = false;
  cbDay14: boolean = false;
  cbDay15: boolean = false;
  cbDay16: boolean = false;
  cbDay17: boolean = false;
  cbDay18: boolean = false;
  cbDay19: boolean = false;
  cbDay20: boolean = false;
  cbDay21: boolean = false;
  cbDay22: boolean = false;
  cbDay23: boolean = false;
  cbDay24: boolean = false;
  cbDay25: boolean = false;
  cbDay26: boolean = false;
  cbDay27: boolean = false;
  cbDay28: boolean = false;
  cbDay29: boolean = false;
  cbDay30: boolean = false;
  cbAllWeek: boolean = false;
  cbAllDays: boolean = false;
  allDays = "";
  allWeek = "";
  private scheduleId = "";
  private calledfrom: any;
  private oldItems: any;
  private deliverySlot: any;
  private items = [];
  private totalamt = 0;
  private totalitem = 0;
  private loginStatus: boolean = false;
  private dealerID;
  private userID;
  private showProgress = true;
  private selQuantity: any;
  private pageTitle: string = "Schedule";
  private cbExpDel: boolean = false;

  constructor(private translateService: TranslateService, private apiService: GetService, private alertUtils: Utils, private navCtrl: NavController, private param: NavParams, private viewCtrl: ViewController) {
    try {
      translateService.setDefaultLang('en');
      translateService.use('en');
     this.userID = "5";
     this.dealerID = "289";
      this.getData();
      this.calledfrom = this.param.get('from');
      if (this.calledfrom == "edit") {
        this.pageTitle = "Update Schedule";
      } else {
        this.pageTitle = "Create Schedule";
      }
      this.oldItems = this.param.get('items');
      this.alertUtils.showLog(this.oldItems);
      if (this.oldItems) {
        this.deliverySlot = this.oldItems.delivery_exceptedtime;
        this.selQuantity = this.oldItems.quantity;
        this.scheduleId = this.oldItems.id;
        if (this.oldItems.scheduletype) {
          this.scheduleTypeSel = this.oldItems.scheduletype.toLowerCase();
          if (this.scheduleTypeSel == 'weekdays') {
            if (this.oldItems.weekdays.indexOf("sunday") > -1)
              this.cbSun = true;
            if (this.oldItems.weekdays.indexOf("monday") > -1)
              this.cbMon = true;
            if (this.oldItems.weekdays.indexOf("tuesday") > -1)
              this.cbTue = true;
            if (this.oldItems.weekdays.indexOf("wednesday") > -1)
              this.cbWed = true;
            if (this.oldItems.weekdays.indexOf("thursday") > -1)
              this.cbThur = true;
            if (this.oldItems.weekdays.indexOf("friday") > -1)
              this.cbFri = true;
            if (this.oldItems.weekdays.indexOf("saturday") > -1)
              this.cbSat = true;
          } else {
            if (this.oldItems.days) {
              let selDays = this.oldItems.days;
              let array = selDays.split(',');
              if (array.length > 0) {
                for (let i = 0; i < array.length; i++) {
                  if (array[i] == "1")
                    this.cbDay1 = true;
                  if (array[i] == "2")
                    this.cbDay2 = true;
                  if (array[i] == "3")
                    this.cbDay3 = true;
                  if (array[i] == "4")
                    this.cbDay4 = true;
                  if (array[i] == "5")
                    this.cbDay5 = true;
                  if (array[i] == "6")
                    this.cbDay6 = true;
                  if (array[i] == "7")
                    this.cbDay7 = true;
                  if (array[i] == "8")
                    this.cbDay8 = true;
                  if (array[i] == "9")
                    this.cbDay9 = true;
                  if (array[i] == "10")
                    this.cbDay10 = true;
                  if (array[i] == "11")
                    this.cbDay11 = true;
                  if (array[i] == "12")
                    this.cbDay12 = true;
                  if (array[i] == "13")
                    this.cbDay13 = true;
                  if (array[i] == "14")
                    this.cbDay14 = true;
                  if (array[i] == "15")
                    this.cbDay15 = true;
                  if (array[i] == "16")
                    this.cbDay16 = true;
                  if (array[i] == "17")
                    this.cbDay17 = true;
                  if (array[i] == "18")
                    this.cbDay18 = true;
                  if (array[i] == "19")
                    this.cbDay19 = true;
                  if (array[i] == "20")
                    this.cbDay20 = true;
                  if (array[i] == "21")
                    this.cbDay21 = true;
                  if (array[i] == "22")
                    this.cbDay22 = true;
                  if (array[i] == "23")
                    this.cbDay23 = true;
                  if (array[i] == "24")
                    this.cbDay24 = true;
                  if (array[i] == "25")
                    this.cbDay25 = true;
                  if (array[i] == "26")
                    this.cbDay26 = true;
                  if (array[i] == "27")
                    this.cbDay27 = true;
                  if (array[i] == "28")
                    this.cbDay28 = true;
                  if (array[i] == "29")
                    this.cbDay29 = true;
                  if (array[i] == "30")
                    this.cbDay30 = true;
                }
              }
            }
          }
        }
      }
      this.alertUtils.showLog(this.deliverySlot);
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  checkQty() {
    if (this.selQuantity) {
      if (this.selectProd && this.selectProd.minorderqty && this.selectProd.minorderqty > 0)
        if (this.selQuantity >= this.selectProd.minorderqty) {
          // this.items[i].count = selectProd.count;
        } else {
          this.selQuantity = this.selectProd.minorderqty;
        }
    }
  }

  ngOnInit() {
    try {
      this.fetchProducts();
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  onChangeSchedule() {
    this.alertUtils.showLog(this.scheduleTypeSel);
    if (this.scheduleTypeSel == "days") {
      this.allWeek = "";
      this.showWeekDays = false;
      this.cbSun = false;
      this.cbMon = false;
      this.cbTue = false;
      this.cbWed = false;
      this.cbThur = false;
      this.cbFri = false;
      this.cbSat = false;
      this.cbAllWeek = false;
    }
    else {
      this.allDays = "";
      this.showWeekDays = true;
      this.cbAllDays = false;
      this.cbDay1 = false;
      this.cbDay2 = false;
      this.cbDay3 = false;
      this.cbDay4 = false;
      this.cbDay5 = false;
      this.cbDay6 = false;
      this.cbDay7 = false;
      this.cbDay8 = false;
      this.cbDay9 = false;
      this.cbDay10 = false;
      this.cbDay11 = false;
      this.cbDay12 = false;
      this.cbDay13 = false;
      this.cbDay14 = false;
      this.cbDay15 = false;
      this.cbDay16 = false;
      this.cbDay17 = false;
      this.cbDay18 = false;
      this.cbDay19 = false;
      this.cbDay20 = false;
      this.cbDay21 = false;
      this.cbDay22 = false;
      this.cbDay23 = false;
      this.cbDay24 = false;
      this.cbDay25 = false;
      this.cbDay26 = false;
      this.cbDay27 = false;
      this.cbDay28 = false;
      this.cbDay29 = false;
      this.cbDay30 = false;
    }
    this.alertUtils.showLog(this.showWeekDays);
  }

  logChosen() {
    this.alertUtils.showLog(this.selectProd);
  }

  selAllWeek() {
    console.log(this.cbAllWeek);
    this.cbSun = this.cbAllWeek;
    this.cbMon = this.cbAllWeek;
    this.cbTue = this.cbAllWeek;
    this.cbWed = this.cbAllWeek;
    this.cbThur = this.cbAllWeek;
    this.cbFri = this.cbAllWeek;
    this.cbSat = this.cbAllWeek;
  }

  selAllDays() {
    this.alertUtils.showLog(this.cbAllDays);
    this.cbDay1 = this.cbAllDays;
    this.cbDay2 = this.cbAllDays;
    this.cbDay3 = this.cbAllDays;
    this.cbDay4 = this.cbAllDays;
    this.cbDay5 = this.cbAllDays;
    this.cbDay6 = this.cbAllDays;
    this.cbDay7 = this.cbAllDays;
    this.cbDay8 = this.cbAllDays;
    this.cbDay9 = this.cbAllDays;
    this.cbDay10 = this.cbAllDays;
    this.cbDay11 = this.cbAllDays;
    this.cbDay12 = this.cbAllDays;
    this.cbDay13 = this.cbAllDays;
    this.cbDay14 = this.cbAllDays;
    this.cbDay15 = this.cbAllDays;
    this.cbDay16 = this.cbAllDays;
    this.cbDay17 = this.cbAllDays;
    this.cbDay18 = this.cbAllDays;
    this.cbDay19 = this.cbAllDays;
    this.cbDay20 = this.cbAllDays;
    this.cbDay21 = this.cbAllDays;
    this.cbDay22 = this.cbAllDays;
    this.cbDay23 = this.cbAllDays;
    this.cbDay24 = this.cbAllDays;
    this.cbDay25 = this.cbAllDays;
    this.cbDay26 = this.cbAllDays;
    this.cbDay27 = this.cbAllDays;
    this.cbDay28 = this.cbAllDays;
    this.cbDay29 = this.cbAllDays;
    this.cbDay30 = this.cbAllDays;
  }


  goBack() {
    this.navCtrl.pop();
  }

  validateScheduleType() {
    if (this.scheduleTypeSel == "weekdays") {
      if (this.cbSun || this.cbMon || this.cbTue || this.cbWed || this.cbThur || this.cbFri || this.cbSat) {
        this.allWeek = "";
        if (this.cbSun) {
          if (this.allWeek == "")
            this.allWeek = this.allWeek + "sunday";
          else
            this.allWeek = this.allWeek + ",sunday";
        }
        if (this.cbMon) {
          if (this.allWeek == "")
            this.allWeek = this.allWeek + "monday";
          else
            this.allWeek = this.allWeek + ",monday";
        }
        if (this.cbTue) {
          if (this.allWeek == "")
            this.allWeek = this.allWeek + "tuesday";
          else
            this.allWeek = this.allWeek + ",tuesday";
        }
        if (this.cbWed) {
          if (this.allWeek == "")
            this.allWeek = this.allWeek + "wednesday";
          else
            this.allWeek = this.allWeek + ",wednesday";
        }
        if (this.cbThur) {
          if (this.allWeek == "")
            this.allWeek = this.allWeek + "thursday";
          else
            this.allWeek = this.allWeek + ",thursday";
        }
        if (this.cbFri) {
          if (this.allWeek == "")
            this.allWeek = this.allWeek + "friday";
          else
            this.allWeek = this.allWeek + ",friday";
        }
        if (this.cbSat) {
          if (this.allWeek == "")
            this.allWeek = this.allWeek + "saturday";
          else
            this.allWeek = this.allWeek + ",saturday";
        }
        this.alertUtils.showLog(this.allWeek);
        return true;
      } else {
        this.alertUtils.showToast("Please select atleast one weekday");
        return false;
      }
    } else if (this.scheduleTypeSel == "days") {
      if (this.cbDay1 || this.cbDay2 || this.cbDay3 || this.cbDay4 || this.cbDay5 ||
        this.cbDay6 || this.cbDay7 || this.cbDay8 || this.cbDay9 ||
        this.cbDay10 || this.cbDay11 || this.cbDay12 || this.cbDay13 ||
        this.cbDay14 || this.cbDay15 || this.cbDay16 || this.cbDay17 ||
        this.cbDay18 || this.cbDay19 || this.cbDay20 || this.cbDay21 ||
        this.cbDay22 || this.cbDay23 || this.cbDay24 || this.cbDay25 ||
        this.cbDay26 || this.cbDay27 || this.cbDay28 || this.cbDay29 ||
        this.cbDay30) {
        this.allDays = "";
        if (this.cbDay1) {
          if (this.allDays == "")
            this.allDays = this.allDays + "1";
          else
            this.allDays = this.allDays + ",1";
        }
        if (this.cbDay2) {
          if (this.allDays == "")
            this.allDays = this.allDays + "2";
          else
            this.allDays = this.allDays + ",2";
        }
        if (this.cbDay3) {
          if (this.allDays == "")
            this.allDays = this.allDays + "3";
          else
            this.allDays = this.allDays + ",3";
        }
        if (this.cbDay4) {
          if (this.allDays == "")
            this.allDays = this.allDays + "4";
          else
            this.allDays = this.allDays + ",4";
        }
        if (this.cbDay5) {
          if (this.allDays == "")
            this.allDays = this.allDays + "5";
          else
            this.allDays = this.allDays + ",5";
        }
        if (this.cbDay6) {
          if (this.allDays == "")
            this.allDays = this.allDays + "6";
          else
            this.allDays = this.allDays + ",6";
        }
        if (this.cbDay7) {
          if (this.allDays == "")
            this.allDays = this.allDays + "7";
          else
            this.allDays = this.allDays + ",7";
        }
        if (this.cbDay8) {
          if (this.allDays == "")
            this.allDays = this.allDays + "8";
          else
            this.allDays = this.allDays + ",8";
        }
        if (this.cbDay9) {
          if (this.allDays == "")
            this.allDays = this.allDays + "9";
          else
            this.allDays = this.allDays + ",9";
        }
        if (this.cbDay10) {
          if (this.allDays == "")
            this.allDays = this.allDays + "10";
          else
            this.allDays = this.allDays + ",10";
        }
        if (this.cbDay11) {
          if (this.allDays == "")
            this.allDays = this.allDays + "11";
          else
            this.allDays = this.allDays + ",11";
        }
        if (this.cbDay12) {
          if (this.allDays == "")
            this.allDays = this.allDays + "12";
          else
            this.allDays = this.allDays + ",12";
        }
        if (this.cbDay13) {
          if (this.allDays == "")
            this.allDays = this.allDays + "13";
          else
            this.allDays = this.allDays + ",13";
        }
        if (this.cbDay14) {
          if (this.allDays == "")
            this.allDays = this.allDays + "14";
          else
            this.allDays = this.allDays + ",14";
        }
        if (this.cbDay15) {
          if (this.allDays == "")
            this.allDays = this.allDays + "15";
          else
            this.allDays = this.allDays + ",15";
        }
        if (this.cbDay16) {
          if (this.allDays == "")
            this.allDays = this.allDays + "16";
          else
            this.allDays = this.allDays + ",16";
        }
        if (this.cbDay17) {
          if (this.allDays == "")
            this.allDays = this.allDays + "17";
          else
            this.allDays = this.allDays + ",17";
        }
        if (this.cbDay18) {
          if (this.allDays == "")
            this.allDays = this.allDays + "18";
          else
            this.allDays = this.allDays + ",18";
        }
        if (this.cbDay19) {
          if (this.allDays == "")
            this.allDays = this.allDays + "19";
          else
            this.allDays = this.allDays + ",19";
        }
        if (this.cbDay20) {
          if (this.allDays == "")
            this.allDays = this.allDays + "20";
          else
            this.allDays = this.allDays + ",20";
        }
        if (this.cbDay21) {
          if (this.allDays == "")
            this.allDays = this.allDays + "21";
          else
            this.allDays = this.allDays + ",21";
        }
        if (this.cbDay22) {
          if (this.allDays == "")
            this.allDays = this.allDays + "22";
          else
            this.allDays = this.allDays + ",22";
        }
        if (this.cbDay23) {
          if (this.allDays == "")
            this.allDays = this.allDays + "23";
          else
            this.allDays = this.allDays + ",23";
        }
        if (this.cbDay24) {
          if (this.allDays == "")
            this.allDays = this.allDays + "24";
          else
            this.allDays = this.allDays + ",24";
        }
        if (this.cbDay25) {
          if (this.allDays == "")
            this.allDays = this.allDays + "25";
          else
            this.allDays = this.allDays + ",25";
        }
        if (this.cbDay26) {
          if (this.allDays == "")
            this.allDays = this.allDays + "26";
          else
            this.allDays = this.allDays + ",26";
        }
        if (this.cbDay27) {
          if (this.allDays == "")
            this.allDays = this.allDays + "27";
          else
            this.allDays = this.allDays + ",27";
        }
        if (this.cbDay28) {
          if (this.allDays == "")
            this.allDays = this.allDays + "28";
          else
            this.allDays = this.allDays + ",28";
        }
        if (this.cbDay29) {
          if (this.allDays == "")
            this.allDays = this.allDays + "29";
          else
            this.allDays = this.allDays + ",29";
        }
        if (this.cbDay30) {
          if (this.allDays == "")
            this.allDays = this.allDays + "30";
          else
            this.allDays = this.allDays + ",30";
        }
        this.alertUtils.showLog(this.allDays);
        return true;
      } else {
        this.alertUtils.showToast("Please select atleast one day");
        return false;
      }
    } else {
      this.alertUtils.showToast("Please select schedule type");
      return false;
    }
  }

  updateScheduleOrder() {
    try {
      if (this.selectProd) {
        if (this.deliverySlot) {
          if (this.selQuantity) {
            if (this.alertUtils.validateNumber(this.selQuantity.toString(), "Quantity", 1, 3)) {
              if (!this.alertUtils.isValidQty(this.selQuantity)) {
                let qty = parseInt(this.selQuantity);
                if (qty > 0) {
                  this.alertUtils.showLog(qty);
                  if (this.validateScheduleType()) {
                    this.alertUtils.showLog(this.scheduleTypeSel);
                    this.alertUtils.showLog("inside");
                    if (this.allDays == "") {
                      this.allDays = "";
                    }
                    if (this.allWeek == "") {
                      this.allWeek = "";
                    }
                    let input = {
                      "order": {
                        "apptype": APP_TYPE,
                        "excepted_time": this.deliverySlot,
                        "orderstatus": "ordered",
                        "orderto": this.dealerID,
                        "orderfrom": this.userID,
                        "paymentmode": "cash",
                        "usertype": APP_USER_TYPE,
                        "quantity": qty,
                        "loginid": this.userID,
                        "groupid": this.userID,
                        "productid": this.selectProd.productid,
                        "product_type": this.selectProd.brandname,
                        "product_quantity": this.selectProd.ptype,
                        "weekdays": this.allWeek,
                        "days": this.allDays,
                        "everyday": "0",
                        "scheduletype": this.scheduleTypeSel,
                        "amt": (qty * this.selectProd.pcost),
                        "total_amt": (qty * this.selectProd.pcost),
                        "total_items": qty,
                        "scheduledfrom": "moyacustomer"
                      }
                    };
                    if (this.selectProd.servicecharge) {
                      input.order["servicecharge"] = this.selectProd.servicecharge;
                    }
                    if (this.cbExpDel) {
                      input.order["expressdelivery"] = "true";
                    }
                    if (this.scheduleId) {
                      input.order["schdid"] = this.scheduleId;
                    }
                    let data = JSON.stringify(input);
                    this.alertUtils.showLog(data);
                    if (this.alertUtils.networkStatus()) {
                      if (this.calledfrom == "edit") {
                        this.updateScheduleTask(data);
                      } else {
                        this.createScheduleTask(data);
                      }
                    } else {
                      this.alertUtils.showAlert("INTERNET CONNECTION", INTERNET_ERR_MSG, "OK");
                    }
                  }
                } else {
                  this.alertUtils.showToast("Quantity should not be zero");
                }
              } else {
                this.alertUtils.showToast("Invalid quantity value");
              }
            } else {
              this.alertUtils.showToast(this.alertUtils.ERROR_MES);
            }
          } else {
            this.alertUtils.showToast("Please enter quantity");

          }
        } else {
          this.alertUtils.showToast("Please select delivery slot");
        }
      } else {
        this.alertUtils.showToast("Please select product");
      }
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  createScheduleTask(data) {
    this.alertUtils.showLoading();
    this.apiService.postReq(this.apiService.createScheduler(), data).then(value => {
      this.alertUtils.hideLoading();
      if (value.result == RES_SUCCESS) {
        this.alertUtils.showToast("Schedule created successfully");
        this.viewCtrl.dismiss("created");
      } else {
        this.alertUtils.showToast(TRY_AGAIN_ERR_MSG);
      }
    }, err => {
      this.alertUtils.hideLoading();
      this.alertUtils.showLog(err);
    });
  }

  updateScheduleTask(data) {
    this.alertUtils.showLoading();
    this.apiService.putReq(this.apiService.updateScheduleOrder(), data).then(value => {
      this.alertUtils.hideLoading();
      if (value.result == RES_SUCCESS) {
        this.alertUtils.showToast("Schedule updated successfully");
        this.viewCtrl.dismiss("updated");
      } else {
        this.alertUtils.showToast(TRY_AGAIN_ERR_MSG);
      }
    }, err => {
      this.alertUtils.hideLoading();
      this.alertUtils.showLog(err);
    });
  }

  fetchProducts() {
    this.alertUtils.getLoginState().then(resLStatus => {
      if (resLStatus) {
        this.loginStatus = resLStatus;
        this.alertUtils.getUserId().then(res => {
          if (res) {
            this.userID = res;
            this.alertUtils.getDealerId().then(res => {
              if (res) {
                this.dealerID = res;
                this.getData();
              }
            });
          }
        });
      }
    }).catch(err => {
      this.alertUtils.showLog(err);
    })
  }

  calTotalAmt() {
    this.totalamt = 0;
    this.totalitem = 0;
    for (let i = 0; i < this.items.length; i++) {
      this.totalitem = this.totalitem + this.items[i].count;
      this.totalamt = this.totalamt + (this.items[i].pcost * this.items[i].count);
    }
  }

  getData() {
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
      this.showProgress = true;
      this.apiService.postReq(this.apiService.getProductsByDistributerId(), data).then(res => {
        this.showProgress = false;
        this.alertUtils.showLog(res);
        if (res.result == RES_SUCCESS) {
          if (res.data) {
            for (let i = 0; i < res.data[0].products.length; i++) {
              if (res.data[0].products[i].stockstatus && res.data[0].products[i].stockstatus.toLowerCase() != 'soldout') {
                if (res.data[0].products[i].pcost && res.data[0].products[i].category) {
                  res.data[0].products[i]["count"] = 0;
                  if (this.calledfrom && this.calledfrom == "edit") {
                    if (this.oldItems.productid == res.data[0].products[i].productid) {
                      this.selectProd = res.data[0].products[i];
                      if (this.selectProd.expressdeliverycharges > 0) {
                        if (this.oldItems && this.oldItems.expressdelivery) {
                          if (this.oldItems.expressdelivery == 'true') {
                            this.cbExpDel = true;
                          }
                        }
                      }
                    }
                  }
                  this.items.push(res.data[0].products[i]);
                }
              }
            }
            if (res.data[0].discountedproducts) {
              if (res.data[0].discountedproducts.length > 0) {
                for (let j = 0; j < res.data[0].discountedproducts.length; j++) {
                  for (let i = 0; i < this.items.length; i++) {
                    if (this.items[i].productid == res.data[0].discountedproducts[j].productid) {
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
                this.calTotalAmt();
              }
            }
          }
          this.alertUtils.showLog(this.items);
        }
      }, err => {
        this.showProgress = false;
        this.alertUtils.showToast(this.alertUtils.INTERNET_ERR_MSG);
        this.alertUtils.showLog(err);
      });
    } catch (e) {
      this.showProgress = false;
      this.alertUtils.showLog(e);
    }
  }
}
