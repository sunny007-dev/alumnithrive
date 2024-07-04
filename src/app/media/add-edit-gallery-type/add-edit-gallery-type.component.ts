import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenInterceptor } from 'src/app/core/token.interceptor';
import { CelebrateService } from 'src/app/services/celebrate.service';
import { Config } from 'src/app/services/config';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-edit-gallery-type',
  templateUrl: './add-edit-gallery-type.component.html',
  styleUrls: ['./add-edit-gallery-type.component.scss']
})
export class AddEditGalleryTypeComponent implements OnInit {

  loading:boolean;
  status: any;
  typeId: any;
  form: FormGroup;
  pageType:any;
  submitted: boolean;
  imgUrl: any;
  galleryTypeImg: any;
  image: any;
  updatedImg: any;
  galleryData:any;

  constructor(
    public fb: FormBuilder, 
    public notifyService: TokenInterceptor, 
    private celebrateService: CelebrateService, 
    public arouter: ActivatedRoute,
    public router: Router, 
    private config: Config) { 
      this.status = this.config?.status;
      this.imgUrl = environment?.imgUrl;
    }


  async ngOnInit() {
    this.buildForm();
    this.arouter.queryParams.subscribe((res: any) => {
      this.pageType = res?.action;
      this.typeId = res?.id;
    });
    /**Get and single team data and Patch with form */
      if(this.typeId) this.getSingleGallery();
  }

  /**
   * Get data by Id
   */
  async getSingleGallery() {
    this.loading = true;
    let action: string = "single-galleryCategories";
    await this.celebrateService.getDataById(action, this.typeId).subscribe((res: any) => {
        this.galleryData = res?.data;
        console.log(this.galleryData)
        setTimeout(() => {
          this.updatedImg = this.galleryData?.galleryCategory_image;

          this.form.get('category_name').setValue(this.galleryData?.category_name);
          this.form.get('status').setValue(this.galleryData?.status);
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
      category_name: ['', Validators.required],
      galleryCategory_image: [],
      status: ['', Validators.required]
    })
  }

  /**
   * on upload image
   * @param event 
   */
    onUploadImage(event: any) {
      this.galleryTypeImg = event.target.files[0];
      if (event?.target?.files && event?.target?.files[0]) {
        this.galleryTypeImg = event?.target?.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]);
        reader.onload = (_event) => {
          this.image = _event.target?.result;
        }
      }
    }
  /**
   * Function to create/update event type
   */
    async save() {
      this.submitted = true;
      let action = {
        action: this.pageType == "update-galleryCategories" ? "update-galleryCategories" : "create-galleryCategories",
        id: this.pageType == 'update-galleryCategories' ? parseInt(this.typeId) : ""
      }
      if(this.form?.invalid){
        return;
      }
      else{
        let formData = new FormData();
        formData.append('galleryCategory_image', (this.galleryTypeImg) ? this.galleryTypeImg : '');
        formData.append('category_name', this.form?.value?.category_name);
        formData.append('status', this.form?.value?.status);

        await this.celebrateService.postData(action, formData).subscribe((res: any) => {
          if(res?.status == 200) {
            this.notifyService.notificationService.success(res?.message);
            this.router.navigate(['/media/gallery-category']);
          } else {
            this.notifyService.notificationService.warning("Something went wrong!");
          }
        }, err => {
          this.notifyService.notificationService.error(err?.message);
        });
      }
    }

}
