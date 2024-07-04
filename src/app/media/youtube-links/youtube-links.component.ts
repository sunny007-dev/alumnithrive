import { CdkDragDrop } from '@angular/cdk/drag-drop';
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

@Component({
  selector: 'app-youtube-links',
  templateUrl: './youtube-links.component.html',
  styleUrls: ['./youtube-links.component.scss']
})
export class YoutubeLinksComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('table') table: MatTable<any>;

  public displayedColumns: string[] = ['title'];
  public columnsToDisplay: string[] = ['sr.no', 'thumbnail_url', ...this.displayedColumns, 'link', 'status', 'actions'];

  /**
   * it holds a list of active filter for each column.
   * example : {firstName: {contains : 'person 1'}}
   **/
  public columnsFilters = {};

  public dataSource: MatTableDataSource<Person>;
  status: any;
  display: number = 1;
  allLinks: any;
  imgPath: any;

  searchForm : FormGroup;
  formReset: boolean;
  pageType = "youtube links";

  titleChecked: boolean = true;
  statusChecked: boolean;

  constructor(
    private celebrateService: CelebrateService, 
    public dialog: MatDialog,
    private notifyService : TokenInterceptor,
    private config: Config,
    public router: Router,
    private fb: FormBuilder,
    private userService: UsersService
    ) {
      this.status = this.config?.status;
      this.dataSource = new MatTableDataSource<Person>();
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
      category_name: [""],
      status: [""],
      filterType: ['']
    });
  }


    /**
   * Change item order
   * @param event 
   */
    dropTable(event: CdkDragDrop<any[]>) {
      console.log(event, 'test event');
      // const prevIndex = this.dataSource.findIndex((d) => d === event.item.data);
      // moveItemInArray(this.dataSource, prevIndex, event.currentIndex);
      this.table.renderRows();
    }

  view(data: any) {
    this.router.navigate(['/media/view-youtube-links'], {queryParams: {id:data?.id}});
  }

  add(params: any, action?: string) {
    this.router.navigate(['/media/add-edit-youtube-links'], {queryParams: {action: action}});
  }

  edit(data: any, params: string) {
    this.router.navigate(['/media/add-edit-youtube-links'], {queryParams: {id:data?.id, action: params}});
  }

  delete(data: any, params: string) {
    let action: string = "delete-youtube";
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
    let action = "update-youtube";
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
    let action = "all-youtube";
    await this.celebrateService.getAllData(action).subscribe(
      (vid: any) => {
        if(vid?.status == 200) this.allLinks = vid?.data; this.dataSource.data = this.allLinks;
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
        this.allLinks = [];
        this.formReset = true;
        this.searchForm.get("filterType").setValue(this.pageType);
        await this.userService
          .filterData(this.searchForm?.value)
          .subscribe((res: any) => {
              this.allLinks = res?.data;
              this.dataSource.data = this.allLinks;
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
}
