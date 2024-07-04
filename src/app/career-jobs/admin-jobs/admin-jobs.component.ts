import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TokenInterceptor } from 'src/app/core/token.interceptor';
import { Person } from 'src/app/models/person';
import { CollaborateService } from 'src/app/services/collaborate.service';
import { Config } from 'src/app/services/config';
import { UsersService } from 'src/app/services/users.service';
import { DeletedialogComponent } from 'src/app/shared/dialog/deletedialog/deletedialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-jobs',
  templateUrl: './admin-jobs.component.html',
  styleUrls: ['./admin-jobs.component.scss']
})
export class AdminJobsComponent implements OnInit {
  imgPath: any;
  jobType: any;

  searchForm : FormGroup;
  formReset: boolean;
  pageType = "admin jobs";

  titleChecked: boolean = true;
  locationChecked: boolean;
  companyChecked: boolean;
  emailChecked: boolean;
  personChecked: boolean;
  numberChecked: boolean;
  applyChecked: boolean;
  typeChecked: boolean;
  qualificationChecked: boolean;
  salaryChecked: boolean;
  statusChecked: boolean;
 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['author', 'companyName', 'title'];
  public columnsToDisplay: string[] = ['sr.no', 'profile_pic', ...this.displayedColumns, 'status', 'actions'];

  /**
   * it holds a list of active filter for each column.
   * example : {firstName: {contains : 'person 1'}}
   **/
  public columnsFilters = {};

  public dataSource: MatTableDataSource<Person>;
  status: any;
  display: number = 1;
  adminJobs: any;

  constructor(
    private collaborateService: CollaborateService, 
    public dialog: MatDialog,
    public router: Router,
    private notify: TokenInterceptor,
    private config: Config,
    private fb: FormBuilder,
    private userService: UsersService
    ) {
      this.status = this.config?.isOpen;
      this.dataSource = new MatTableDataSource<Person>();
      this.imgPath = environment?.imgUrl;
  }

  /**
   * initialize data-table by providing persons list to the dataSource.
   */
  ngOnInit(): void {
    this.buildForm();
    this.getJobType();
    this.getAllData();
  }

/**
 * Build search filter form
 */
  buildForm() {
    this.searchForm = this.fb.group({
      title: [""],
      location: [""],
      companyName: [""],
      email:[""],
      contactPerson: [""],
      contactNumber: [""],
      fresherApply: [""],
      type: [""],
      qualification:[""],
      salary:[""],
      status: [""],
      filterType: ['']
    });
  }

  add() {
    this.router.navigate(['/careers-jobs/add-job'],{queryParams: {role_type:"admin"}});
  }

  view(data: any) {
    this.router.navigate(['/careers-jobs/view-job'], {queryParams: { id: data?.id, type: "admin-jobs" }});
  }

  edit(data: Person, params: string) {
    this.router.navigate(['/careers-jobs/add-job'], {queryParams: { jobId: data, action: params, role_type:"admin" }, skipLocationChange: true});
  }

  delete(data: any, params: string) {
    let action: string = "delete-jobs";
    const dialogRef = this.dialog.open(DeletedialogComponent, {
      width: '400px',
      data: { data: params, info: params }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.collaborateService.deleteData(action, data?.id).subscribe((res: any) => {
          if(res?.status == 200) {
            this.notify.notificationService?.success(res?.message);
            this.ngOnInit();
          } 
        })
      }
    });
  }

  async onStatusChange(e:any, params: any) {
    let action = "update-jobs";
      let param = {
        id: params?.id,
        status: e?.target?.value
      }
      await this.collaborateService.updateData(action, param).subscribe((res: any) => {
        if(res?.status == 200) {
          this.notify.notificationService?.success(res?.message);
          this.ngOnInit();
        }
      }, error => {
          this.notify.notificationService?.error(error?.message);
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async getAllData() {
    let action = "all-jobs";
    await this.collaborateService.getAllData(action).subscribe(
      (res: any) => {
        if(res?.status == 200) {
          this.dataSource.data = res?.data.filter((x:any) => {
            return x?.role_type == "admin";
          });
          this.adminJobs = this.dataSource?.data;
        }
      },
      (error) => {
          this.notify.notificationService?.error(error?.message);
      }
    );
  }


    /**
   * Function to filter entrepreneurship table records
   */
    async searchData() {
      let isValue = Object.keys(this.searchForm.value).some(
        (value) => !!this.searchForm.value[value]
      );
      if (!isValue) {
        this.formReset = false;
        this.notify.notificationService.warning(
          "At least one field should be selected"
        );
      } else {
        this.adminJobs = [];
        this.formReset = true;
        this.searchForm.get("filterType").setValue(this.pageType);
        await this.userService
          .filterData(this.searchForm?.value)
          .subscribe((res: any) => {
              this.adminJobs = res?.data;
              this.dataSource.data = this.adminJobs;
          });
      }
    }
  
  /**
   * Function to Reset Search Form filter
   */
  resetForm() {
    this.searchForm.reset(this.buildForm());
    this.getAllData();
    this.locationChecked = false;
    this.companyChecked = false;
    this.emailChecked = false;
    this.personChecked = false;
    this.numberChecked = false;
    this.applyChecked = false;
    this.typeChecked = false;
    this.qualificationChecked = false;
    this.salaryChecked = false;
    this.statusChecked = false;
    this.formReset = false;
  }

  /**
   * Function to get all jobs
   */
  async getJobType() {
    let action:string = "all-jobType";
    await this.collaborateService.getAllData(action).subscribe((res:any) => {
      if(res?.status == 200) {
        this.jobType = res?.data;
      }
    })
  }
  /**
   * Change view mode
   * @param mode 
   */
  changeView(mode: number): void {
    this.display = mode;
  }
}
