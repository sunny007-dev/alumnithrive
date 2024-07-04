import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenInterceptor } from 'src/app/core/token.interceptor';
import { Config } from 'src/app/services/config';
import { OrganizationService } from 'src/app/services/organization.service';

@Component({
  selector: 'app-add-edit-employment-type',
  templateUrl: './add-edit-employment-type.component.html',
  styleUrls: ['./add-edit-employment-type.component.scss']
})
export class AddEditEmploymentTypeComponent implements OnInit {
  loading:boolean;
  status: any;
  eventId: any;
  eventData: any;
  form: FormGroup;
  pageType:any;
  submitted: boolean;
  constructor(
    public fb: FormBuilder, 
    public notifyService: TokenInterceptor, 
    private organizationServie: OrganizationService, 
    public arouter: ActivatedRoute,
    public router: Router, private config: Config) { 
      this.status = this.config?.status;
    }


  async ngOnInit() {
    this.buildForm();
    this.arouter.queryParams.subscribe((res: any) => {
      this.pageType = res?.action;
      this.eventId = res?.id;
    });
    /**Get and single team data and Patch with form */
      if(this.eventId) this.getSingDataById(this.eventId);
  }

  async getSingDataById(id: number) {
    this.loading = true;
    let action: string = "single-employmentType";
    await this.organizationServie.getDataById(action, id).subscribe((x: any) => {
      console.log(x)
        this.eventData = x?.data;
        setTimeout(() => {
          this.form.patchValue({...this.eventData});
          this.loading = false;
        }, 500);
    });
  }

  /**
   * Function to Build Form data
   */
  buildForm() {
    this.form = this.fb.group({
      id: [''],
      employment_type_name: ['', Validators.required],
      status: ['', Validators.required]
    })
  }

    /**
   * Function to create/update event type
   */
    async save() {
      this.submitted = true;
      if(this.form?.invalid){
        return;
      }
      else{
        let action: string = this.pageType == "update-employmentType" ? 'update-employmentType': 'create-employmentType';
        await this.organizationServie.postData(action, this.form?.value).subscribe((item: any) => {
          if(item?.status == 200){
            this.notifyService.notificationService.success(item?.message);
            this.router.navigate(['/organization/employment-type']);
          }
        }, error => {
            this.notifyService.notificationService.error(error);
        });
      }
    }
}
