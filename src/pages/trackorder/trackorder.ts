import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, Platform, ViewController } from 'ionic-angular';
import { Utils, IS_WEBSITE } from "../../app/services/Utils";
import { GetService } from "../../app/services/get.servie";
import { Diagnostic } from "@ionic-native/diagnostic";
import { LatLng, LatLngBounds } from "@ionic-native/google-maps";
import { Geolocation } from "@ionic-native/geolocation";
import { Socket } from 'ng-socket-io';
import { Observable } from "rxjs/Observable";
import DirectionsRequest = google.maps.DirectionsRequest;
import TravelMode = google.maps.TravelMode;


@IonicPage()
@Component({
  selector: 'page-trackorder',
  templateUrl: 'trackorder.html',
})
export class TrackorderPage {
  private static bounds: LatLngBounds;
  referCode: string = "";
  @ViewChild('map') mapElement: ElementRef;
  map: any;
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
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer({ suppressMarkers: true });
  direcReq: DirectionsRequest;
  start = 'chicago, il';
  end = 'chicago, il';
  obj: DirectionsRequest;
  loc: LatLng;
  private items: any;
  marker: any;
  markers: any = [];
  suppName: string;
  time: string = '';

  //assets/imgs/marker_pin.png



  constructor(
    private socket: Socket,
    private apiService: GetService, public viewCtrl: ViewController, private modalCtrl: ModalController, private diagnostic: Diagnostic, private getService: GetService, private ref: ChangeDetectorRef, public platform: Platform, public navCtrl: NavController, private geo: Geolocation, private alertUtils: Utils, private param: NavParams) {
    platform.ready().then(() => {


      try {

        this.items = this.param.get("order");
        Utils.sLog('<<<<<<< order data >>>>>>>>>>', this.items);


        this.alertUtils.getUserInfo().then(user => {
          if (user) {
            Utils.USER_INFO_DATA = user;
            this.openSocket();
          }

        }).catch(err => {
          this.alertUtils.showLog(err);
        });

      } catch (e) {
        this.alertUtils.showLog(e);
      }

    });
  }

  ionViewWillLeave() {
    try {


      Utils.sLog("DB DeviceUUID : " + this.items.useruniqueid);
      Utils.sLog("DeviceUUID : " + this.alertUtils.getDeviceUUID())
      this.socket.removeAllListeners();
      this.socket.disconnect();
    } catch (error) {
      Utils.sLog(error);
    }
  }

