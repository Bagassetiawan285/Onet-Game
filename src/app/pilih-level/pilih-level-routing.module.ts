import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PilihLevelPage } from './pilih-level.page';

const routes: Routes = [
  {
    path: '',
    component: PilihLevelPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PilihLevelPageRoutingModule {}
