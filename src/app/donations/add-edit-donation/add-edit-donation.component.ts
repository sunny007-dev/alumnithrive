import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { TokenInterceptor } from 'src/app/core/token.interceptor';
import { Config } from 'src/app/services/config';
import { DonationsService } from 'src/app/services/donations.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-add-edit-donation',
  templateUrl: './add-edit-donation.component.html',
  styleUrls: ['./add-edit-donation.component.scss']
})
export class AddEditDonationComponent implements OnInit {

  @ViewChild("stepper", { static: false }) stepper: MatStepper;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  status: any;
  currentUser: any;
  pageType: any;
  donationId: any;
  loading : boolean;
  donationData : any;
  submitted: boolean;
  donationCategory: Array<any> = [];
  imgId: any;
  allFiles: Array<any> = [];
  seletedFile: any;
  allImages: any;
  fileList: Array<any> = [];
  listOfFiles: Array<any> = [];
  donationType: any;

  constructor(
    public fb: FormBuilder,
    private donationService: DonationsService,
    public aroute: ActivatedRoute,
    public router: Router,
    private notify: TokenInterceptor,
    private config: Config,
    private userService: UsersService
  ) {
    this.currentUser = this.userService.getCurrentUser();

    this.status = this.config.status;
    this.donationType = this.config?.donationType;
    // Get Id by queryparams
    this.aroute.queryParams.subscribe(async (params: any) => {
      this.pageType = params?.action;
      this.donationId = params?.id;

      //Get Single gallery data by Id
      if (this.donationId) {
        this.loading = true;
        await this.donationService
          .getDataById("single-donation", this.donationId)
          .subscribe((res: any) => {
            this.donationData = res?.data;
            this.firstFormGroup.patchValue({
              ...this.donationData,
            });
            this.loading = false;
          });
      }
    });
  }

  ngOnInit(): void {
    this.buildFirtGroup();
    this.buildSecondGroup();
    this.getAllCategory();
  }

  /**
   * Build Form data
   */
  buildFirtGroup() {
    this.firstFormGroup = this.fb.group({
      id:[''],
      user_id: [this.currentUser?.id],
      donation_title: ['', Validators.required],
      donation_description: ['', Validators.required],
      donation_type: ['', Validators.required],
      donation_amount: ['', Validators.required],
      donation_target_amount: ['',Validators.required],
      donation_category_id: ['',Validators.required],
      order: [''],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      status: ['', Validators.required]
    },{
        validators: 
        [
          this.config?.dateLessThan('start_date', 'end_date')
        ]
      }
    );
  }

  buildSecondGroup() {
    this.secondFormGroup = this.fb.group({
      id:[''],
      donation_id: [''],
      images: [[], Validators.required]
    });
  }

  /**
   * Function to Add/Edit donation
   * @returns 
   */
  async save() {
    this.submitted = true;
    if(this.firstFormGroup.invalid) {
      return;
    } else {
      // console.log(this.firstFormGroup.value, this.pageType);
      await this.donationService.postData(this.pageType, this.firstFormGroup.value).subscribe((res:any) => {
        if(res?.status == 200) { 
          this.imgId = res?.id
          this.notify.notificationService.success(res?.message);
          setTimeout(() => {
            this.stepper.next();
          }, 800);
        }
      },
      error => {
        this.notify.notificationService.error(error?.message);
      })
    }
  }

  async uploadFiles() {
    this.submitted = true;
    // console.log(this.secondFormGroup?.value);

    // if(this.secondFormGroup.invalid) {
    //   return;
    // } else {
      let action: string = "create-donationImages";
      this.secondFormGroup.get("images").setValue(this.fileList);
      // console.log(typeof this.secondFormGroup?.value.images);
      // console.log(typeof this.fileList);

      let formData = new FormData();
      formData.append('images', this.secondFormGroup?.value?.images);
      formData.append('donation_id', this.imgId );

      await this.donationService.postData(action, formData).subscribe((res:any) => {
        if(res?.status == 200) { 
          this.notify.notificationService.success(res?.message);
        }
      },
      error => {
        this.notify.notificationService.error(error?.message);
      })
    // }
  }
  /**
   * Function to get all donation category
   */
  async getAllCategory() {
    let action : string = "all-donationCategories";
    await this.donationService.getAllData(action).subscribe((res: any) => {
      this.donationCategory = res?.Donation;
    })
  }

  // getFileDetails(e) {
  //   for (var i = 0; i < e.target.files.length; i++) { 
  //     this.allFiles.push(e.target.files[i]);
  //   }
  // }

  onFileChanged(event: any) {
    for (var i = 0; i <= event.target.files.length - 1; i++) {
      var selectedFile = event.target.files[i];
      if (this.listOfFiles.indexOf(selectedFile.name) === -1) {
        this.fileList.push(event.target.files[i]);
        this.listOfFiles.push(selectedFile.name);
      }
    }
  }

  removeSelectedFile(index) {
    // Delete the item from fileNames list
    this.listOfFiles.splice(index, 1);
    // delete file from FileList
    this.fileList.splice(index, 1);
  }

  /**
   * Function to remove item by their index
   * @param i 
   */
  removeItems(i:any) {
    this.allFiles.splice(i, 1);
  }

  /**
   * Function to get all images
   */
  async getAllImages() {
    let action: string = "all-donationImages";
    await this.donationService.getAllData(action).subscribe((res:any) => {
      console.log(res)
      if(res?.status == 200) {
        this.allImages = res.Donation;
      }
    })
  }
}
