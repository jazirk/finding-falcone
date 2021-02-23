import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GalaxyComponent} from './components/galaxy/galaxy.component';
import {ResultComponent} from './components/result/result.component';


const  routes: Routes  = [
  {path:  '', redirectTo:  'galaxy', pathMatch: 'full' },
  {path:  'galaxy', component:  GalaxyComponent},
  {path:  'result', component:  ResultComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
