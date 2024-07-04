import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenInterceptor } from 'src/app/core/token.interceptor';
import { Person } from 'src/app/models/person';
import { AuthService } from 'src/app/services/auth.service';
import { Config } from 'src/app/services/config';
import { DataService } from 'src/app/services/data.service';
import { UsersService } from 'src/app/services/users.service';
import { DeletedialogComponent } from 'src/app/shared/dialog/deletedialog/deletedialog.component';
import { SendMailComponent } from 'src/app/shared/dialog/send-mail/send-mail.component';
import { environment } from 'src/environments/environment';
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragHandle} from '@angular/cdk/drag-drop';
import { MatCheckbox } from '@angular/material/checkbox';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.scss']
})
export class AllUsersComponent implements OnInit {

  @ViewChild('table') table: MatTable<any>;

  pageType = "users";
  getAllUser: Array<any> = [];
  searchForm: FormGroup;
  imgPath: any;
  display: number = 1;
  nameChecked: boolean = true;
  emailChecked: boolean;
  phoneChecked: boolean;
  instituteChecked: boolean;
  bactchChecked: boolean;
  cityChecked: boolean;
  countryChecked: boolean;
  cmpChecked: boolean;
  statusChecked: boolean;
  // endDateChecked: boolean

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('myCheckbox') private myCheckbox: MatCheckbox;

  public displayedColumns: string[] = ['mobile_number', 'email', 'institute_name', 'batch','current_city', 'current_designation'];
  public columnsToDisplay: string[] = ['sr.no', 'profile_pic',...this.displayedColumns, 'created_at', 'reset', 'mail','status', 'actions'];

  /**
   * it holds a list of active filter for each column.
   * example : {firstName: {contains : 'person 1'}}
   **/
  public columnsFilters = {};

  public dataSource: MatTableDataSource<Person>;
  status: any;
  skill: any;
  getInstitutes: any;
  getBatch: any;
  primaryInd: any;
  secondaryInd: any;
  primaryFunc: any;
  secondaryFunc: any;
  formReset: boolean;
  imgUrl: any;
  role:any;
  userRole: any;
  currentUser: any;


  demoForm: FormGroup;
  searchCon = new FormControl();

  filterData = ['name', 'current_city', 'current_state', 'batch', 'email', 'phone'];
  selectedSearch = [];

  constructor(
    public dialog: MatDialog,
    private dataService: DataService,
    private router: Router,
    public notify : TokenInterceptor,
    private config: Config,
    private userService: UsersService,
    private fb: FormBuilder,
    public arouter: ActivatedRoute,
    private authService: AuthService
  ) {
    this.status = this.config?.userStat;
    this.dataSource = new MatTableDataSource<Person>();
    this.imgPath = environment?.imgUrl;
    this.role = this.authService.getUserRole();

    this.userRole = this.config.role;
    if(localStorage) {
      this.currentUser = JSON.parse(localStorage.getItem("currentUser") || "");
    }

    this.demoForm = this.fb.group({
      demoArray: this.fb.array([])
   });
  }

  get demoArray() {
    return this.demoForm.get('demoArray') as FormArray;
  }

  addItem(item) {
    this.selectedSearch.push(item);
    this.demoArray.push(this.fb.control(false));
  }


/**
 * Update items order
 * @param event 
 */
dropTable(event: CdkDragDrop<any[]>) {
  if (event.previousContainer === event.container) {
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    transferArrayItem(event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex);
  }
  this.table.renderRows();
}

/**
 * Function to View user by Id
 * @param id 
 */
  view(id: any) {
    this.router.navigate(['user-profile'], { queryParams: { id: id } });
  }
/**
 * Function to navigate user profile by id
 * @param data 
 */
  edit(data: any) {
    this.router.navigate(['user-profile'], { queryParams: { id: data?.id, type: 'edit' } });
  }
/**
 * Function to delete user by Id
 * @param data 
 * @param params 
 */
  delete(data: any, params: string) {
    let action:string = "delete-user";
    const dialogRef = this.dialog.open(DeletedialogComponent, {
      width: '400px',
      data: { info: params }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataService.deleteData(action, data?.id).subscribe((res: any) => {
          if(res?.status == 200) this.notify.notificationService.success(res?.message); this.ngOnInit();
        })
      }
    });
  }
