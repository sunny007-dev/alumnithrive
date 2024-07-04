import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TokenInterceptor } from 'src/app/core/token.interceptor';
import { Person } from 'src/app/models/person';
import { Config } from 'src/app/services/config';
import { ConnectService } from 'src/app/services/connect.service';
import { DataService } from 'src/app/services/data.service';
import { UsersService } from 'src/app/services/users.service';
import { ViewUserListComponent } from 'src/app/shared/dialog/collaborate/view-user-list/view-user-list.component';
import { EditCostComponent } from 'src/app/shared/dialog/connect/edit-cost/edit-cost.component';
import { DeletedialogComponent } from 'src/app/shared/dialog/deletedialog/deletedialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-alumni-event',
  templateUrl: './alumni-event.component.html',
  styleUrls: ['./alumni-event.component.scss']
})
export class AlumniEventComponent implements OnInit {
  getAllAlumni: Array<any> = [];
  imgPath: any;
  eventType: any;

  searchForm : FormGroup;
  formReset: boolean;
  pageType = "alumni events";

  titleChecked: boolean = true;
  venueChecked: boolean;
  typeChecked: boolean;
  visibilityChecked: boolean;
  eventHostChecked: boolean;
  dateChecked: boolean;
  costChecked: boolean;
  statusChecked: boolean;
 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['title', 'type', 'date'];
  public columnsToDisplay: string[] = ['sr.no', 'eventImage', 'author', ...this.displayedColumns, 'userList', 'cost', 'status', 'actions'];

  /**
   * it holds a list of active filter for each column.
   * example : {firstName: {contains : 'person 1'}}
   **/
  public columnsFilters = {};

  public dataSource: MatTableDataSource<any>;
  status: any;
  display: number = 1;

  constructor(
    public dialog: MatDialog,
    private dataService: DataService,
    public router: Router,
    private connectService: ConnectService,
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
      this.getEventType();
      this.getAllData();
    }
  

  /**
   * Build search filter form
   */
  buildForm() {
    this.searchForm = this.fb.group({
      title: [""],
      venue: [""],
      type: [""],
      visibility:[""],
      eventHost:[""],
      date:[""],
      cost: [""],
      status: [""],
      filterType: ['']
    });
  }

  /**
   * Function to add project List
   */
  add() {
    this.router.navigate(['/connect/add-event'], {queryParams: {category:"alumni"}});
  }
  /**
   * Function to view detail by Id
   * @param data 
   */
  view(data:any){
    this.router.navigate(['/connect/view-event'], {queryParams: { id: data?.id, type: 'alumni-events' }});    
  }
  /**
   * Function to edit project
   * @param data 
   * @param params 
   */
  edit(id: number, params: any) {
    this.router.navigate(['/connect/add-event'], {queryParams: { clubId: id, action: params, category:"alumni" }});
  }

  /**
   * Function to edit cost of event
   * @param e 
   */
  editCost(e: any){
    const dialogRef = this.dialog.open(EditCostComponent, {
      width: '400px',
      data: { data: e }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        setTimeout(() => {
          this.ngOnInit();
        }, 500);

      }
    });
  }

  /**
   * Function to remove items by id
   * @param id 
   * @param params 
  */
  delete(data: any, params: string) {
    let action: string = "delete-event";
    const dialogRef = this.dialog.open(DeletedialogComponent, {
      width: '400px',
      data: { info: params }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.connectService.deleteData(action, data?.id).subscribe((res: any) => {
          if(res?.status == 200) this.notify.notificationService.success(res?.message); this.ngOnInit();
        })
      }
    });
  }
  /**
   * Function to Change status of event
   * @param e 
   * @param params 
   */
  async onStatusChange(e:any, params: any) {
    let action = "update-event";
      let param = {
        id: params?.id,
        status: e?.target?.value
      }
      await this.connectService.updateData(action, param).subscribe((res: any) => {
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
    let action = "all-eventsGet";
    this.getAllAlumni = [];
    await this.dataService.getAllData(action).subscribe(
      (res: any) => {
        if(res?.status == 200) {
          res?.data?.filter((x: any) => {
            if(x?.category == 'alumni') {
              this.getAllAlumni.push(x);
            }
          })
          this.dataSource.data = this.getAllAlumni;
        }
      },
      (error) => {
        this.notify.notificationService.error(error?.message);
      }
    );
  }

    /**
   * Change view mode
   * @param mode 
   */
    changeView(mode: number): void {
      this.display = mode;
    }

  /**
   * Function to get All common api
   */
    async getEventType() {
      let action = "all-eventType";
      await this.dataService.getData(action).subscribe(
        (res: any) => {
          this.eventType = res?.data;
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
          this.getAllAlumni = [];
          this.formReset = true;
          this.searchForm.get("filterType").setValue(this.pageType);
          await this.userService
            .filterData(this.searchForm?.value)
            .subscribe((res: any) => {
                this.getAllAlumni = res?.data;
                this.dataSource.data = this.getAllAlumni;
            });
        }
      }
    
    /**
     * Function to Reset Search Form filter
     */
    resetForm() {
      this.searchForm.reset(this.buildForm());
      this.getAllData();
      this.venueChecked = false;
      this.typeChecked = false;
      this.visibilityChecked = false;
      this.eventHostChecked = false;
      this.dateChecked = false;
      this.costChecked = false;
      this.statusChecked = false;
      this.formReset = false;
    }

    viewClubMemberList(data:any, name:string, type: string) {
      const dialogRef = this.dialog.open(ViewUserListComponent, {
        width: '700px',
        data: { id: data?.id, name: name, type: type }
      });
    }
}
