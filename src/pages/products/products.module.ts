import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductsPage } from './products';
import { CapitalizePipe } from '../../app/pipes/capitalizepipe';

@NgModule({
  declarations: [
    ProductsPage,
    CapitalizePipe
  ],
  imports: [
    IonicPageModule.forChild(ProductsPage),
  ],
})
export class ProductsPageModule {}
