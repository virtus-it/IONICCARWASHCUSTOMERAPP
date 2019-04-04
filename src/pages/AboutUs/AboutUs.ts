import {Component} from "@angular/core";
import {Utils} from "../../app/services/Utils";
import {IonicPage} from "ionic-angular";
import {TranslateService} from "@ngx-translate/core";

@IonicPage()
@Component({
  templateUrl: 'AboutUs.html'
})
export class AboutUs {
  buildVersion: any;
  tabBarElement: any;

  constructor(private translateService: TranslateService, private alertUtils: Utils) {
    translateService.setDefaultLang('en');
    translateService.use('en');

    let verCode, verName;
    this.alertUtils.getVersionCode().then(code => {
      verCode = code;
    }).catch(err => {
      this.alertUtils.showLog(err)
    });
    this.alertUtils.getVersionNumber().then(num => {
      verName = num;
      this.buildVersion = verName + "-" + verCode;
    }).catch(err => {
      this.alertUtils.showLog(err)
    });
  }

  ngOnInit() {
    try {
      this.tabBarElement = document.querySelector('.tabbar.show-tabbar');
    } catch (e) {
      this.alertUtils.showLog(e);
    }
  }

  ionViewWillEnter() {
    try {
      this.tabBarElement.style.display = 'none';
    } catch (e) {
    }
  }

  ionViewWillLeave() {
    try {
      this.tabBarElement.style.display = 'flex';
    } catch (e) {
    }
  }
}
