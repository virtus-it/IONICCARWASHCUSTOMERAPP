import {Component, EventEmitter, Input, Output} from "@angular/core";
@Component({
  selector: 'select-product-view',
  templateUrl: 'select-product-view.html'
})
export class SelectProductViewComponent {
  text: string;
  @Input() mainItem: any;
  @Input() totalamt: any;
  @Input() brandProducts: any;
  @Input() mainIndex: any;
  @Input() savingProduct: any;
  @Output() goNext: EventEmitter<any> = new EventEmitter();
  @Output() goPrevios: EventEmitter<any> = new EventEmitter();
  @Output() calTotalAmt: EventEmitter<any> = new EventEmitter();
  @Output() minus: EventEmitter<any> = new EventEmitter();
  @Output() plus: EventEmitter<any> = new EventEmitter();
  @Output() emptyCanChange: EventEmitter<any> = new EventEmitter();
  @Output() changeImg: EventEmitter<any> = new EventEmitter();
  @Output() changeEmpCan: EventEmitter<any> = new EventEmitter();
  @Output() countChangeListener: EventEmitter<any> = new EventEmitter();
  private defpng = ".png";

  constructor() {

  }

  prodCountChangeListener(item) {
    this.countChangeListener.emit(item);
  }

  goToPreviousSlide() {
    this.goPrevios.emit("gotoPrevious");
  }

  goToNextSlide() {
    this.goNext.emit("gotoNext");
  }

  clickPlus(item) {
    this.plus.emit(item);

  }

  clickMinus(item) {
    this.minus.emit(item);

  }

  changeEmptyCan(item) {
    this.changeEmpCan.emit(item)
  }

  inputTextListener(item) {
    this.emptyCanChange.emit(item);
  }

  changeImage(item) {
    this.changeImg.emit(item);
  }


}
