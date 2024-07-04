import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TokenInterceptor } from 'src/app/core/token.interceptor';
import { Config } from 'src/app/services/config';
import { ContactService } from 'src/app/services/contact.service';
import { DeletedialogComponent } from 'src/app/shared/dialog/deletedialog/deletedialog.component';

@Component({
  selector: 'app-queries',
  templateUrl: './queries.component.html',
  styleUrls: ['./queries.component.scss']
})
export class QueriesComponent implements OnInit {getAllQuery: Array<any> = [];
 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['full_name', 'subject', 'email', 'phone'];
  public columnsToDisplay: string[] = ['sr.no', ...this.displayedColumns, 'description', 'actions'];

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
    private contactService: ContactService,
    public router: Router,
    private notify : TokenInterceptor,
    private config: Config
    ) {
      this.status = this.config?.status;
      this.dataSource = new MatTableDataSource<any>();
  }

  /**
   * Function to View Contact
   */
  view(params: any) {
    this.router.navigate(['/contact/view-queries'], {queryParams: {id:params?.id}});
  }
  /**
   * Function to edit project
   * @param data 
   * @param params 
   */
  edit(data: any, params: any) {
    this.router.navigate(['/contact/edit-queries'], {queryParams: {id:data?.id, action: params}});
  }
  /**
   * Function to remove items by id
   * @param id 
   * @param params 
  */
  delete(data: any, params: string) {
    let action: string = "delete-contactQueries";
    const dialogRef = this.dialog.open(DeletedialogComponent, {
      width: '400px',
      data: { info: params }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contactService.deleteData(action, data?.id).subscribe((res: any) => {
          if(res?.status == 200) this.notify.notificationService.success(res?.message); this.ngOnInit();
        })
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
    this.getAllQueries();
  }

  /**
   * Function to Get All project data
   */
  async getAllQueries() {
    let action = "all-contactQueries";
    this.getAllQuery = [];
    await this.contactService.getAllData(action).subscribe(
      (res: any) => {
        if(res?.status == 200){
          this.getAllQuery = res?.data;
          this.dataSource.data = this.getAllQuery;
        }else {
          this.notify.notificationService.warning("Something weng wrong! Please try again");
        }
      },
      (error) => {
          this.notify.notificationService.error(error?.message);
      }
    );
  }

}
