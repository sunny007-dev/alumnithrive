import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { TokenInterceptor } from "src/app/core/token.interceptor";
import { CelebrateService } from "src/app/services/celebrate.service";
import { Config } from "src/app/services/config";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-add-edit-gallery",
  templateUrl: "./add-edit-gallery.component.html",
  styleUrls: ["./add-edit-gallery.component.scss"],
})
export class AddEditGalleryComponent implements OnInit {
  galleryForm: FormGroup;
  profilePic: any;
  image: any;
  action: any;
  currentUser: any;
  pageType: any;
  galleryId: any;
  submitted: boolean;
  loading: boolean;
  status: any;
  galleryData: any;
  updatedImg: any;
  imgPath: any;
  galleryType: any;

  constructor(
    public fb: FormBuilder,
    private celebrateService: CelebrateService,
    public aroute: ActivatedRoute,
    public router: Router,
    private notify: TokenInterceptor,
    private config: Config
  ) {
    this.status = this.config.status;
    this.imgPath = environment?.imgUrl;
    if (localStorage) {
      this.currentUser = JSON.parse(localStorage.getItem("currentUser") || "");
    }
    // Get Id by queryparams
    this.aroute.queryParams.subscribe(async (params: any) => {
      this.pageType = params?.action;
      this.galleryId = params?.id;

      //Get Single gallery data by Id
      if (this.galleryId) this.singleData(this.galleryId);
    });
  }

  async singleData(id: any) {
    this.loading = true;
    await this.celebrateService
      .getDataById("single-gallery", this.galleryId)
      .subscribe((res: any) => {
        this.galleryData = res?.data;
        this.updatedImg = this.galleryData?.file;

        this.galleryForm.get('title').setValue(this.galleryData?.title);
        this.galleryForm.get('category_id').setValue(this.galleryData?.category_id);
        this.galleryForm.get('link').setValue(this.galleryData?.link);
        this.galleryForm.get('order_by').setValue(this.galleryData?.order_by);
        this.galleryForm.get('status').setValue(this.galleryData?.status);
        this.loading = false;
      });
  }

  ngOnInit(): void {
    this.buildForm();
    this.getGalleryCategory();
  }

  /**
   * Function to Build form data
   */
  buildForm() {
    this.galleryForm = this.fb.group({
      id: [""],
      title: ["", Validators.required],
      link: [""],
      category_id: ["", Validators.required],
      category: ["gallery"],
      order_by: [""],
      image: [""],
      status: [""],
    });
  }

  /**
   * Function to Add/Edit Gallery
   */
  async save() {
    this.submitted = true;
    if (this.galleryForm.invalid) {
      return;
    } else {
      let action = {
        action: this.pageType,
        id: this.pageType == "update-gallery" ? parseInt(this.galleryId) : "",
      };
      let formData = new FormData();
      formData.append("image", this.profilePic ? this.profilePic : "");
      formData.append("title", this.galleryForm.value.title);
      formData.append("link", this.galleryForm.value.link);
      formData.append("category_id", this.galleryForm.value.category_id);
      formData.append("order_by", this.galleryForm.value.order_by);
      formData.append("status", this.galleryForm.value.status);

      await this.celebrateService.postData(action, formData).subscribe(
        (res: any) => {
          if (res?.status == 200) {
            this.notify.notificationService.success(res?.message);
            this.router.navigate(['/media/gallery']);
          } else {
            this.notify.notificationService.warning("Something went wrong! Please try again");
          }
        },
        (error) => {
          this.notify.notificationService.error(error?.message);
        }
      );
    }
  }

  onUploadImage(event: any) {
    this.profilePic = event.target.files[0];
    if (event?.target?.files && event?.target?.files[0]) {
      this.profilePic = event?.target?.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (_event) => {
        this.image = _event.target?.result;
      };
    }
  }

  /**
   * Function to get all gallery Type
   */
  async getGalleryCategory() {
    let action:string = "all-galleryCategories"
    await this.celebrateService.getAllData(action).subscribe((res: any) => {
      if(res?.status == 200){
        this.galleryType = res?.data;
      } else {
        this.notify.notificationService.warning("Something went wrong! Please try again");
      }
    })
  }
}
