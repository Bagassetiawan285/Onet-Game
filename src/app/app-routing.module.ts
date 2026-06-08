import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
   {
    path: 'menu',
    loadChildren: () => import('./menu/menu.module').then( m => m.MenuPageModule)
  },
  
  
  {
    path: '',
    redirectTo: 'home', 
    pathMatch: 'full'
  },
  {
    path: 'game',
    loadChildren: () => import('./game/game.module').then( m => m.GamePageModule)
  },
  {
    path: 'setting',
    loadChildren: () => import('./setting/setting.module').then( m => m.SettingPageModule)
  },
  {
    path: 'pilih-level',
    loadChildren: () => import('./pilih-level/pilih-level.module').then( m => m.PilihLevelPageModule)
  },
  {
    path: 'riwayatscore',
    loadChildren: () => import('./riwayatscore/riwayatscore.module').then( m => m.RiwayatscorePageModule)
  },
  {
    path: 'pilihan',
    loadChildren: () => import('./pilihan/pilihan.module').then( m => m.PilihanPageModule)
  },
  
 
 
  
 

 
 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
