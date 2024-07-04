import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactRoutingModule } from './contact-routing.module';
import { KeyContactComponent } from './key-contact/key-contact.component';
import { CdkTableModule } from '@angular/cdk/table';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddEditKeyContactComponent } from './add-edit-key-contact/add-edit-key-contact.component';
import { EditorModule } from '@tinymce/tinymce-angular';
import { AddEditSocialChannelComponent } from './add-edit-social-channel/add-edit-social-channel.component';
import { ViewKeyContactComponent } from './view-key-contact/view-key-contact.component';
import { ViewSbupAlumniSocialChannelComponent } from './view-sbup-alumni-social-channel/view-sbup-alumni-social-channel.component';
import { QueriesComponent } from './queries/queries.component';
import { AddEditQueriesComponent } from './add-edit-queries/add-edit-queries.component';
import { ViewQueriesComponent } from './view-queries/view-queries.component';
import { AlumniSocialChannelComponent } from './alumni-social-channel/alumni-social-channel.component';


@NgModule({
  declarations: [
    KeyContactComponent,
    AddEditKeyContactComponent,
    AlumniSocialChannelComponent,
    AddEditSocialChannelComponent,
    ViewKeyContactComponent,
    ViewSbupAlumniSocialChannelComponent,
    QueriesComponent,
    AddEditQueriesComponent,
    ViewQueriesComponent
  ],
  imports: [
    CommonModule,
    ContactRoutingModule,
    EditorModule,

    CdkTableModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule,
    MatTooltipModule,
    SharedModule
  ]
})
export class ContactModule { }
