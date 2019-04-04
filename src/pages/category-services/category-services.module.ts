import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CategoryServicesPage } from './category-services';

@NgModule({
  declarations: [
    CategoryServicesPage,
  ],
  imports: [
    IonicPageModule.forChild(CategoryServicesPage),
  ],
})
export class CategoryServicesPageModule {}
