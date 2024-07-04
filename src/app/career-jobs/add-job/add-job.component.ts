import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenInterceptor } from 'src/app/core/token.interceptor';
import { CollaborateService } from 'src/app/services/collaborate.service';
import { Config } from 'src/app/services/config';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/shared/interfaces/user';

@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.scss']
})
export class AddJobComponent implements OnInit {

  jobForm: FormGroup;
  
  status: any;
  profilePic: any;
  image: any;
  loading: boolean = false;
  currentUser: any;
  author: any;
  submitted: boolean = false;
  jobType: any;
  internshipData: any;
  newJobId: any;
  updatedJob: any;
  jobStat: any;
  updatedImg: any;
  roleType: any;

  constructor(
    public fb : FormBuilder,
    public collaborateService: CollaborateService,
    public router: Router,
    public arouter: ActivatedRoute,
    private notify : TokenInterceptor,
    private config: Config,
    private userService: UsersService
  ) { 
    this.jobStat = this.config?.isOpen;
    this.currentUser = this.userService.getCurrentUser();
    this.arouter.queryParams.subscribe((res: any) => {
      this.newJobId = res?.jobId;
      this.updatedJob = res?.action;
      this.roleType = res?.role_type;

      if(this.newJobId){
        this.loading = true;
        setTimeout(async () => {
          await this.collaborateService.getDataById('single-jobs', this.newJobId).subscribe((res:any) => {
            if(res?.status == 200) {
              this.jobForm.patchValue({...res?.data});
              this.loading = false;
            }
          });
        }, 200);
      }
    });
  }

  ngOnInit(): void {
    let fname = this.currentUser?.first_name;
    let lname = this.currentUser?.last_name;
    let mname = this.currentUser?.middle_name;
    this.author = fname  + ((mname == null) ? '' : ' ' + mname ) + ' ' + lname;
    this.buildForm();
   this.getAllJobTypes();
  }

  /**
   * Functiont to Build Form
   */
   buildForm() {
    this.jobForm = this.fb.group({
      id: [''],
      user_id: this.currentUser?.id,
      title: ['', Validators.required],
      author: [''],
      companyName: ['', Validators.required],
      location: ['', Validators.required],
      city: ['', Validators.required],
      salary: ['', Validators.required],
      fresherApply: [false],
      jobsType_id:['', Validators.required],
      workExperience: ['', Validators.required],
      skillsRequired: ['', Validators.required],
      qualification: ['', Validators.required],
      contactPerson: ['', Validators.required],
      contactNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(16)]],
      email: ['', [Validators.required,  Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$")]],
      website: ['', Validators.required],
      description: ['', Validators.required],
      status: [''],
      role_type: this.roleType == "alumni" ? "alumni": "admin"
    })
  }

  get f() { return this.jobForm.controls; }
  
/**
 * Function to Add job
 */
  async addJob() {
    this.submitted = true;
    this.jobForm.value.author = this.author;
    if(this.jobForm.invalid) {
      return;
    } else {
      if(this.updatedJob != "update-jobs") {
        await this.collaborateService.postData('create-jobs', this.jobForm?.value).subscribe((res: any) => {
          if (res?.status == 200) {
            this.router.navigate(['/careers-jobs/admin-jobs']);
          }
        });
      } else {
        await this.collaborateService.updateData('update-jobs', this.jobForm?.value).subscribe((res: any) => {
          if (res?.status == 200) {
            this.router.navigate(['/careers-jobs/admin-jobs']);
          }
        });
      }
    }
  }

  async getAllJobTypes() {
    let action: string = "all-jobType";
    await this.collaborateService.getAllData(action).subscribe((res: any) => {
      if(res?.status == 200) {
        this.internshipData = res?.data.filter((res: any) => {
          if(res?.status == 'active') return res;
        });
      }
    },error => {
      this.notify.notificationService.openFailureSnackBar(error?.message);
    })
  }

  clickToBack() {
    this.router.navigate(['/careers-jobs/admin-jobs']);
  }

}
