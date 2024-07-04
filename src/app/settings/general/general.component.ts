import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenInterceptor } from 'src/app/core/token.interceptor';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.scss']
})
export class GeneralComponent implements OnInit {
  settingForm: FormGroup;
  token: any;
  image: any;
  siteLogo: any;
  submitted: boolean;
  settingData: any;
  updateLogo: any;
  imgPath: any;
  loading: boolean = false;

  constructor(public fb: FormBuilder, 
    private dataService: DataService, 
    private notify: TokenInterceptor) {

    this.imgPath = environment?.imgUrl;
   }

  ngOnInit(): void {
    this.buildForm();
    this.getSetting();
    setTimeout(() => {
      this.updateLogo = this.settingData?.logo;
      console.log(this.updateLogo, 'update logo');

      this.settingForm.controls['id'].setValue(this.settingData?.id);
      this.settingForm.controls['appName'].setValue(this.settingData?.appName);
      this.settingForm.controls['address'].setValue(this.settingData?.address);
      this.settingForm.controls['email'].setValue(this.settingData?.email);
      this.settingForm.controls['mobileNumber'].setValue(this.settingData?.mobileNumber);
      this.settingForm.controls['facebook'].setValue(this.settingData?.facebook);
      this.settingForm.controls['instagram'].setValue(this.settingData?.instagram);
      this.settingForm.controls['linkedin'].setValue(this.settingData?.linkedin);
      this.settingForm.controls['youtube'].setValue(this.settingData?.youtube);
      this.settingForm.controls['twitter'].setValue(this.settingData?.twitter);
      this.settingForm.controls['footerText'].setValue(this.settingData?.footerText);
      
      console.log(this.updateLogo);
    }, 2000);
  }

  buildForm() {
    this.settingForm = this.fb.group({
      id: [''],
      appName: ['', Validators.required],
      address: ['', Validators.required],
      email: ['',  [Validators.required, Validators.pattern(
        "^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([A-Za-z]{2,6}(?:\\.[A-Za-z]{2,6})?)$"
      )]],
      mobileNumber: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(16)]],
      facebook: ['', Validators.required],
      instagram: ['', Validators.required],
      linkedin: ['', Validators.required],
      youtube: ['', Validators.required],
      twitter: ['', Validators.required],
      footerText: ['', Validators.required],
      logo: [''],
    });
  }

  get f() {
    return this.settingForm.controls;
  }

  /**
   * Get All Setting Data
   */
  getSetting(){
    this.loading = true;
    this.dataService.getSetting("single-setting", 1).subscribe((x:any) => {
      if(x?.status == 200) {
        this.settingData = x?.data;
        this.loading = false;
      } else{
        this.notify.notificationService.warning("Something went wrong");
        this.loading = false;
      }
    }, err => {
      this.notify.notificationService.error(err?.message);
      this.loading = false;
    })
  }

  /**
   * Function to Upload File
   * @param event 
   */
  onUploadImage(event: any) {
    this.siteLogo = event.target.files[0];
    if (event?.target?.files && event?.target?.files[0]) {
      this.siteLogo = event?.target?.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (_event) => {
        this.image = _event.target?.result;
      }
    }
  }

  /**
   * Function to save/update setting
   * @returns 
   */
  async save() {
    this.submitted = true;
    if (this.settingForm.invalid) {
      return;
    } else {
      this.loading = true;
      let action: string = "update-setting";
      let params = {
        action: action,
        id:this.settingForm?.value?.id
      }
      let formData = new FormData();

      formData.append('logo', (this.siteLogo) ? this.siteLogo : '');
      formData.append('appName', this.settingForm?.value?.appName);
      formData.append('address', this.settingForm?.value?.address);
      formData.append('email', this.settingForm?.value?.email);
      formData.append('mobileNumber', this.settingForm?.value?.mobileNumber);
      formData.append('facebook', this.settingForm?.value?.facebook);
      formData.append('instagram', this.settingForm?.value?.instagram);
      formData.append('linkedin', this.settingForm?.value?.linkedin);
      formData.append('youtube', this.settingForm?.value?.youtube);
      formData.append('twitter', this.settingForm?.value?.twitter);
      formData.append('footerText', this.settingForm?.value?.footerText);

      this.dataService.postData(params, formData).subscribe((x:any) => {
        if(x?.status == 200) {
          this.notify.notificationService.success(x?.message);
          this.ngOnInit();
          this.loading = false;
        } else {
          this.notify.notificationService.warning("Something went wrong!");
          this.loading = false;
        }
      },
      error => {
        this.notify.notificationService.error(error?.message);
        this.loading = false;
      })
    }
  }
  
}
