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
import { AddEditParticipateAdmissionComponent } from 'src/app/shared/dialog/collaborate/add-edit-participate-admission/add-edit-participate-admission.component';
import { ViewUserListComponent } from 'src/app/shared/dialog/collaborate/view-user-list/view-user-list.component';
import { DeletedialogComponent } from 'src/app/shared/dialog/deletedialog/deletedialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-participate-in-admission-panel',
  templateUrl: './participate-in-admission-panel.component.html',
  styleUrls: ['./participate-in-admission-panel.component.scss']
})
export class ParticipateInAdmissionPanelComponent implements OnInit {
  imgPath: any;
  getAllAdmission: Array<any> = [];

  searchForm : FormGroup;
  formReset: boolean;
  pageType = "admission panel";

  locationChecked: boolean = true;
  cityChecked: boolean;
  dateChecked: boolean;
  statusChecked: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['city', 'location', 'date_time'];
  public columnsToDisplay: string[] = ['sr.no', 'profile_pic', ...this.displayedColumns, 'userList','is_active', 'actions'];

  /**
   * it holds a list of active filter for each column.
   * example : {firstName: {contains : 'person 1'}}
   **/
  public columnsFilters = {};

  public dataSource: MatTableDataSource<Person>;
  status: any;

  constructor(
    private collaborateService: CollaborateService, 
    public dialog: MatDialog,
    public router: Router,
    private notify: TokenInterceptor,
    private config: Config,
    private fb: FormBuilder,
    private userService: UsersService
    ) {
      this.status = this.config?.status;
      this.dataSource = new MatTableDataSource<Person>();
      this.imgPath = environment?.imgUrl;
  }

  /**
   * initialize data-table by providing persons list to the dataSource.
   */
  ngOnInit(): void {
    this.buildForm();
    this.getAllData();
  }

  /**
   * Build search filter form
   */
    buildForm() {
      this.searchForm = this.fb.group({
        location: [""],
        city: [""],
        date_time: [""],
        status: [""],
        filterType: ['']
      });
    }

  /**
   * Function to add project List
   */
  add(data: any) {
    const dialogRef = this.dialog.open(AddEditParticipateAdmissionComponent, {
      width: '400px',
      data: {action: data}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ngOnInit();
      }
    });
  }

  view(data: any) {
    this.router.navigate(['/collaborate/view-admission-panel'], {queryParams: {id: data?.id}});
    
    // const dialogRef = this.dialog.open(ViewAdmissionPanelComponent, {
    //   width: '400px',
    //   data: {data: data}
    // });

  }

  /**
   * Function to edit project
   * @param data 
   * @param params 
   */
  edit(data: any, params: any) {
    this.router.navigate(['/collaborate/add-edit-admission-panel'], {queryParams: {id: data?.id, action: params}});
    // const dialogRef = this.dialog.open(AddEditParticipateAdmissionComponent, {
    //   width: '500px',
    //   data: {data: data, action: params}
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.ngOnInit();
    //   }
    // });
  }

    /**
   * Function to View user list
   * @param data 
   */
    viewUserList(data: any) {
      const dialogRef = this.dialog.open(ViewUserListComponent, {
        width: '400px',
        data: { info: data }
      });
    }
  
  /**
   * Function to remove items by id
   * @param id 
   * @param params 
  */
  delete(data: any, params: string) {
    let action: string = "delete-admission";
    const dialogRef = this.dialog.open(DeletedialogComponent, {
      width: '400px',
      data: { data: data, info: params }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.collaborateService.deleteData(action, data?.id).subscribe((res: any) => {
          if(res?.status == 200) {
            this.notify.notificationService.success(res?.message);
            this.ngOnInit();
          } 
        })
      }
    });
  }
 
  async onStatusChange(e:any, params: any) {
    let action = "update-admission";
      let param = {
        id: params?.id,
        status: e?.target?.value
      }

      await this.collaborateService.updateData(action, param).subscribe((res: any) => {
        if(res?.status == 200) {
          this.notify.notificationService.success(res?.message);
          this.ngOnInit();
        }
      }, error => {
          this.notify.notificationService.error(error?.message);
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  /**
   * Function to Get All project data
   */
  async getAllData() {
    let action = "all-admission";
    await this.collaborateService.getAllData(action).subscribe(
      (res: any) => {
        if(res?.status == 200) {
          this.getAllAdmission = res?.data
          this.dataSource.data = this.getAllAdmission;
        }
      },
      (error) => {
        this.notify.notificationService.error(error?.message);
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
      this.getAllAdmission = [];
      this.formReset = true;
      this.searchForm.get("filterType").setValue(this.pageType);
      await this.userService
        .filterData(this.searchForm?.value)
        .subscribe((res: any) => {
            this.getAllAdmission = res?.data;
            this.dataSource.data = this.getAllAdmission;
        });
    }
  }
      
  /**
   * Function to Reset Search Form filter
   */
  resetForm() {
    this.searchForm.reset(this.buildForm());
    this.getAllData();
    this.cityChecked = false;
    this.dateChecked = false;
    this.statusChecked = false;
    this.formReset = false;
  }

}
