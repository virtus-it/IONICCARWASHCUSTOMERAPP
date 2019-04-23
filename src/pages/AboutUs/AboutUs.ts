import { Component } from "@angular/core";
import { Utils } from "../../app/services/Utils";
import { IonicPage } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";

@IonicPage()
@Component({
  templateUrl: 'AboutUs.html'
})
export class AboutUs {
  buildVersion: any;
  tabBarElement: any;

  constructor(private translateService: TranslateService, private alertUtils: Utils) {
    let lang = "en";
    if (Utils.lang) {
      lang = Utils.lang
    }
    console.log(lang);
    translateService.use(lang);

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

  }

}
