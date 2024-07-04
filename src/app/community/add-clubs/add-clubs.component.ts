import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { TokenInterceptor } from 'src/app/core/token.interceptor';
import { CommunityService } from 'src/app/services/community.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-clubs',
  templateUrl: './add-clubs.component.html',
  styleUrls: ['./add-clubs.component.scss']
})
export class AddClubsComponent implements OnInit {

  addClubForm: FormGroup;
  submitted: boolean = false;
  clubData: any;
  newClubId: any;
  clubPic: any;
  image: any;
  updatedClub: any;
  updatedClubData: any;
  imgPath: any;  
  clubStatus: any;
  clubType: any;
  clubDescription: any;
  loading: any;
  display: number = 1;
  updatedImg: any;

  constructor(public fb: FormBuilder, public router: Router, 
    public location: Location, private communityService: CommunityService,
    private notify: TokenInterceptor,
    public arouter: ActivatedRoute) { 
      this.imgPath = environment.imgUrl;
    }

  async ngOnInit() {
    this.buildForm();
    this.getAllClubTypes();
    this.arouter.queryParams.subscribe((res: any) => {
      console.log(res);
      this.newClubId = res?.clubId;
      this.updatedClub = res?.action;

      if(this.newClubId){
        this.getSingleClub(this.newClubId);
      }
    });
  }

  async getSingleClub(id) {
    this.loading = true;
    await this.communityService.getDataById('single-club', id).subscribe((res:any) => {
      if(res?.status == 200) {
        setTimeout(() => {
          this.updatedClubData = res?.data[0];
          this.updatedImg = this.updatedClubData?.clubImage;
  
          this.addClubForm.get('name').setValue(this.updatedClubData?.name);
          this.addClubForm.get('clubsType_id').setValue(this.updatedClubData?.clubsType_id);
          this.addClubForm.get('status').setValue(this.updatedClubData?.status);
          this.addClubForm.get('description').setValue(this.updatedClubData?.description);
          this.loading = false;
        }, 500);
      }
    }, error=> {
      this.loading = false;
      this.notify.notificationService.error(error?.message);
    });
  }

  buildForm() {
    this.addClubForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
      clubsType_id: ['', Validators.required],
      clubImage: [''],
      status: ['', Validators.required]
    });
  }
  
  get f() {
    return this.addClubForm.controls;
  }

  onUploadImage(event: any) {
    this.clubPic = event.target.files[0];
    if (event?.target?.files && event?.target?.files[0]) {
      this.clubPic = event?.target?.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (_event) => {
        this.image = _event.target?.result;
      }
    }
  }

  cancel(){
    this.router.navigate(['/community/clubs']);
  }

  async getAllClubTypes() {
    let action: string = "all-clubType";
    await this.communityService.getAllData(action).pipe(
      map((res: any) => {
        return res?.data.filter((item: any) => {
          if (item?.status == "active") {
            return item;
          }
        });
      })
    ).subscribe((res: any) => {
      this.clubData = res;
    },error => {
      this.notify.notificationService.error(error?.message);
    })
  }

  async save() {
    this.submitted = true;
    if(this.addClubForm.invalid) {
      return;
    } else {
      let action = {
        action: this.updatedClub ? this.updatedClub : 'create-club',
        id: this.updatedClub == undefined ? '' : parseInt(this.newClubId)
      }

      let formData = new FormData();
      formData.append('clubImage', (this.clubPic) ? this.clubPic : '');
      formData.append('name', this.addClubForm?.value?.name);
      formData.append('description', this.addClubForm?.value?.description);
      formData.append('clubsType_id', this.addClubForm?.value?.clubsType_id);
      formData.append('status', this.addClubForm?.value?.status);
      
      await this.communityService.postData(action, formData).subscribe((item: any) => {
        if(item?.status == 200) {
          this.notify.notificationService.success(item?.message);
          this.router.navigate(['/community/clubs']);
        }
      },error=> {
          this.notify.notificationService.error(error?.message);
      });
    }
  }

    /**
   * Change view mode
   * @param mode 
   */
    changeView(mode: number): void {
      this.display = mode;
    }
}