  goBack() {
    this.viewCtrl.dismiss();
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
          this.map.animateCamera({
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

  openSocket() {
    try {
      // this.calculateAndDisplayRoute();
      if (IS_WEBSITE) {
        // this.items = {};
        this.items['useruniqueid'] = 'b8037ebef554de2c';
      }
      Utils.sLog("DB DeviceUUID : " + this.items.useruniqueid);
      Utils.sLog("DeviceUUID : " + this.alertUtils.getDeviceUUID())
      this.socket.removeAllListeners();
      this.socket.disconnect();

      this.socket.connect();
      //  { orderid: 26,
      //   lat: 17.4072829,
      //   lng: 78.4020728,
      //   uuid: 'd63bc4c3f2c63b65',
      //   userid: 4,
      //   usertype: 'supplier',
      //   loginid: 4,
      //   apptype: 'carwash' }
      //'d63bc4c3f2c63b65'
      Utils.sLog("trackorder");
      if (IS_WEBSITE) {
        this.getMessages(this.items.useruniqueid).subscribe(data => {
          Utils.sLog("******* tracking started ********");
          Utils.sLog(data);
          if (data) {
            let item: any = data;
            if (item && item.order && item.order.lat && item.order.lng) {
              Utils.sLog(item.order.lat);
              Utils.sLog(item.order.lng);
              // this.addRouteMarkers(new LatLng(parseFloat(item.order.lat), parseFloat(item.order.lng)), 'http://maps.google.com/mapfiles/ms/micons/blue.png', 'SE');
              // this.addMarker(item.order.lat, item.order.lng);
              this.items.delivery_latitude = item.order.lat;
              this.items.delivery_longitude = item.order.lng;
              this.calculateAndDisplayRoute()

            }
          }
        });
      } else if (this.alertUtils.getDeviceUUID()) {
        this.getMessages(this.alertUtils.getDeviceUUID()).subscribe(data => {
          Utils.sLog("******* tracking started ********");
          Utils.sLog(data);
          if (data) {
            let item: any = data;
            if (item && item.order && item.order.lat && item.order.lng) {
              Utils.sLog(item.order.lat);
              Utils.sLog(item.order.lng);
              // this.addMarker(item.order.lat, item.order.lng);
              // this.addRouteMarkers(new LatLng(parseFloat(item.order.lat), parseFloat(item.order.lng)), 'http://maps.google.com/mapfiles/ms/micons/blue.png', 'SE');
              this.items.delivery_latitude = item.order.lat;
              this.items.delivery_longitude = item.order.lng;
              this.calculateAndDisplayRoute()

            }
          }
        });
      } else {
        console.error("--------------------UUID not found");
      }
    } catch (error) {
      Utils.sLog(error);
    }
  }

  getMessages(key: string) {
    try {
      Utils.sLog("trackorder 3");
      let observable = new Observable(observer => {
        this.socket.on(key, (data: any) => {
          observer.next(data);
        });
      });
      return observable;
    } catch (error) {
      Utils.sLog(error);
      return null;
    }
  }

  calculateAndDisplayRoute() {
    try {


      let destionation: LatLng;
      if (this.items && this.items.orderby_latitude && this.items.orderby_longitude) {
        destionation = new LatLng(parseFloat(this.items.orderby_latitude), parseFloat(this.items.orderby_longitude));
      } else {
        if (IS_WEBSITE)
          destionation = new LatLng(17.407190, 78.402064);
      }
      let origin: LatLng;

      if (this.items && this.items.delivery_latitude && this.items.delivery_longitude) {
        origin = new LatLng(parseFloat(this.items.delivery_latitude), parseFloat(this.items.delivery_longitude));
      } else {
        if (IS_WEBSITE)
          origin = new LatLng(17.997190, 78.992064);
        else {
          origin = destionation;
        }
      }

      Utils.sLog(origin)
      this.direcReq = {};
      this.direcReq.origin = origin;
      this.direcReq.destination = destionation;
      this.direcReq.travelMode = TravelMode.DRIVING;
      this.direcReq.unitSystem = google.maps.UnitSystem.METRIC;
      this.directionsService.route(this.direcReq, (response, status) => {
        try {
          if (status && response && response.routes && response.routes[0] && response.routes[0].legs && response.routes[0].legs[0]) {
            this.directionsDisplay.setDirections(response);
            var leg = response.routes[0].legs[0];
            if (this.markers) {
              for (var i = 0; i < this.markers.length; i++) {
                this.markers[i].setMap(null);
              }
              this.markers = new Array();
            }
            this.time = leg.duration.text;
            this.addRouteMarkers(leg.start_location, 'http://maps.google.com/mapfiles/ms/micons/blue.png', 'Me');
            this.addRouteMarkers(leg.end_location, 'http://maps.google.com/mapfiles/ms/micons/green.png', 'SE');

            // this.ref.detectChanges();
          } else {
            //window.alert('Directions request failed due to ' + status);
          }
        } catch (error) {
          Utils.sLog(error);
        }

      });
    } catch (error) {
      Utils.sLog(error);
    }

  }

  addRouteMarkers(position, icon, title) {
    this.markers.push(new google.maps.Marker({
      position: position,
      map: this.map,
      icon: icon,
      title: title
    }));
  }



  addMarker(lat, lng) {
    try {


      if (this.marker)
        this.marker.setMap(null);

      this.suppName = "Service Man";
      if (this.items && this.items.supplierdetails && this.items.supplierdetails.firstname) {
        this.suppName = this.items.supplierdetails.firstname;
      }

      // this.marker = new google.maps.Marker({
      //   map: this.map,
      //   icon: '/assets/imgs/marker_pin.png',
      //   position: new LatLng(parseFloat(lat), parseFloat(lng))
      // });

      // let content = suppName;

      // this.addInfoWindow(this.marker, content);
      // this.loc = new LatLng(parseFloat(lat), parseFloat(lng));
      this.moveToLocation(parseFloat(lat), parseFloat(lng));
    } catch (error) {
      Utils.sLog(error);
    }
  }
  moveToLocation(lat, lng) {
    var center = new google.maps.LatLng(lat, lng);
    // using global variable:
    this.map.panTo(center);
  }

  addInfoWindow(marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }


  ngAfterViewInit() {
    try {
      this.initMap();
    } catch (e) {
      Utils.sLog(e);
    }
  }


  initMap() {
    try {

      this.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 14,
        disableDefaultUI: true,
        center: { lat: 17.394264, lng: 78.402064 }
      });
      this.directionsDisplay.setMap(this.map);
      this.calculateAndDisplayRoute();
      //this.addMarker(17.396428, 78.425041);
      this.suppName = "Service Man";
      if (this.items && this.items.supplierdetails && this.items.supplierdetails.firstname) {
        this.suppName = this.items.supplierdetails.firstname;
      }
      if (IS_WEBSITE) {
        this.openSocket();
      }
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
            this.map.animateCamera({
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


}
