import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenInterceptor } from 'src/app/core/token.interceptor';
import { CollaborateService } from 'src/app/services/collaborate.service';
import { Config } from 'src/app/services/config';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-edit-special-project',
  templateUrl: './add-edit-special-project.component.html',
  styleUrls: ['./add-edit-special-project.component.scss']
})
export class AddEditSpecialProjectComponent implements OnInit {
  editSpecialForm: FormGroup;
  pageType: any;
  projectId: number;
  loading: boolean;
  submitted: boolean;
  status: any;
  author: any;
  currentUser: any;
  projectMode: any;
  profilePic: any;
  image:any;
  singleProject: any;
  updatedImg: any;
  imgPath: any;

  constructor(public fb: FormBuilder, public arouter: ActivatedRoute,
    private collaborateService: CollaborateService, public config: Config,
    public notifyService: TokenInterceptor, public router: Router,
    private userService: UsersService) { 
      this.status = this.config?.status;
      this.projectMode = this.config?.projectMode;
      this.imgPath = environment?.imgUrl;
      this.currentUser = this.userService.getCurrentUser();
    }

  ngOnInit() {
    let fname = this.currentUser?.first_name;
    let lname = this.currentUser?.last_name;
    let mname = this.currentUser?.middle_name;
    this.author = fname + (mname == null ? "" : " " + mname) + " " + lname;
    this.buildForm();
    // Get Queryparams
    this.arouter.queryParams.subscribe((res: any) => {
      this.pageType = res?.action;
      this.projectId = res?.id;
    });
    if(this.projectId) this.getSingleProject();
    console.log(this.pageType);
  }
/**
 * Function to get single project detail by id
 */
  async getSingleProject(){
    this.loading = true;
    let action  = 'single-project';
    await this.collaborateService.getDataById(action, this.projectId).subscribe((res:any) => {
      setTimeout(() => {
        this.singleProject = res?.data;
        this.updatedImg = this.singleProject?.pageType;

        this.editSpecialForm.get('title').setValue(this.singleProject?.title);
        this.editSpecialForm.get('charityName').setValue(this.singleProject?.charityName);
        this.editSpecialForm.get('monetaryDonation').setValue(this.singleProject?.monetaryDonation);
        this.editSpecialForm.get('timeDonation').setValue(this.singleProject?.timeDonation);
        this.editSpecialForm.get('contactName').setValue(this.singleProject?.contactName);
        this.editSpecialForm.get('mobileNumber').setValue(this.singleProject?.mobileNumber);
        this.editSpecialForm.get('email').setValue(this.singleProject?.email);
        this.editSpecialForm.get('link').setValue(this.singleProject?.link);
        this.editSpecialForm.get('status').setValue(this.singleProject?.status);
        this.editSpecialForm.get('description').setValue(this.singleProject?.description);
        this.loading = false;
      }, 500);
      // this.editSpecialForm.patchValue({...res?.data});
      // this.loading = false;
    });  
  }
/**
 * Function to Build form data
 */
  buildForm() {
    this.editSpecialForm = this.fb.group({
      id: [''],
      // author: [this.author],
      title: ['', Validators.required],
      charityName: ['', Validators.required],
      monetaryDonation: [false],
      timeDonation: [false],
      contactName: ['', Validators.required],
      code: [''],
      mobileNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(16)]],
      email: ['', [Validators.required, Validators.pattern("^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([A-Za-z]{2,6}(?:\\.[A-Za-z]{2,6})?)$")]],
      link: ['', Validators.required],
      // project_mode: ['', Validators.required],
      projectImage: [''],
      status: ['', Validators.required],
      description: ['', Validators.required]
    });
  }
/**
 * Function to Add/Update Project data
 * @returns 
 */
  async save() {
    this.submitted = true;
    let action = {
      action: this.pageType == "update-project" ? "update-project" : "create-project",
      id: this.pageType == 'update-project' ? this.projectId : ""
    }
    if(this.editSpecialForm?.invalid){
      return;
    } else {
      console.log(action)
      let formData = new FormData();
      formData.append("projectImage", this.profilePic ? this.profilePic : "");
      formData.append('title', this.editSpecialForm?.value?.title);
      formData.append('charityName', this.editSpecialForm?.value?.charityName);
      formData.append('contactName', this.editSpecialForm?.value?.contactName);
      formData.append('mobileNumber', this.editSpecialForm?.value?.mobileNumber);
      formData.append('email', this.editSpecialForm?.value?.email);
      formData.append('link', this.editSpecialForm?.value?.link);
      formData.append('monetaryDonation', this.editSpecialForm?.value?.monetaryDonation);
      formData.append('timeDonation', this.editSpecialForm?.value?.timeDonation);
      formData.append('code', this.editSpecialForm?.value?.code);
      formData.append('status', this.editSpecialForm?.value?.status);
      formData.append('description', this.editSpecialForm?.value?.description);

      await this.collaborateService.postData(action, formData).subscribe((res: any) => {
        if(res?.status == 200) {
          this.notifyService.notificationService.success(res?.message);
          this.router.navigate(['/collaborate/special-projects']);
        } else{
          this.notifyService.notificationService.warning("Something went wrong! Please try again");
        }
      }, error => {
        this.notifyService.notificationService.error(error?.message);
      });

      // if(this.pageType === "update-project"){
      //   await this.collaborateService.updateData(this.pageType, this.editSpecialForm.value).subscribe((x: any) => {
      //     if(x?.status == 200) {
      //       this.notifyService.notificationService.success(x?.message);
      //       this.router.navigate(['/collaborate/special-projects']);
      //     } else{
      //       this.notifyService.notificationService.warning("Something went wrong! Please try again");
      //     }
      //   }, error => {
      //     this.notifyService.notificationService.error(error?.message);
      //   });
      // } else {
      //   await this.collaborateService.postData(this.pageType, this.editSpecialForm.value).subscribe((x: any) => {
      //     if(x?.status == 200) {
      //       this.notifyService.notificationService.success(x?.message);
      //       this.router.navigate(['/collaborate/special-projects']);
      //     } else {
      //       this.notifyService.notificationService.warning("Something went wrong! Please try again");
      //     }
      //   }, error => {
      //     this.notifyService.notificationService.error(error?.message);
      //   });
      // }
    }
  }

  onUploadImage(event: any) {
    this.profilePic = event?.target?.files[0];
    if (event?.target?.files && event?.target?.files[0]) {
      this.profilePic = event?.target?.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(event?.target?.files[0]);
      reader.onload = (_event) => {
        this.image = _event?.target?.result;
      }
    }
  }

}
