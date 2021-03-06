import { ErrorHandler, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { MyApp } from "./app.component";
import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { NativeStorage } from "@ionic-native/native-storage";
import { Geolocation } from "@ionic-native/geolocation";
import { NativeGeocoder } from "@ionic-native/native-geocoder";
import { HttpModule } from "@angular/http";
import { AppRate } from "@ionic-native/app-rate";
import { Toast } from "@ionic-native/toast";
import { AppVersion } from "@ionic-native/app-version";
import { UtcDatePipe } from "./pipes/utc";
import { GoogleMaps } from "@ionic-native/google-maps";
import { CallNumber } from "@ionic-native/call-number";
import { Contacts } from "@ionic-native/contacts";
import { Diagnostic } from "@ionic-native/diagnostic";
import { OpenNativeSettings } from "@ionic-native/open-native-settings";
import { Network } from "@ionic-native/network";
import { Push } from "@ionic-native/push";
import { Device } from "@ionic-native/device";
import { SocialSharing } from "@ionic-native/social-sharing";
import { Keyboard } from "@ionic-native/keyboard";
import { PhotoViewer } from '@ionic-native/photo-viewer';


import { SignUp } from "../pages/SignUp/SignUp";
import { Login } from "../pages/LoginIn/Login";
import { OrderConfirmation } from "../pages/OrderConfirmationDialog/orderconfirmation";
import { MapView } from "../pages/MapView/MapView";
import { WelcomePage } from "../pages/WelcomePage/Welcome";
import { ConfirmOrder } from "../pages/ConfirmOrderPage/ConfirmOrderPage";
import { NotificationPage } from "../pages/NotificationTemplate/NotificationPage";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { AboutPage } from "../pages/MyOrders/about";
import { ContactPage } from "../pages/MyAccount/contact";
import { GetService } from "./services/get.servie";
import { Utils } from "./services/Utils";
import { ServiceArea } from "./services/servicearea";

import { ModalController } from 'ionic-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePicker } from '@ionic-native/date-picker';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const config: SocketIoConfig = { url: GetService.TRACKING_URL, options: {} };

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    UtcDatePipe,
    SignUp,
    Login,
    OrderConfirmation,
    MapView,
    WelcomePage,
    ConfirmOrder,
    NotificationPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule, FormsModule, ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    SocketIoModule.forRoot(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    SignUp,
    Login,
    OrderConfirmation,
    MapView,
    WelcomePage,
    ConfirmOrder,
    NotificationPage
  ],
  providers: [
    StatusBar,
    GetService,
    Utils,
    ServiceArea,
    AppVersion,
    NativeStorage,
    Geolocation,
    AppRate,
    Contacts,
    CallNumber,
    NativeGeocoder,
    Diagnostic,
    Toast,
    Keyboard,
    GoogleMaps,
    OpenNativeSettings,
    Network,
    DatePicker,
    SocialSharing,
    Device,
    Push,
    PhotoViewer,
    SplashScreen,
    ModalController,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {
}
