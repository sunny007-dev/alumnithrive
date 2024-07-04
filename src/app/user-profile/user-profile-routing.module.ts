import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile.component';
import { PointTableComponent } from './point-table/point-table.component';

const routes: Routes = [
  { path: '' , component: UserProfileComponent},
  { path: 'points-detail' , component: PointTableComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileRoutingModule { }
