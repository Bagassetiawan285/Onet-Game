import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PilihanPage } from './pilihan.page';

const routes: Routes = [
  {
    path: '',
    component: PilihanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PilihanPageRoutingModule {}
