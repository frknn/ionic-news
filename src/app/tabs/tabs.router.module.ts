import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { TabsPage } from './tabs.page';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      { path: 'home', loadChildren: '../home/home.module#HomePageModule' },
      { path: 'trending', loadChildren: '../trending/trending.module#TrendingPageModule' },
      { path: 'upload', loadChildren: '../upload/upload.module#UploadPageModule' }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TabsRoutingModule { }
