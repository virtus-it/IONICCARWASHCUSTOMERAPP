import { Component, NgZone } from "@angular/core";
import { ViewController, IonicPage } from "ionic-angular";
import { googlemaps } from "googlemaps";
import { Utils } from "../../app/services/Utils";

declare var google;

@IonicPage()
@Component({
  templateUrl: 'AutoComplete.html'
})

export class AutocompletePage {
  autocompleteItems;
  autocomplete;
  geo: any;
  service = new google.maps.places.AutocompleteService();

  constructor(public viewCtrl: ViewController, private zone: NgZone, private alertUtils: Utils) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  chooseItem(item: any) {
    this.viewCtrl.dismiss(item);
    this.geo = item;
  }


  updateSearch() {
    try {
      if (this.autocomplete.query == '') {
        this.autocompleteItems = [];
        return;
      }
      let me = this;
      this.service.getPlacePredictions({
        input: this.autocomplete.query,
        componentRestrictions: { country: ["AE","IN"] }
      }, function (predictions, status) {
        if (predictions) {
          me.autocompleteItems = [];
          me.zone.run(function () {
            predictions.forEach(function (prediction) {
              me.autocompleteItems.push(prediction.description);
            });
          });
        }
      });
    } catch (e) {
      this.alertUtils.showLog(e.toString());
    }
  }
}
