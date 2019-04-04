import {Component} from "@angular/core";
import {IonicPage, NavController, NavParams, ViewController} from "ionic-angular";
import {Utils} from "../../app/services/Utils";
@IonicPage()
@Component({
  selector: 'page-editemptycan',
  templateUrl: 'editemptycan.html',
})
export class EditemptycanPage {
  private mainItem: any;
  private showErr: boolean = false;

  constructor(private alertUtils: Utils, public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditemptycanPage');
  }

  ngOnInit() {
    this.mainItem = this.navParams.get('item')
  }

  private clickMinus(item) {
    if (item.emptycount > 0) {
      item.emptycount--;
      if (this.showErr)
        this.showErr = false;
    }
  }

  private clickPlus(item) {
    item.emptycount++;
    if (this.showErr)
      this.showErr = false;
  }

  private update() {
    if (this.mainItem.emptycount <= this.mainItem.count)
      this.viewCtrl.dismiss({eCount: this.mainItem.emptycount});
    else
      this.showErr = true;
  }

  private dismiss() {
    this.viewCtrl.dismiss({eCount: 0});
  }


}
