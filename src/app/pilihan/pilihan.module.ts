import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PilihanPageRoutingModule } from './pilihan-routing.module';

import { PilihanPage } from './pilihan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PilihanPageRoutingModule
  ],
  declarations: [PilihanPage]
})
export class PilihanPageModule {}
