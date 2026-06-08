import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RiwayatscorePageRoutingModule } from './riwayatscore-routing.module';

import { RiwayatscorePage } from './riwayatscore.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RiwayatscorePageRoutingModule
  ],
  declarations: [RiwayatscorePage]
})
export class RiwayatscorePageModule {}
