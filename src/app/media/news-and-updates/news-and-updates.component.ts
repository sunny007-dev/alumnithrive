import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TokenInterceptor } from 'src/app/core/token.interceptor';
import { Person } from 'src/app/models/person';
import { CelebrateService } from 'src/app/services/celebrate.service';
import { Config } from 'src/app/services/config';
import { DataService } from 'src/app/services/data.service';
import { UsersService } from 'src/app/services/users.service';
import { DeletedialogComponent } from 'src/app/shared/dialog/deletedialog/deletedialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-news-and-updates',
  templateUrl: './news-and-updates.component.html',
  styleUrls: ['./news-and-updates.component.scss']
})
export class NewsAndUpdatesComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['author','title'];
  public columnsToDisplay: string[] = ['sr.no' ,'newsImage', ...this.displayedColumns, 'description', 'order', 'status', 'actions'];

  /**
   * it holds a list of active filter for each column.
   * example : {firstName: {contains : 'person 1'}}
   **/
  public columnsFilters = {};

  public dataSource: MatTableDataSource<Person>;
  status: any;
  imgPath: any;
  display: number = 1;
  allNews: any;

  searchForm : FormGroup;
  formReset: boolean;
  pageType = "news";

  titleChecked: boolean = true;
  startDateChecked: boolean;
  endDateChecked: boolean;
  statusChecked: boolean;

  constructor( 
    public dialog: MatDialog,
    private dataService: DataService,
    public router: Router,
    private celebrateService : CelebrateService,
    private notifyService: TokenInterceptor,
    private config: Config,
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
      start_date: [""],
      end_date: [""],
      status: [""],
      filterType: ['']
    });
  }
  
/**
 * Function to navigate on Add News page
 * @param data 
 * @param action 
 */
  add(data: any, action?: string) {
    this.router.navigate(['/media/add-news']);
  }
/**
 * Function to navigate on Edit News Page
 * @param data 
 * @param params 
 */
  edit(data: any, params: string) {
    this.router.navigate(['/media/add-news'], {queryParams: { newsId: data?.id, action: params }, skipLocationChange: true});
  }

  /**
   * Function to View New&Updates
   * @param data 
   */
  view(data: any) {
    this.router.navigate(['/media/view-news-and-updates'], {queryParams: {id:data?.id}});
  }
/**
 * Function to Remove news by Id
 * @param data 
 * @param params 
 */
  delete(data: any, params: string) {
    let action: string = "delete-news";
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
/**
 * Function to Change news's status
 * @param e 
 * @param params 
 */
async onStatusChange(e:any, params: any) {
  let action = "update-news";
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


/**
 * Function to Get all news
 */
  async getAllData() {
    let action = "all-news";
    await this.dataService.getAllData(action).subscribe(
      (res: any) => {
        if(res?.status == 200) {
          this.allNews = res?.data;
          this.sortByOrder();
          this.dataSource.data = this.allNews;
        }
      },
      (error) => {
        this.notifyService.notificationService.error(error?.message);
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
      this.updateOrder(this.allNews);
      this.allNews = [];
      setTimeout(() => {
        this.ngOnInit();
      }, 1000);
    }
  }


  /**
   * Function to update order
   * @param data 
   */
  async updateOrder(data: any) {
    let action: string = "swap-newsOrder";
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
  /**
   * Function to Sort data
   */
  sortByOrder() {
    this.allNews.sort((a, b) => a.order_by - b.order_by);
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
      this.allNews = [];
      this.formReset = true;
      this.searchForm.get("filterType").setValue(this.pageType);
      await this.userService
        .filterData(this.searchForm?.value)
        .subscribe((res: any) => {
            this.allNews = res?.data;
            this.dataSource.data = this.allNews;
        });
    }
  }
        
  /**
   * Function to Reset Search Form filter
   */
  resetForm() {
    this.searchForm.reset(this.buildForm());
    this.getAllData();
    this.startDateChecked = false;
    this.endDateChecked = false ;
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
}
