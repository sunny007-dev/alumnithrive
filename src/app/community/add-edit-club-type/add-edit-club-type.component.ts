import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenInterceptor } from 'src/app/core/token.interceptor';
import { CommunityService } from 'src/app/services/community.service';
import { Config } from 'src/app/services/config';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-edit-club-type',
  templateUrl: './add-edit-club-type.component.html',
  styleUrls: ['./add-edit-club-type.component.scss']
})
export class AddEditClubTypeComponent implements OnInit {

  clubTypeForm: FormGroup;
  submitted:boolean;
  clubId: any;
  clubData: any;
  pageType: any;
  status: any;
  loading: boolean;
  clubTypeImg: any;
  image: any;
  updatedImg: any;
  imgUrl: any;

  constructor(public fb: FormBuilder, public notifyService: TokenInterceptor, 
    private communityServie: CommunityService, public arouter: ActivatedRoute,
    public router: Router, private config: Config) { 
      this.status = this.config?.status;
      this.imgUrl = environment?.imgUrl;
    }

  async ngOnInit() {
    this.buildForm();
    this.arouter.queryParams.subscribe((res: any) => {
      this.pageType = res?.action;
      this.clubId = res?.id;
    });
    /**Get and single team data and Patch with form */
      if(this.clubId) {
        this.loading = true;
        let action: string = "single-clubType";
        await this.communityServie.getDataById(action, this.clubId).subscribe((x: any) => {
            this.clubData = x?.data;
            setTimeout(() => {
              this.updatedImg = this.clubData?.club_type_image;

              this.clubTypeForm.get('type').setValue(this.clubData?.type);
              this.clubTypeForm.get('status').setValue(this.clubData?.status);

            }, 500);
            this.loading = false;
        });
    }
  }
  /**
   * Build Form
   */
  buildForm() {
    this.clubTypeForm = this.fb.group({
      id: [''],
      type: ['', Validators.required],
      club_type_image: [],
      status: ['', Validators.required]
    });
  } 
  
/**
 * on upload image
 * @param event 
 */
  onUploadImage(event: any) {
    this.clubTypeImg = event.target.files[0];
    if (event?.target?.files && event?.target?.files[0]) {
      this.clubTypeImg = event?.target?.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (_event) => {
        this.image = _event.target?.result;
      }
    }
  }
/**
 * Function to Add/Edit club Type
 * @returns 
 */
  async save() {
    this.submitted = true;
    let action = {
      action: this.pageType == "update-clubType" ? "update-clubType" : "create-clubType",
      id: this.pageType == 'update-clubType' ? parseInt(this.clubId) : ""
    }

    if(this.clubTypeForm.invalid) {
      return
    } else {
        let formData = new FormData();
        formData.append('club_type_image', (this.clubTypeImg) ? this.clubTypeImg : '');
        formData.append('type', this.clubTypeForm?.value?.type);
        formData.append('status', this.clubTypeForm?.value?.status);

        await this.communityServie.postData(action, formData).subscribe((res: any) => {
          if(res?.status == 200) {
            this.notifyService.notificationService.success(res?.message);
            this.router.navigate(['/community/club-types']);
          }
        });
      // else {
        
      //   await this.communityServie.updateData(this.pageType, this.clubTypeForm?.value).subscribe((res: any) => {
      //     if(res?.status == 200) {
      //       this.notifyService.notificationService.success(res?.message);
      //       this.router.navigate(['/community/club-types']);
      //     }
      //   });
      // }
    }
  }
}
