import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RiwayatscorePage } from './riwayatscore.page';

const routes: Routes = [
  {
    path: '',
    component: RiwayatscorePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RiwayatscorePageRoutingModule {}
