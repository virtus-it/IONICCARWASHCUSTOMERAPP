import {Component} from '@angular/core';

import {AboutPage} from '../MyOrders/about';
import {ContactPage} from '../MyAccount/contact';
import {HomePage} from '../PlaceAnOrder/home';
import {App, NavController, NavParams, Tabs} from "ionic-angular";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  private calledfrom: any;

  constructor(public appCtrl: App, private navCtrl: NavController, private param: NavParams) {

    try {

      this.calledfrom = this.param.get('from');
      if (this.calledfrom) {
        console.log(this.calledfrom);
        if (this.calledfrom == "orderconfirmation") {
          const tabsNav = this.appCtrl.getNavByIdOrName('myTabsNav') as Tabs;
          tabsNav.select(1);
          this.navCtrl.pop();
        }
      }

    } catch (e) {
      console.log(e);
    }

  }
}
