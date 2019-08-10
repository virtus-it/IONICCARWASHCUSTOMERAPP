import { ChangeDetectorRef, Component, ElementRef, ViewChild, NgZone } from "@angular/core";
import { GetService } from "../../app/services/get.servie";
import { ModalController, NavController, NavParams, Platform, Slides, ViewController } from "ionic-angular";
import { Geolocation } from "@ionic-native/geolocation";
import { GoogleMap, GoogleMaps, GoogleMapsEvent, ILatLng, LatLng, LatLngBounds, Polygon, Poly } from "@ionic-native/google-maps";
import {
  APP_TYPE,
  APP_USER_TYPE,
  FRAMEWORK,
  INTERNET_ERR_MSG,
  IS_WEBSITE,
  MOBILE_TYPE,
  Utils,
  RES_SUCCESS
} from "../../app/services/Utils";
import { Diagnostic } from "@ionic-native/diagnostic";
import { SignUp } from "../SignUp/SignUp";
import { ConfirmOrder } from "../ConfirmOrderPage/ConfirmOrderPage";
import { DatePicker } from '@ionic-native/date-picker';
import { ServiceArea } from "../../app/services/servicearea";


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
  userAddr: string = "";
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
  list = [];

  markers: any;
  GoogleAutocomplete: any;
  GooglePlaces: any;
  geocoder: any
  autocompleteItems: any;
  loading: any;

  constructor(public zone: NgZone, private apiService: GetService, public viewCtrl: ViewController, private modalCtrl: ModalController, private diagnostic: Diagnostic, private getService: GetService, private ref: ChangeDetectorRef, public platform: Platform, public navCtrl: NavController, private geo: Geolocation, private serviceArea: ServiceArea, private alertUtils: Utils, private param: NavParams, private datePicker: DatePicker) {
    platform.ready().then(() => {
      try {


        this.calledFrom = this.param.get("from");
        Utils.sLog("Page came from :" + this.calledFrom);
        this.isExisting = this.param.get("isExisting");
        this.exMobileno = this.param.get("exMobileno");
        this.referCode = this.param.get("referCode");
        this.exUserInfo = this.param.get("exUserInfo");
        this.alertUtils.showLog(this.exMobileno);
        this.items = this.param.get("items");
        this.address = {
          place: ''
        };


        // MapView.bounds = new LatLngBounds([
        //   {
        //     "lat": 25.225021421700475,
        //     "lng": 55.28615459192213
        //   },
        //   {
        //     "lat": 25.062166768158566,
        //     "lng": 55.1309727071565
        //   },
        //   {
        //     "lat": 24.988749161198257,
        //     "lng": 55.09114726770338
        //   },
        //   {
        //     "lat": 24.953891550481544,
        //     "lng": 55.23122295129713
        //   },
        //   {
        //     "lat": 24.999951295254636,
        //     "lng": 55.466055714969
        //   },
        //   {
        //     "lat": 25.207627482773205,
        //     "lng": 55.64870342004713
        //   },
        //   {
        //     "lat": 25.326850217993883,
        //     "lng": 55.3946445821565
        //   }
        // ]);


        // var array = [
        //   {
        //     "lat": 24.801660372582777,
        //     "lng": 54.8638275736231
        //   },
        //   {
        //     "lat": 24.592050700484208,
        //     "lng": 54.70315252479497
        //   },
        //   {
        //     "lat": 24.360823911484054,
        //     "lng": 54.56445013221685
        //   },
        //   {
        //     "lat": 24.245677671122813,
        //     "lng": 54.82949529823247
        //   },
        //   {
        //     "lat": 24.678183055194744,
        //     "lng": 55.14672552284185
        //   }
        // ];
        // array.forEach(element => {
        //   MapView.bounds.extend({ lat: element.lat, lng: element.lng });
        // });

      } catch (e) {
        this.alertUtils.showLog(e);
      }


      if (IS_WEBSITE) {
        this.getData();
        this.fetchRides();
      }

      this.alertUtils.getUserInfo().then(user => {
        if (user) {
          Utils.USER_INFO_DATA = user;
          this.getData();

        }

      }).catch(err => {
        this.alertUtils.showLog(err);
      });



    });



    this.geocoder = new google.maps.Geocoder;
    let elem = document.createElement("div");
    this.GooglePlaces = new google.maps.places.PlacesService(elem);
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = {
      input: ''
    };
    this.autocompleteItems = [];
  }

  selectSearchResult(item) {
    Utils.sLog("place selected");
    Utils.sLog(item);
    this.address.place = item.description;
    this.geoCode(item.description);
    this.autocompleteItems = [];

  }
  updateSearchResults() {
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }

    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input, componentRestrictions: { country: ["AE"] } },
      (predictions, status) => {
        this.autocompleteItems = [];
        if (predictions) {
          this.zone.run(() => {
            predictions.forEach((prediction) => {
              this.autocompleteItems.push(prediction);
            });
          });
        }
      });
  }


  isPointInPolygon(tap, vertices) {
    let intersectCount = 0;
    for (let j = 0; j < vertices.length - 1; j++) {
      if (this.rayCastIntersect(tap, vertices[j], vertices[j + 1])) {
        intersectCount++;
      }
    }

    return ((intersectCount % 2) == 1); // odd = inside, even = outside;
  }

  rayCastIntersect(tap, vertA, vertB) {

    let aY = vertA.lat;
    let bY = vertB.lat;
    let aX = vertA.lng;
    let bX = vertB.lng;
    let pY = tap.lat;
    let pX = tap.lng;

    if ((aY > pY && bY > pY) || (aY < pY && bY < pY)
      || (aX < pX && bX < pX)) {
      return false; // a and b can't both be above or below pt.y, and a or
      // b must be east of pt.x
    }

    let m = (aY - bY) / (aX - bX); // Rise over run
    let bee = (-aX) * m + aY; // y = mx + b
    let x = (pY - bee) / m; // algebra is neat!

    return x > pX;
  }


  openDatePicker() {
    this.datePicker.show({
      date: new Date(),
      mode: 'datetime',
      minDate: new Date().valueOf(),
      maxDate: new Date('01-01-' + (new Date().getFullYear() + 1)).valueOf(),
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
    }).then(
      date => {
        Utils.sLog('Got date: ', date)
        Utils.datePicked = Utils.formatDateToDDMMYYYYHHMMSS(date);
      }
      , err => Utils.sLog('Error occurred while getting date: ', err)
    ).catch(error => {
      Utils.sLog('error date: ', error)
    });
  }

  search() {
    this.showAddressModal();
  }

  addNewRide() {
    let model = this.modalCtrl.create('AddupdateridesPage', { "from": "create" });
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
    Utils.sLog('Slide changed! Current index is', this.currentIndex);
  }

  next() {
    this.confirmLocation();
  }
  goToServiceArea() {
    const loc = new LatLng(24.361024, 54.641256);
    this.map.moveCamera({
      target: loc,
      zoom: 9,
      tilt: 10,
      duration: 1000
    }).catch(reason => {
      this.alertUtils.showLog(reason);
    });
  }
  showServices(item) {
    Utils.sLog(item);

    let model = this.modalCtrl.create('ProductsPage', { "category": item })
    model.onDidDismiss(data => {
      Utils.sLog("MapView");
      Utils.sLog(Utils.productsList);
    });
    model.present();
  }
  getData() {
    try {
      let input = {
        "root": {
          "userid": Utils.USER_INFO_DATA.superdealerid,
          "dealerid": Utils.USER_INFO_DATA.superdealerid,
          "distributorid": Utils.USER_INFO_DATA.superdealerid,
          "usertype": APP_USER_TYPE,
          "loginid": Utils.USER_INFO_DATA.userid,
          "apptype": APP_TYPE,
          "transtype": "getcategories"
        }
      };
      let data = JSON.stringify(input);

      this.apiService.postReq(this.apiService.getProductsByDistributerId(), data).then(res => {
        this.alertUtils.showLog(res);
        if (res.result == RES_SUCCESS) {
          if (res.data) {
            for (let i = 0; i < res.data.length; i++) {
              // res.data[i]["count"] = 0;
              res.data[i]["ischecked"] = false;
              res.data[i]["imgurl"] = this.apiService.getImg() + "product_" + res.data[i].productid + ".png";


            }
            var result = Utils.groupByBrandName(res.data, function (item) {
              return [item.categoryid, item.categoryid];
            });

            Utils.sLog(result);
            var map = new Map<string, any>();
            this.list = [];
            for (let i = 0; i < result.length; i++) {
              const element = result[i];
              map.set(element[0].category, element);
              this.list.push({ "category": element[0].category, "categoryid": element[0].categoryid, "imgurl": this.apiService.getImg() + "category_" + element[0].categoryid + ".png" })
            }
            Utils.categoryList = map;
            Utils.sLog(Utils.categoryList.keys());
            Utils.sLog(Utils.categoryList);
            Utils.sLog(this.list);
            this.fetchRides();


          } else {
            this.alertUtils.showToast("Found no products, please try again");
          }
        }
      });
    }
    catch (e) {
      this.alertUtils.showLog(e);
    }

  }
  changeImage(item) {
    item.imgurl = "assets/imgs/dummy_img.png";
  }

  getBounds() {
    try {
      this.serviceArea.getPolygonsList().then(res => {
        if (res) {
          var array: any = res;
          // if (array.length > 0) {
          //   MapView.bounds = new LatLngBounds(array[0].path);
          //   this.addPolygon(array[0].path)

          // }
          if (array.length > 0)
            for (let i = 0; i < array.length; i++) {
              const path = res[i].path;
              if (path) {
                // for (let j = 0; j < path.length; j++) {
                //   const element = path[j];
                //   MapView.bounds.extend({ lat: element.lat, lng: element.lng });
                // }
                this.addPolygon(path)

              }
            }
          // Utils.sLog(MapView.bounds);
        }
      }, err => {
        Utils.sLog(err);
      })
    } catch (error) {
      Utils.sLog(error);
    }
  }

  addPolygon(path) {
    this.map.addPolygon({
      points: path,
      strokeColor: '#343434',
      strokeOpacity: 0.2,
      strokeWeight: 1,
      fillColor: '#8d77771a',
      fillOpacity: 0.35
    })

  }

  // getCategoryTask() {
  //   this.apiService.getReq(GetService.getCategory(Utils.USER_INFO_DATA.superdealerid)).subscribe(res => {
  //     Utils.sLog(res);
  //     if (res && res.data) {
  //       this.categoryData = res.data;
  //     }
  //   });
  // }

  fetchRides() {
    let input = {
      "User": {
        "userid": Utils.USER_INFO_DATA.userid,
        "apptype": APP_TYPE,
        "TransType": "getextrainformation"
      }
    };
    this.apiService.postReq(GetService.ride(), input).then(res => {

      Utils.sLog(res)
      if (res && res.data) {
        this.rides = res.data;
      }

    }, err => {
      Utils.sLog(err);
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
      geocoder.geocode({ 'address': address }, (results, status) => {
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
        this.getBounds();
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
          Utils.sLog(err);
        })
      }, err => {
        Utils.sLog(err);
      });
      this.map.addEventListener(GoogleMapsEvent.CAMERA_MOVE_START).subscribe(next => {
        this.showProgress = true;
      }, err => {
        this.alertUtils.showLog(err);
      });
      this.map.addEventListener(GoogleMapsEvent.CAMERA_MOVE_END).subscribe(sub => {
        if (sub && sub[0] && sub[0].target.lat) {
          this.showProgress = true;
          let pickLatLng: ILatLng = {
            lat: sub[0].target.lat,
            lng: sub[0].target.lng
          };
          let isInside: boolean = false;
          for (let i = 0; i < this.serviceArea.list.length; i++) {
            const path: any = this.serviceArea.list[i].path;
            // use Poly.containsLocation for android
            if (Poly.containsLocation(pickLatLng, path)) {
              //  use this.isPointInPolygon(pickLatLng, path) for IOS
              // if (this.isPointInPolygon(pickLatLng, path)) {
              isInside = true;
              break;
            }
          }

          if (isInside) {
            this.showMap = true;
            this.showProgress = false;
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
            this.showProgress = false;
            this.showMap = false;
            this.userAddr = "";
            this.ref.detectChanges();
          }
          this.showProgress = false;

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
    Utils.sLog(Utils.categoryList);
    if (IS_WEBSITE) {
      this.userAddr = "Tolichowki";
      if (!this.userLatLng) {
        this.userLatLng = new LatLng(0.0, 0.0);
      }
    }



    try {

      if (this.rides && this.rides.length > 0) {
        Utils.sLog("active ride index : " + this.slides.getActiveIndex());
        Utils.rideSelected = this.rides[this.slides.getActiveIndex()];
        Utils.sLog(Utils.rideSelected);
      } else {
        this.alertUtils.showToast("Please add a vehicle");
        return false;
      }

      if (!Utils.productsList && Utils.productsList == undefined || Utils.productsList == null || Utils.productsList.length == 0) {
        this.alertUtils.showToast("Please select at least one service");
        return false;
      }

      let isProductSel = false;
      for (let i = 0; i < Utils.productsList.length; i++) {
        const element = Utils.productsList[i];
        if (element.ischecked) {
          isProductSel = true;
        }
      }
      if (!isProductSel) {
        this.alertUtils.showToast("Please select atleast one service");
        return false;
      }


      if (this.userAddr) {
        this.userAddr = this.userAddr.replace(new RegExp("'", 'g'), '');
        if (this.showDetails) {
          if (this.validateAddr()) {
          } else {
            return;
          }
        }
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
