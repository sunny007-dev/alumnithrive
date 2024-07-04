import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TokenInterceptor } from 'src/app/core/token.interceptor';
import { Person } from 'src/app/models/person';
import { CollaborateService } from 'src/app/services/collaborate.service';
import { Config } from 'src/app/services/config';
import { ViewShareOpportunityComponent } from 'src/app/shared/dialog/collaborate/view-share-opportunity/view-share-opportunity.component';
import { DeletedialogComponent } from 'src/app/shared/dialog/deletedialog/deletedialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-share-opportunities',
  templateUrl: './share-opportunities.component.html',
  styleUrls: ['./share-opportunities.component.scss']
})
export class ShareOpportunitiesComponent implements OnInit {

  imgPath: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['author', 'specialization', 'type'];
  public columnsToDisplay: string[] = ['sr.no', 'profile_pic', ...this.displayedColumns, 'position', 'salary', 'status', 'actions'];

  /**
   * it holds a list of active filter for each column.
   * example : {firstName: {contains : 'person 1'}}
   **/
  public columnsFilters = {};

  public dataSource: MatTableDataSource<Person>;
  status: any;

  constructor(
    public dialog: MatDialog,
    private collaborateService: CollaborateService,
    public router: Router,
    private notify: TokenInterceptor,
    private config: Config
    ) {
      this.status = this.config?.status
      this.dataSource = new MatTableDataSource<Person>();
      this.imgPath = environment?.imgUrl;
  }


  private filter() {
    this.dataSource.filterPredicate = (data: Person, filter: string) => {
      let find = true;

      for (var columnName in this.columnsFilters) {

        let currentData = "" + data[columnName];

        //if there is no filter, jump to next loop, otherwise do the filter.
        if (!this.columnsFilters[columnName]) {
          // return;
        }


        let searchValue = this.columnsFilters[columnName]["contains"];

        if (!!searchValue && currentData.indexOf("" + searchValue) < 0) {
          find = false;
          //exit loop
          // return;
        }

        searchValue = this.columnsFilters[columnName]["equals"];
        if (!!searchValue && currentData != searchValue) {
          find = false;
          //exit loop
          // return;
        }

        searchValue = this.columnsFilters[columnName]["greaterThan"];
        if (!!searchValue && currentData <= searchValue) {
          find = false;
          //exit loop
          // return;
        }

        searchValue = this.columnsFilters[columnName]["lessThan"];
        if (!!searchValue && currentData >= searchValue) {
          find = false;
          //exit loop
          // return;
        }

        searchValue = this.columnsFilters[columnName]["startWith"];

        if (!!searchValue && !currentData.startsWith("" + searchValue)) {
          find = false;
          //exit loop
          // return;
        }

        searchValue = this.columnsFilters[columnName]["endWith"];
        if (!!searchValue && !currentData.endsWith("" + searchValue)) {
          find = false;
          //exit loop
          // return;
        }

      }

      return find;
    };

    this.dataSource.filter = null;
    this.dataSource.filter = 'activate';

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Create a filter for the column name and operate the filter action.
   */
  applyFilter(columnName: string, operationType: string, searchValue: string) {
    this.columnsFilters[columnName] = {};
    this.columnsFilters[columnName][operationType] = searchValue;
    this.filter();
  }

  /**
   * clear all associated filters for column name.
   */
  clearFilter(columnName: string) {
    if (this.columnsFilters[columnName]) {
      delete this.columnsFilters[columnName];
      this.filter();
    }
  }

  /**
   * Function to add project List
   */
  add() {
    this.router.navigate(['/collaborate/add-job']);
  }

  /**
   * Function to edit project
   * @param data 
   * @param params 
   */
  edit(data: any, params: any) {
    this.router.navigate(['/collaborate/add-edit-share-opportunities'], {queryParams: {id: data?.id, action: params}});
  }

  view(data: any) {
    this.router.navigate(['/collaborate/view-share-opportunities'], {queryParams: {id: data?.id}});
  }
  
  /**
   * Function to remove items by id
   * @param id 
   * @param params 
  */
  delete(data: any, params: string) {
    let action: string = "delete-opportunity";
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
   * Function to Change status of event
   * @param e 
   * @param params 
   */
    async onStatusChange(e:any, params: any) {
      let action = "update-opportunity";
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
   * initialize data-table by providing persons list to the dataSource.
   */
  ngOnInit(): void {
    this.getAllData();
  }

  /**
   * Function to Get All project data
   */
  async getAllData() {
    let action = "all-opportunity";
    await this.collaborateService.getAllData(action).subscribe(
      (res: any) => {
        if(res?.status == 200) {
          this.dataSource.data = res?.data;
        }
      },
      (error) => {
        this.notify.notificationService.error(error?.message);
      }
    );
  }
}
