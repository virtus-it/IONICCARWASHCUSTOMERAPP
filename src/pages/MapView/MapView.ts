import {ChangeDetectorRef, Component, ElementRef, ViewChild} from "@angular/core";
import {GetService} from "../../app/services/get.servie";
import {ModalController, NavController, NavParams, Platform, Slides, ViewController} from "ionic-angular";
import {Geolocation} from "@ionic-native/geolocation";
import {GoogleMap, GoogleMaps, GoogleMapsEvent, ILatLng, LatLng, LatLngBounds} from "@ionic-native/google-maps";
import {
  APP_TYPE,
  APP_USER_TYPE,
  FRAMEWORK,
  INTERNET_ERR_MSG,
  IS_WEBSITE,
  MOBILE_TYPE,
  Utils
} from "../../app/services/Utils";
import {Diagnostic} from "@ionic-native/diagnostic";
import {SignUp} from "../SignUp/SignUp";
import {ConfirmOrder} from "../ConfirmOrderPage/ConfirmOrderPage";


@Component({
  templateUrl: 'MapView.html',
  selector: 'map-page'
})
export class MapView {
  private static bounds: LatLngBounds;
  @ViewChild(Slides) public slides: Slides;
  referCode: string = "";
  @ViewChild('map') mapElement: ElementRef;
  map: GoogleMap;
  userAddr: any;
  landMark: any;
  buildingname: any;
  latitude: number = 0;
  longitude: number = 0;
  userLatLng: LatLng;
  showProgress = true;
  showDetails = false;
  autocomplete: any;
  address;
  tabBarElement: any;
  categoryData: any;
  rides = [];
  currentIndex = 0;
  private isExisting: any;
  private exMobileno: any;
  private exUserInfo: any;
  private items: any;
  private calledFrom: string = "";
  private showMap: boolean = true;

  constructor(private apiService: GetService, public viewCtrl: ViewController, private modalCtrl: ModalController, private diagnostic: Diagnostic, private getService: GetService, private ref: ChangeDetectorRef, public platform: Platform, public navCtrl: NavController, private geo: Geolocation, private alertUtils: Utils, private param: NavParams) {
    platform.ready().then(() => {
      try {


        this.calledFrom = this.param.get("from");
        console.log("Page came from :" + this.calledFrom);
        this.isExisting = this.param.get("isExisting");
        this.exMobileno = this.param.get("exMobileno");
        this.referCode = this.param.get("referCode");
        this.exUserInfo = this.param.get("exUserInfo");
        this.alertUtils.showLog(this.exMobileno);
        this.items = this.param.get("items");
        this.address = {
          place: ''
        };

        MapView.bounds = new LatLngBounds([
          {
            "lat": 17.539296557855938,
            "lng": 78.23303103077819
          },
          {
            "lat": 17.199834236282776,
            "lng": 78.32504152882507
          },
          {
            "lat": 17.188026972484295,
            "lng": 78.73016237843444
          },
          {
            "lat": 17.493460110609615,
            "lng": 78.74252199757507
          },
          {
            "lat": 17.624390628973813,
            "lng": 78.59420656788757
          },
          {
            "lat": 17.624390628973813,
            "lng": 78.32916140187194
          }
        ]);
      } catch (e) {
        this.alertUtils.showLog(e);
      }


      if (IS_WEBSITE) {
        this.getCategoryTask();
        this.fetchRides();
      }

      this.alertUtils.getUserInfo().then(user => {
        if (user) {
          Utils.USER_INFO_DATA = user;
          this.getCategoryTask();
          this.fetchRides();
        }

      }).catch(err => {
        this.alertUtils.showLog(err);
      });



    });

  }

  search(){
    this.showAddressModal();
  }

  addNewRide() {
    let model = this.modalCtrl.create('AddupdateridesPage', {"from": "create"});
    model.present();
    model.onDidDismiss(data => {
      if (data) {
        this.alertUtils.showLog(data);
        if (this.alertUtils.networkStatus()) {
          this.fetchRides();
        } else {
          this.alertUtils.showAlert("INTERNET CONNECTION", INTERNET_ERR_MSG, "OK");
        }
      }
    });
  }


