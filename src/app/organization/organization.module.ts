import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizationRoutingModule } from './organization-routing.module';
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
import { InstituteComponent } from './institute/institute.component';
import { SkillsComponent } from './skills/skills.component';
import { BatchesComponent } from './batches/batches.component';
import { UnderGraduateComponent } from './under-graduate/under-graduate.component';
import { PostGraduateComponent } from './post-graduate/post-graduate.component';
import { PhdComponent } from './phd/phd.component';
import { PrimaryIndustryComponent } from './primary-industry/primary-industry.component';
import { SecondaryIndustryComponent } from './secondary-industry/secondary-industry.component';
import { PrimaryFunctionComponent } from './primary-function/primary-function.component';
import { SecondaryFunctionComponent } from './secondary-function/secondary-function.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SecurityQuestionsComponent } from './security-questions/security-questions.component';
import { AddEditBatchesComponent } from './add-edit-batches/add-edit-batches.component';
import { AddEditCourseComponent } from './add-edit-course/add-edit-course.component';
import { AddEditInstituteComponent } from './add-edit-institute/add-edit-institute.component';
import { AddEditSecondaryFunctionComponent } from './add-edit-secondary-function/add-edit-secondary-function.component';
import { AddEditPrimaryFunctionComponent } from './add-edit-primary-function/add-edit-primary-function.component';
import { AddEditPrimaryIndustryComponent } from './add-edit-primary-industry/add-edit-primary-industry.component';
import { AddEditSecondaryIndustryComponent } from './add-edit-secondary-industry/add-edit-secondary-industry.component';
import { AddEditSecurityQuestionsComponent } from './add-edit-security-questions/add-edit-security-questions.component';
import { AddEditSkillsComponent } from './add-edit-skills/add-edit-skills.component';
import { EmploymentTypeComponent } from './employment-type/employment-type.component';
import { AddEditEmploymentTypeComponent } from './add-edit-employment-type/add-edit-employment-type.component';

@NgModule({
  declarations: [
    InstituteComponent,
    SkillsComponent,
    BatchesComponent,
    UnderGraduateComponent,
    PostGraduateComponent,
    PhdComponent,
    PrimaryIndustryComponent,
    SecondaryIndustryComponent,
    PrimaryFunctionComponent,
    SecondaryFunctionComponent,
    SecurityQuestionsComponent,
    AddEditBatchesComponent,
    AddEditCourseComponent,
    AddEditInstituteComponent,
    AddEditSecondaryFunctionComponent,
    AddEditPrimaryFunctionComponent,
    AddEditPrimaryIndustryComponent,
    AddEditSecondaryIndustryComponent,
    AddEditSecurityQuestionsComponent,
    AddEditSkillsComponent,
    EmploymentTypeComponent,
    AddEditEmploymentTypeComponent
  ],
  imports: [
    CommonModule,
    OrganizationRoutingModule,

    CdkTableModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTooltipModule,
    SharedModule
  ]
})
export class OrganizationModule { }
