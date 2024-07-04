import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenInterceptor } from 'src/app/core/token.interceptor';
import { Config } from 'src/app/services/config';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-add-edit-queries',
  templateUrl: './add-edit-queries.component.html',
  styleUrls: ['./add-edit-queries.component.scss']
})
export class AddEditQueriesComponent implements OnInit {
  form: FormGroup;
  submitted: boolean = false;
  pageType: any;
  queryId: any;
  loading: boolean;
  keyData: any;
  status: any;

  constructor(
    public fb: FormBuilder,
    private contactService: ContactService, private notifyService: TokenInterceptor,
    public aroute: ActivatedRoute, public router: Router, private config: Config) {
    this.status = this.config?.status; 
        // Get Id by queryparams
    this.aroute.queryParams.subscribe(async (params: any) => {
      this.pageType = params?.action;
      this.queryId = params?.id;
    });
  }

  ngOnInit(): void {
    this.buildForm();
    if(this.queryId) this.getSingleKeyContact();
  }

  /**
   * Function to get single contact data by id
   */
  async getSingleKeyContact() {
       //Get Single gallery data by Id
       if (this.queryId) {
        this.loading = true;
        await this.contactService
          .getDataById("single-contactQueries", this.queryId)
          .subscribe((res: any) => {
            this.keyData = res?.data;
            this.form.patchValue({
              ...this.keyData,
            });
            this.loading = false;
          });
      }
  }
/**
 * Build form data
 */
  buildForm() {
    this.form = this.fb.group({
      id: [''],
      full_name: ['', Validators.required],
      subject: ['', Validators.required],
      email: ['', [
        Validators.required,
        Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$"),
      ]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(14)]],
      description: ['', Validators.required]
    });
  }

  /**
   * Function to Add/Edit Contact
   * @returns 
   */
  async save() {
    this.submitted = true;
    if(this.form.invalid){
      return;
    } else {
      if(this.pageType == "update-contactQueries") {
        await this.contactService.updateData(this.pageType, this.form?.value).subscribe((item: any) => {
          if(item.status == 200){
            this.notifyService.notificationService.success(item?.message);
            this.router.navigate(['/contact/queries']);
          }
        }, error => {
            this.notifyService.notificationService.error(error?.message);
        });
      }
    }
  }


}