/**
 * Function to Change User Status by Id
 * @param e 
 * @param params 
 */
  async onStatusChange(e: any, params: any) {
    let action = "update-user";

    let param = {
      id: params?.id,
      status: e?.target?.value
    }
 
    await this.dataService.updateData(action, param).subscribe((res: any) => {
      if (res?.status == 200) {
        this.notify.notificationService.success(res?.message);
        this.ngOnInit();
      }
    }, error => {
      this.notify.notificationService.error(error?.message);
    });
  }

  /**
   * Function to change user role by Superadmin
   * @param e 
   * @param params 
   */
  async onRoleChange(e: any, params: any) {
    let action = "update-user";

    let param = {
      id: params?.id,
      role: e?.target?.value
    }
 
    await this.dataService.updateData(action, param).subscribe((res: any) => {
      if (res?.status == 200) {
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
   * initialize data-table by providing persons list to the dataSource.
   */
  ngOnInit(): void {
    this.buildForm();
    this.getCommonApi();
    this.getAllData();
    if (this.role == 0) {
      this.columnsToDisplay = ['sr.no', 'profile_pic',...this.displayedColumns, 'created_at', 'reset', 'mail', 'role', 'status', 'actions'];
    } else if(this.role == 2) {
      this.columnsToDisplay = ['sr.no', 'profile_pic',...this.displayedColumns, 'created_at', 'reset', 'mail', 'status', 'actions'];
    } else if(this.role == 3) {
      this.columnsToDisplay = ['sr.no', 'profile_pic',...this.displayedColumns, 'created_at', 'mail', 'actions'];
    }  else if(this.role == 4) {
      this.columnsToDisplay = ['sr.no', 'profile_pic',...this.displayedColumns, 'created_at', 'mail', 'actions'];
    }
  }

/**
 * Build search filter form
 */
  buildForm() {
    this.searchForm = this.fb.group({
      fullName: [""],
      first_name: [""],
      email: [""],
      mobile_number: [""],
      institute_name: [""],
      batch: [""],
      current_city: [""],
      current_country: [""],
      current_company:[''],
      status: [""],
      filterType: ['']
    });
  }
/**
 * Function to get All user data
 */
  async getAllData() {
    let action = "all-users";
    this.getAllUser = [];
    await this.dataService.getAllData(action).subscribe(
      (res: any) => {
        if (res?.status == 200) {
          this.getAllUser = res?.data.filter((x: any) => x.id !== this.currentUser?.id);
          this.sortByOrder();
          this.dataSource.data = this.getAllUser;
        }
      },
      (error) => {
        this.notify.notificationService.error(error?.message);
      }
    );
  }
/**
 * Function to get All common api
 */
  async getCommonApi() {
    let action = "all-common";
    await this.dataService.getData(action).subscribe(
      (res: any) => {
        this.skill = res?.Skill;
        this.getInstitutes = res?.Institute;
        this.getBatch = res?.Batch_Year;
        this.primaryInd = res?.Primary_Industry;
        this.secondaryInd = res?.Secondary_Industry;
        this.primaryFunc = res?.Primary_Function;
        this.secondaryFunc = res?.Secondary_Function;
      },
      (error) => {
        this.notify.notificationService.openFailureSnackBar(error);
      }
    );
  }

  /**
   * Function to drop table list
   * @param event
   */
  dropList(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.item.dropContainer.data,
        event.previousIndex,
        event.currentIndex
      );
      this.dataSource.data = event.item?.dropContainer?.data;
      this.updateOrder(this.getAllUser);
      this.getAllUser = [];
      setTimeout(() => {
        this.ngOnInit();
      }, 1000);
    }
  }

  /**
   * Function to Update Order
   * @param data
   */
  async updateOrder(data: any) {
    let action: string = "swap-order";
    await this.dataService.postData(action, data).subscribe(
      (x: any) => {
        if (x?.status == 200) {
          this.notify.notificationService.success(x?.message);
        } else {
          this.notify.notificationService.warning(
            "Something went wrong !"
          );
        }
      },
      (error) => {
        this.notify.notificationService.error(error?.message);
      }
    );
  }

/**
 * Function to Filter Data
 */
  async searchData(){
    let isValue = Object.keys(this.searchForm.value).some(
      (value) => !!this.searchForm.value[value]
    );

    if (!isValue) {
      this.formReset = false;
      this.notify.notificationService.warning(
        "At least one field should be selected"
      );
    } else {
      this.formReset = true;
      this.getAllUser = [];
      this.searchForm.get("filterType").setValue(this.pageType);
      console.log(this.searchForm.value);
      await this.userService
        .filterData(this.searchForm?.value)
        .subscribe((res: any) => {
          this.getAllUser = res?.data;
          this.dataSource.data = this.getAllUser;
        });
    }
  }

  onKeyUp(event: any) {
    console.log(event);
  }

  /**
   * Function to Reset Search Form filter
   */
  resetForm(i: any) {
    this.searchForm.reset(this.buildForm());
    this.getAllData();
    this.emailChecked = false;
    this.phoneChecked = false;
    this.instituteChecked = false;
    this.bactchChecked = false;
    this.cityChecked = false;
    this.countryChecked = false;
    this.cmpChecked = false;
    this.statusChecked = false;
    // this.startDateChecked = false;
    // this.endDateChecked = false
    // this.selectedSearch = [];
    this.formReset = false;
  }

  /**
   * Functiont to reset password
   * @param params 
   */
  async onResetPwd(params: any) {
    this.router.navigate(['/auth/reset-password'], { queryParams: { id: params?.id, type: 'user' } });
  }

  /**
   * Function to 
   * @param params 
   */
  onSendMail(params: any) {
    const dialogRef = this.dialog.open(SendMailComponent, {
      width: '400px',
      data: { user: params }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // this.dataService.deleteData(action, data?.id).subscribe((res: any) => {
        //   if(res?.status == 200) this.notify.notificationService.success(res?.message); this.ngOnInit();
        // })
      }
    });
  }
  /**
   * Change view mode
   * @param mode 
   */
  changeView(mode: number): void {
    this.display = mode;
  }

  /**
  * Function to sorting data
  */
  sortByOrder() {
    this.getAllUser.sort((a, b) => a.order_by - b.order_by);
  }

}
