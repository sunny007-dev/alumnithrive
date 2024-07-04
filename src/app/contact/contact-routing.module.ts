import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { KeyContactComponent } from './key-contact/key-contact.component';
import { AlumniSocialChannelComponent } from './alumni-social-channel/alumni-social-channel.component';
import { AddEditKeyContactComponent } from './add-edit-key-contact/add-edit-key-contact.component';
import { AddEditSocialChannelComponent } from './add-edit-social-channel/add-edit-social-channel.component';
import { ViewSbupAlumniSocialChannelComponent } from './view-sbup-alumni-social-channel/view-sbup-alumni-social-channel.component';
import { ViewKeyContactComponent } from './view-key-contact/view-key-contact.component';
import { QueriesComponent } from './queries/queries.component';
import { AddEditQueriesComponent } from './add-edit-queries/add-edit-queries.component';
import { ViewQueriesComponent } from './view-queries/view-queries.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'key-contact',
        component: KeyContactComponent
      },
      {
        path: 'add-edit-key-contact',
        component: AddEditKeyContactComponent
      },
      {
        path: 'view-key-contact',
        component: ViewKeyContactComponent
      },
      {
        path: 'alumni-social-channel',
        component: AlumniSocialChannelComponent
      },
      {
        path: 'add-edit-social-channel',
        component: AddEditSocialChannelComponent
      },
      {
        path: 'view-social-channel',
        component: ViewSbupAlumniSocialChannelComponent
      },
      {
        path: 'queries',
        component: QueriesComponent
      },
      {
        path: 'edit-queries',
        component: AddEditQueriesComponent
      },     
      {
        path: 'view-queries',
        component: ViewQueriesComponent
      },      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContactRoutingModule { }
