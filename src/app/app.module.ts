import {ErrorHandler, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {MyApp} from "./app.component";
import {StatusBar} from "@ionic-native/status-bar";
import {SplashScreen} from "@ionic-native/splash-screen";
import {NativeStorage} from "@ionic-native/native-storage";
import {Geolocation} from "@ionic-native/geolocation";
import {NativeGeocoder} from "@ionic-native/native-geocoder";
import {HttpModule} from "@angular/http";
import {AppRate} from "@ionic-native/app-rate";
import {Toast} from "@ionic-native/toast";
import {AppVersion} from "@ionic-native/app-version";
import {UtcDatePipe} from "./pipes/utc";
import {GoogleMaps} from "@ionic-native/google-maps";
import {CallNumber} from "@ionic-native/call-number";
import {Contacts} from "@ionic-native/contacts";
import {Diagnostic} from "@ionic-native/diagnostic";
import {OpenNativeSettings} from "@ionic-native/open-native-settings";
import {Network} from "@ionic-native/network";
import {Push} from "@ionic-native/push";
import {Facebook} from "@ionic-native/facebook";
import {Device} from "@ionic-native/device";
import {SocialSharing} from "@ionic-native/social-sharing";
import {Keyboard} from "@ionic-native/keyboard";
// import { SMS } from '@ionic-native/sms';

import {SignUp} from "../pages/SignUp/SignUp";
import {Login} from "../pages/LoginIn/Login";
import {OrderConfirmation} from "../pages/OrderConfirmationDialog/orderconfirmation";
import {MapView} from "../pages/MapView/MapView";
import {WelcomePage} from "../pages/WelcomePage/Welcome";
import {ProductsPage} from "../pages/ProductsPage/ProductsPage";
import {ConfirmOrder} from "../pages/ConfirmOrderPage/ConfirmOrderPage";
import {NotificationPage} from "../pages/NotificationTemplate/NotificationPage";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {SelectProductViewComponent} from "../components/select-product-view/select-product-view";
import {AboutPage} from "../pages/MyOrders/about";
import {ContactPage} from "../pages/MyAccount/contact";
import {HomePage} from "../pages/PlaceAnOrder/home";
import {TabsPage} from "../pages/tabs/tabs";
import {GetService} from "./services/get.servie";
import {Utils} from "./services/Utils";
import { ModalController } from 'ionic-angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
const config: SocketIoConfig = { url: 'http://192.168.1.50:1900', options: {} };

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    UtcDatePipe,
    SignUp,
    Login,
    OrderConfirmation,
    MapView,
    WelcomePage,
    ProductsPage,
    ConfirmOrder,
    NotificationPage,
    SelectProductViewComponent,
    TabsPage,
    // ModalPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,FormsModule, ReactiveFormsModule,
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
    HomePage,
    Login,
    OrderConfirmation,
    MapView,
    SelectProductViewComponent,
    WelcomePage,
    ProductsPage,
    ConfirmOrder,
    NotificationPage,
    TabsPage,
  ],
  providers: [
    // SMS,
    StatusBar,
    GetService,
    Utils,
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
    SocialSharing,
    Device,
    Push,
    Facebook,
    SplashScreen,
    ModalController,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
