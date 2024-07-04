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
import { DataService } from 'src/app/services/data.service';
import { UsersService } from 'src/app/services/users.service';
import { ViewUserListComponent } from 'src/app/shared/dialog/collaborate/view-user-list/view-user-list.component';
import { DeletedialogComponent } from 'src/app/shared/dialog/deletedialog/deletedialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-special-projects',
  templateUrl: './special-projects.component.html',
  styleUrls: ['./special-projects.component.scss']
})
export class SpecialProjectsComponent implements OnInit {
  allSpecialPrject: Array<any> = [];

  searchForm : FormGroup;
  formReset: boolean;
  pageType = "special project";

  titleChecked: boolean = true;
  mobileChecked: boolean;
  emailChecked: boolean;
  contactPersonChecked: boolean;
  charityChecked:boolean
  monetaryChecked: boolean;
  statusChecked: boolean;
  imgPath: any;
 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['author', 'title', 'charityName'];
  public columnsToDisplay: string[] = ['sr.no', 'projectImage', ...this.displayedColumns, 'userList', 'description', 'status', 'actions'];

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
        title: [""],
        mobileNumber: [""],
        email: [""],
        contactName: [""],
        charityName: [""],
        monetaryDonation: [""],
        status: [""],
        filterType: ['']
      });
    }

  /**
   * Function to add project List
   */
  add(action) {
    this.router.navigate(['/collaborate/add-edit-special-projects'], {queryParams: {action: action}});
  }

  /**
   * Function to Special Project
   */
  view(data: any){
    this.router.navigate(['/collaborate/view-special-project'], {queryParams: {id: data?.id}});
  }
  /**
   * Function to edit project
   * @param data 
   * @param params 
   */
  edit(data: any, params: string) {
    this.router.navigate(['/collaborate/add-edit-special-projects'], {queryParams: {id: data?.id, action: params}});
  }
  /**
   * Function to remove items by id
   * @param id 
   * @param params 
  */
  delete(data: any, params: string) {
    let action: string = "delete-project";
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
  /**
   * Function to View user list
   * @param data 
   */
  viewUserList(data:any, name:string, type: string) {
    const dialogRef = this.dialog.open(ViewUserListComponent, {
      width: '700px',
      data: { id: data?.id, name: name, type: type }
    });
  }

  async onStatusChange(e:any, params: any) {
    let action = "update-project";
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
    let action = "all-project";
    await this.collaborateService.getAllData(action).subscribe(
      (res: any) => {
        if(res?.status == 200) {
          this.allSpecialPrject = res?.data;
          this.dataSource.data = this.allSpecialPrject;
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
      this.allSpecialPrject = [];
      this.formReset = true;
      this.searchForm.get("filterType").setValue(this.pageType);
      await this.userService
        .filterData(this.searchForm?.value)
        .subscribe((res: any) => {
            this.allSpecialPrject = res?.data;
            this.dataSource.data = this.allSpecialPrject;
        });
    }
  }
        
  /**
   * Function to Reset Search Form filter
   */
  resetForm() {
    this.searchForm.reset(this.buildForm());
    this.getAllData();
    this.mobileChecked = false;
    this.emailChecked = false;
    this.contactPersonChecked = false;
    this.charityChecked = false;
    this.monetaryChecked = false;
    this.statusChecked = false;
    this.statusChecked = false;
    this.formReset = false;
  }

}
