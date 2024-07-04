import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { TokenInterceptor } from "src/app/core/token.interceptor";
import { Config } from "src/app/services/config";
import { DataService } from "src/app/services/data.service";
import { OrganizationService } from "src/app/services/organization.service";
import { UsersService } from "src/app/services/users.service";
import { DeletedialogComponent } from "src/app/shared/dialog/deletedialog/deletedialog.component";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-leadership",
  templateUrl: "./leadership.component.html",
  styleUrls: ["./leadership.component.scss"],
})
export class LeadershipComponent implements OnInit {
  imgPath: any;
  allTeam: any;
  getInstitutes: any;

  searchForm: FormGroup;
  formReset: boolean;
  pageType: string = "team";

  nameChecked: boolean = true;
  instituteChecked: boolean;
  designationChecked: boolean;
  statusChecked: boolean;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = [
    "designation",
    "institute_name",
    "order",
  ];
  public columnsToDisplay: string[] = [
    "sr.no",
    "profile_pic",
    ...this.displayedColumns,
    "status",
    "actions",
  ];

  public columnsFilters = {};

  dataSource: MatTableDataSource<any>;
  status: any;
  display: number = 1;
  team: any;

  constructor(
    private organizationService: OrganizationService,
    public dialog: MatDialog,
    private notifyService: TokenInterceptor,
    private dataService: DataService,
    private config: Config,
    public router: Router,
    private fb: FormBuilder,
    private userService: UsersService
  ) {
    this.status = this.config?.status;
    this.dataSource = new MatTableDataSource<any>();
    this.imgPath = environment.imgUrl;
  }

  /**
   * Function to add team
   * @param params
   * @param action
   * @param type
   */
  add(params: any, action?: string, type?: string) {
    this.router.navigate(["/about-us/add-edit-leadership"]);
  }
  /**
   * View team data by id
   * @param data
   */
  view(data: any) {
    this.router.navigate(["/about-us/view-leadership"], {
      queryParams: { id: data?.id },
    });
  }
  /**
   * Function to Edit team list
   * @param data
   * @param params
   */
  edit(data: any, params: any) {
    this.router.navigate(["/about-us/add-edit-leadership"], {
      queryParams: { id: data?.id, action: params },
    });
  }

  /**
   * Function to delete data by id
   * @param data
   * @param params
   */
  delete(data: any, params: string) {
    let action: string = "delete-team";
    const dialogRef = this.dialog.open(DeletedialogComponent, {
      width: "400px",
      data: { data: data, info: params },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.organizationService
          .deleteData(action, data?.id)
          .subscribe((res: any) => {
            if (res?.status == 200) {
              this.ngOnInit();
              this.notifyService.notificationService.success(res?.message);
            }
          });
      }
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
    this.getAllData();
    this.getCommonApi();
  }

/**
 * Build search filter form
 */
  buildForm() {
    this.searchForm = this.fb.group({
      name: [""],
      institute_name: [""],
      designation: [""],
      status: [""],
      filterType: ['']
    });
  }

  /**
   * Function to get all team data
   */
  async getAllData() {
    let action = "all-team";
    await this.organizationService.getAllData(action).subscribe(
      (prim: any) => {
        this.team = prim?.data;
        if (prim?.status == 200) {
          this.allTeam = prim?.data;
          this.sortByOrder();
          this.dataSource.data = prim?.data;
        }
      },
      (error) => {
        this.notifyService.notificationService.error(error?.message);
      }
    );
  }

  /**
   * Function to update Status change
   * @param e
   * @param params
   */
  async onStatusChange(e: any, params: any) {
    let action = "update-team";
    let param = {
      id: params?.id,
      status: e?.target?.value,
    };

    await this.organizationService.updateData(action, param).subscribe(
      (res: any) => {
        if (res?.status == 200) {
          this.ngOnInit();
          this.notifyService.notificationService.success(res?.message);
        }
      },
      (error) => {
        this.notifyService.notificationService.error(error?.message);
      }
    );
  }

  /**
   * Function to drop table grid
   * @param event
   */
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.allTeam, event.previousIndex, event.currentIndex);
      this.updateOrder(this.allTeam);
      setTimeout(() => {
        this.ngOnInit();
      }, 1000);
    }
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
      this.updateOrder(this.allTeam);
      this.allTeam = [];
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
    let action: string = "swap-teamOrder";
    await this.dataService.postData(action, data).subscribe(
      (x: any) => {
        if (x?.status == 200) {
          this.notifyService.notificationService.success(x?.message);
        } else {
          this.notifyService.notificationService.warning(
            "Something went wrong !"
          );
        }
      },
      (error) => {
        this.notifyService.notificationService.error(error?.message);
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
      this.notifyService.notificationService.warning(
        "At least one field should be selected"
      );
    } else {
      this.formReset = true;
      this.allTeam = [];
      this.searchForm.get("filterType").setValue(this.pageType);
      console.log(this.searchForm.value);
      await this.userService
        .filterData(this.searchForm?.value)
        .subscribe((res: any) => {
          this.allTeam = res?.data;
          this.dataSource.data = this.allTeam;
        });
    }
  }


  /**
   * Function to Reset Search Form filter
   */
    resetForm(i: any) {
      this.searchForm.reset(this.buildForm());
      this.getAllData();
      // this.nameChecked = false;
      this.instituteChecked = false;
      this.designationChecked = false;
      this.statusChecked = false;
      this.formReset = false;
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
    this.allTeam.sort((a, b) => a.order - b.order);
  }


  /**
 * Function to get All common api
 */
  async getCommonApi() {
    let action = "all-common";
    await this.dataService.getData(action).subscribe(
      (res: any) => {
        this.getInstitutes = res?.Institute;
      },
      (error) => {
        this.notifyService.notificationService.openFailureSnackBar(error?.message);
      }
    );
  }
}
