import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenInterceptor } from 'src/app/core/token.interceptor';
import { CollaborateService } from 'src/app/services/collaborate.service';
import { Config } from 'src/app/services/config';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-add-edit-expertise',
  templateUrl: './add-edit-expertise.component.html',
  styleUrls: ['./add-edit-expertise.component.scss']
})
export class AddEditExpertiseComponent implements OnInit {
  expertiseForm: FormGroup;
  pageType: any;
  expertiseId: number;
  loading: boolean;
  submitted: boolean;
  status: any;
  author: any;
  currentUser: object;

  constructor(public fb: FormBuilder, public arouter: ActivatedRoute,
    private collaborateService: CollaborateService, public config: Config,
    public notifyService: TokenInterceptor, public router: Router, private userSerive: UsersService) { 
      this.status = this.config?.status;
      this.currentUser = this.userSerive.getCurrentUser();
    }

  ngOnInit() {
    // this.buildForm();
    // let fname = this.currentUser?.first_name;
    // let lname = this.currentUser?.last_name;
    // let mname = this.currentUser?.middle_name;
    // this.author = fname + (mname == null ? "" : " " + mname) + " " + lname;
    // Get Queryparams
    this.arouter.queryParams.subscribe((res: any) => {
      this.pageType = res?.action;
      this.expertiseId = res?.id;
    });
    if(this.expertiseId) this.getSingleProject(this.expertiseId);
    console.log(this.pageType);
  }
/**
 * Function to get single project detail by id
 */
  async getSingleProject(id:number){
    this.loading = true;
    let action  = 'single-expertise';
    await this.collaborateService.getDataById(action, id).subscribe((res:any) => {
      // this.editSpecialForm.patchValue({...res?.data[0]});
      this.loading = false;
    });  
  }
}
