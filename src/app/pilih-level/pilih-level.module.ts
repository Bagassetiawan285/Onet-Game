import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PilihLevelPageRoutingModule } from './pilih-level-routing.module';

import { PilihLevelPage } from './pilih-level.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PilihLevelPageRoutingModule
  ],
  declarations: [PilihLevelPage]
})
export class PilihLevelPageModule {}
