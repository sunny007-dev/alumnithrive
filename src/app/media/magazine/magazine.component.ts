import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TokenInterceptor } from 'src/app/core/token.interceptor';
import { Person } from 'src/app/models/person';
import { CelebrateService } from 'src/app/services/celebrate.service';
import { Config } from 'src/app/services/config';
import { UsersService } from 'src/app/services/users.service';
import { DeletedialogComponent } from 'src/app/shared/dialog/deletedialog/deletedialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-magazine',
  templateUrl: './magazine.component.html',
  styleUrls: ['./magazine.component.scss']
})
export class MagazineComponent implements OnInit {
 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table') table: MatTable<any>;

  public displayedColumns: string[] = ['magazine_name', 'link', 'order_by'];
  public columnsToDisplay: string[] = ['sr.no' ,'file', ...this.displayedColumns, 'status', 'actions'];

  public columnsFilters = {};

  public dataSource: MatTableDataSource<Person>;
  status: any;
  imgPath: any;
  display: number = 1;
  allMagazine: any;

  searchForm : FormGroup;
  formReset: boolean;
  pageType = "magazine";

  nameChecked: boolean = true;
  statusChecked: boolean;

  constructor(
    private celebrateService: CelebrateService, 
    public dialog: MatDialog,
    private notifyService :TokenInterceptor,
    private config: Config,
    public router: Router,
    private userService: UsersService,
    private fb: FormBuilder
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
        magazine_name: [""],
        status: [""],
        filterType: ['']
      });
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
      this.updateOrder(this.allMagazine);
      this.allMagazine = [];
      setTimeout(() => {
        this.ngOnInit();
      }, 1000);
    }
  }

  /**
   * Function to Update order
   * @param data 
   */
  async updateOrder(data: any) {
    let action: string = "swap-magazineOrder";
    await this.celebrateService.postData(action, data).subscribe(
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

  add(params: any, action?: string) {
    this.router.navigate(['/media/add-edit-magazine'], {queryParams: { action: action}});
  }

  view(data: any) {
    this.router.navigate(['/media/view-magazine'], {queryParams: {id:data?.id}});
  }

  edit(data: any, params: string) {
    this.router.navigate(['/media/add-edit-magazine'], {queryParams: {id:data?.id, action: params}});
  }

  delete(data: any, params: string) {
    let action: string = "delete-magazine";
    const dialogRef = this.dialog.open(DeletedialogComponent, {
      width: '400px',
      data: { data: data, info: params }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.celebrateService.deleteData(action, data?.id).subscribe((res: any) => {
          if(res?.status == 200) {
            this.notifyService.notificationService.success(res?.message);
            this.ngOnInit();
          } 
        })
      }
    });
  }

  async onStatusChange(e:any, params: any) {
    let action = "update-magazine";
      let param = {
        id: params?.id,
        status: e?.target?.value
      }
      await this.celebrateService.updateData(action, param).subscribe((res: any) => {
        if(res?.status == 200) {
          this.notifyService.notificationService.success(res?.message);
          this.ngOnInit();
        }
      }, error => {
          this.notifyService.notificationService.error(error?.message);
      });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async getAllData() {
    let action = "all-magazine";
    await this.celebrateService.getAllData(action).subscribe(
      (gal: any) => {
        if(gal?.status == 200) {
          this.allMagazine = gal?.Magazine; 
          this.sortByOrder();
          this.dataSource.data = this.allMagazine;
        }
      },
      (error) => {
        this.notifyService.notificationService.error(error?.message);
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
      this.notifyService.notificationService.warning(
        "At least one field should be selected"
      );
    } else {
      this.allMagazine = [];
      this.formReset = true;
      this.searchForm.get("filterType").setValue(this.pageType);
      await this.userService
        .filterData(this.searchForm?.value)
        .subscribe((res: any) => {
            this.allMagazine = res?.data;
            this.dataSource.data = this.allMagazine;
        });
    }
  }
      
  /**
   * Function to Reset Search Form filter
   */
  resetForm() {
    this.searchForm.reset(this.buildForm());
    this.getAllData();
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
    this.allMagazine.sort((a, b) => a.order_by - b.order_by);
  }

}