  nextSlide() {
    this.slides.slideNext();
  }

  previousSlide() {
    this.slides.slidePrev();
  }

  onSlideChanged() {
    this.currentIndex = this.slides.getActiveIndex();
    console.log('Slide changed! Current index is', this.currentIndex);
  }

  next() {
    this.confirmLocation();
  }

  showServices(item) {
    console.log(item);
    let input = {
      "root": {
        "userid": Utils.USER_INFO_DATA.userid,
        "usertype": "dealer",
        "category": item.category,
        "categoryid": item.categoryid,
        "apptype": APP_TYPE
      }
    }

    this.apiService.postReq(GetService.getProductsByCategory(), input).then(res => {
      console.log(res);
      if (res && res.data) {
        Utils.categoryList = new Map<string, any>();

        for (let i = 0; i < res.data.length; i++) {
          // res.data[i]["count"] = 0;
          res.data[i]["ischecked"] = false;

        }
        Utils.productsList = res.data;

        // var result = this.groupBy(res.data, function (item) {
        //   return [item.brandname, item.brandname];
        // });

        // console.log(result);

        // for (let i = 0; i < result.length; i++) {
        //   const element = result[i];

        //   Utils.categoryList.set(element[0].brandname, element);

        // }
        // console.log( Utils.categoryList.keys());
        // console.log( Utils.categoryList);
        let model = this.modalCtrl.create('ProductsPage', {"category": item})
        model.onDidDismiss(data => {
          console.log("MapView");
          console.log(Utils.productsList);
          if (data) {

          }
        });
        model.present();


      } else {
        this.alertUtils.showToast("No services found in this category");
      }
    })
  }


  getCategoryTask() {
    this.apiService.getReq(GetService.getCategory(Utils.USER_INFO_DATA.superdealerid)).subscribe(res => {
      console.log(res);
      if (res && res.data) {
        this.categoryData = res.data;
      }
    });
  }

  fetchRides() {
    let input = {
      "User": {
        "userid": Utils.USER_INFO_DATA.userid,
        "apptype": APP_TYPE,
        "TransType": "getextrainformation"
      }
    };
    this.apiService.postReq(GetService.ride(), input).then(res => {
      console.log(res)
      if (res && res.data) {
        this.rides = res.data;
      }
    })
  }




  showAddressModal() {
    let modal = this.modalCtrl.create('AutocompletePage');
    modal.onDidDismiss(data => {
      if (data) {
        this.address.place = data;
        this.geoCode(data);
      }
    });
    modal.present({
      keyboardClose: false
    });
  }

  //convert Address string to lat and long
  geoCode(address: any) {
    try {
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({'address': address}, (results, status) => {
        this.latitude = results[0].geometry.location.lat();
        this.longitude = results[0].geometry.location.lng();
        if (this.latitude != 0 && this.longitude != 0) {
          let loc: LatLng;
          loc = new LatLng(this.latitude, this.longitude);
          this.map.moveCamera({
            target: loc,
            zoom: 17,
            tilt: 10,
            duration: 1000
          }).catch(reason => {
            this.alertUtils.showLog(reason);
          });
        }
      });
    } catch (e) {
      this.alertUtils.showLog(e.toString());
    }
  }

  ngAfterViewInit() {
    try {
      let loc: LatLng;
      this.initMap();
      this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
        this.geoLocation().then(res => {
          loc = new LatLng(res.coords.latitude, res.coords.longitude);
          this.map.moveCamera({
            target: loc,
            zoom: 17,
            tilt: 10,
            duration: 1000
          }).catch(reason => {
            this.alertUtils.showLog(reason);
          });
        }, err => {
          console.log(err);
        })
      }, err => {
        console.log(err);
      });
      this.map.addEventListener(GoogleMapsEvent.CAMERA_MOVE_START).subscribe(next => {
        this.showProgress = true;
      }, err => {
        this.alertUtils.showLog(err);
      });
      this.map.addEventListener(GoogleMapsEvent.CAMERA_MOVE_END).subscribe(sub => {
        if (sub && sub[0] && sub[0].target.lat) {
          let pickLatLng: ILatLng = {
            lat: sub[0].target.lat,
            lng: sub[0].target.lng
          };
          if (MapView.bounds.contains(pickLatLng)) {
            this.showMap = true;
            this.ref.detectChanges();
            Utils.sLog("Inside the area");
            loc = new LatLng(sub[0].target.lat, sub[0].target.lng);
            this.userLatLng = loc;
            this.alertUtils.showLog(JSON.stringify(this.userLatLng));
            const url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + loc.lat + ',' + loc.lng + '&key=AIzaSyDoS0Blw09XR34phjQ4BGF6v8mpQ5E8aSM';
            this.alertUtils.showLog(url);
            this.getService.getReqForMap(url).subscribe(res => {
              this.showProgress = false;
              if (res.results && res.results[0] && res.results[0].formatted_address) {
                this.alertUtils.showLog(JSON.stringify(res.results[0].formatted_address));
                this.userAddr = res.results[0].formatted_address;
                this.alertUtils.showLog(this.userAddr);
                this.ref.detectChanges();
              }
            }, err => {
              this.showProgress = false;
              this.alertUtils.showToast(err);
            });
          } else {
            Utils.sLog("Outside the area");
            this.showMap = false;
            this.ref.detectChanges();
          }
        } else {
          Utils.sLog('LATLNG not found');
        }

      }, error2 => {
        this.showProgress = false;
        this.alertUtils.showToast(error2);
      });
    } catch (e) {
      Utils.sLog(e);
    }
  }


  initMap() {
    try {
      let element = this.mapElement.nativeElement;
      this.map = GoogleMaps.create(element);
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  geoLocation() {
    return this.geo.getCurrentPosition();
  }

  getMyLocation() {
    try {
      this.alertUtils.showLoading();
      this.diagnostic.isLocationEnabled().then(enable => {
        if (enable) {
          let loc: LatLng;
          this.geoLocation().then(res => {
            loc = new LatLng(res.coords.latitude, res.coords.longitude);
            this.map.moveCamera({
              target: loc,
              zoom: 17,
              tilt: 10,
              duration: 1000
            }).catch(reason => {
              this.alertUtils.showLog(reason);
            });
            this.alertUtils.hideLoading();
          }).catch(reason => {
            this.alertUtils.showLog(reason);
          });
        } else {
          this.alertUtils.hideLoading();
          this.alertUtils.dialogForLocationSetting("LOCATION", "Your GPS seems to be disabled, please enable it", "OK");
        }
        this.alertUtils.hideLoading();
      }, reason => {
        this.alertUtils.hideLoading();
        this.alertUtils.showAlert("LOCATION ERROR", reason.toString(), "OK");
      });
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  btnMoreDetails(hide) {
    if (hide)
      this.showDetails = true;
    else
      this.showDetails = false;
  }

  goBack() {
    this.viewCtrl.dismiss();
  }

  confirmLocation() {
    console.log(Utils.categoryList);

    this.userAddr = "Tolichowki";
    try {
      if (Utils.categoryList == undefined || Utils.categoryList == null) {
        this.alertUtils.showToast("Please select at least one service");
        return false;
      }
      if (this.rides && this.rides.length > 0) {
        console.log("active ride index : " + this.slides.getActiveIndex());
        Utils.rideSelected = this.rides[this.slides.getActiveIndex()];
        console.log(Utils.rideSelected);
      } else {
        this.alertUtils.showToast("Please add at least one ride");
      }

      if (this.userAddr) {
        this.userAddr = this.userAddr.replace(new RegExp("'", 'g'), '');
        if (this.showDetails) {
          if (this.validateAddr()) {
          } else {
            return;
          }
        }
        if (this.calledFrom == "myprofile") {
          let data = {
            'from': 'mapview',
            'address': this.userAddr,
            "lat": this.userLatLng.lat,
            "lng": this.userLatLng.lng
          };
          let addrData = {
            landmark: this.landMark,
            buildingname: this.buildingname
          };
          this.alertUtils.storeAddrData(addrData);
          this.navCtrl.getPrevious().data.myDataKey = data;
          this.navCtrl.pop();
        } else if (this.calledFrom == 'myorders') {
          let data = {
            'from': 'mapview',
            'address': this.userAddr,
            "lat": this.userLatLng.lat,
            "lng": this.userLatLng.lng
          };
          let addrData = {
            landmark: this.landMark,
            buildingname: this.buildingname
          };
          this.viewCtrl.dismiss(addrData);
        } else if (this.calledFrom == "login") {
          this.doUpdateUser();
        } else if (!this.calledFrom) {
          this.navCtrl.push(ConfirmOrder, {
            items: this.items,
            isExisting: this.isExisting,
            exMobileno: this.exMobileno,
            exUserInfo: this.exUserInfo,
            addr: this.userAddr,
            lat: this.userLatLng.lat,
            lng: this.userLatLng.lng,
            userLatlng: this.userLatLng,
            referCode: this.referCode,
          }).then(value => {
            let data = {
              landmark: this.landMark,
              buildingname: this.buildingname
            };
            this.alertUtils.storeAddrData(data);
          });
        } else {
          this.navCtrl.push(SignUp, {
            items: this.items,
            isExisting: this.isExisting,
            exMobileno: this.exMobileno,
            exUserInfo: this.exUserInfo,
            userAddr: this.userAddr,
            userLatlng: this.userLatLng,
            referCode: this.referCode,
          }).then(value => {
            let data = {
              landmark: this.landMark,
              buildingname: this.buildingname
            };
            this.alertUtils.storeAddrData(data);
          });
        }
      } else {
        this.alertUtils.showToast("Please pick your location");
      }
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  validateAddr() {
    if (this.alertUtils.validateText(this.buildingname, "Flat No", 3, 100)) {
      if (this.alertUtils.validateText(this.landMark, "Landmark", 3, 100)) {
        return true;
      } else {
        this.alertUtils.showToast(this.alertUtils.ERROR_MES);
        return;
      }
    } else {
      this.alertUtils.showToast(this.alertUtils.ERROR_MES);
      return;
    }
  }

  private doUpdateUser() {

    let input = {
      "User": {
        "userid": Utils.USER_INFO_DATA.userid,
        "user_type": APP_USER_TYPE,
        "address": this.userAddr,
        "apptype": APP_TYPE,
        "mobiletype": MOBILE_TYPE,
        "framework": FRAMEWORK
      }
    };
    if (this.userLatLng) {
      if (this.userLatLng.lat)
        input.User["latitude"] = this.userLatLng.lat;
      if (this.userLatLng.lng)
        input.User["longitude"] = this.userLatLng.lng;
    }
    if (this.landMark) {
      input.User["locality"] = this.landMark;
    }
    if (this.buildingname) {
      input.User["buildingname"] = this.buildingname;
    }
    let data = JSON.stringify(input);
    this.alertUtils.showLog(data);
    this.alertUtils.showLoading();
    this.apiService.putReq(this.apiService.updateUser(), data).then(res => {
      this.alertUtils.hideLoading();
      if (res.result == this.alertUtils.RESULT_SUCCESS) {
        if (res.data) {
          this.alertUtils.showToast("Profile address updated successfully");

          this.alertUtils.setUserAddr(this.userAddr);
          if (this.userLatLng) {
            if (this.userLatLng.lat)
              this.alertUtils.setUserLatLng(this.userLatLng.lat, this.userLatLng.lng);
          }
          if (this.landMark) {
            Utils.USER_INFO_DATA.locality = this.landMark;
            Utils.USER_INFO_DATA.buildingname = this.buildingname;
            this.alertUtils.cacheUserInfo(Utils.USER_INFO_DATA);
          }
        }
        this.navCtrl.pop();

      } else {
        this.alertUtils.showToast(this.alertUtils.GEN_ERR_MSG);
      }
    }, err => {
      this.alertUtils.hideLoading();
      this.alertUtils.showToast(this.alertUtils.GEN_ERR_MSG);
    });
  }
}
