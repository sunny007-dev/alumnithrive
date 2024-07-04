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
import { DeletedialogComponent } from 'src/app/shared/dialog/deletedialog/deletedialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-offer-expertise',
  templateUrl: './offer-expertise.component.html',
  styleUrls: ['./offer-expertise.component.scss']
})
export class OfferExpertiseComponent implements OnInit {
  imgPath: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['author', 'workshopTopic', 'type', 'dateTime'];
  public columnsToDisplay: string[] = ['sr.no', 'profile_pic', ...this.displayedColumns, 'status', 'actions'];

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
      this.status = this.config?.status;
      this.dataSource = new MatTableDataSource<Person>();
      this.imgPath = environment?.imgUrl;
  }


  /**
   * Function to add project List
   */
  add(action:string) {
    this.router.navigate(['/collaborate/add-edit-expertise'],{queryParams:{action: action}});
  }

  view(data: any) {
    this.router.navigate(['/collaborate/view-offer-expertise'], {queryParams:{id: data?.id}});
  }

  edit(data: any, action:string) {
    this.router.navigate(['/collaborate/add-edit-expertise'], {queryParams: {id: data?.id, action: action}});
  }
  
  /**
   * Function to remove items by id
   * @param id 
   * @param params 
  */
  delete(data: any, params: string) {
    let action: string = "delete-expertise";
    const dialogRef = this.dialog.open(DeletedialogComponent, {
      width: '400px',
      data: { data: data, info: params }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.collaborateService.deleteData(action, data?.id).subscribe((res: any) => {
          if(res?.status == 200) {
            console.log('Deleted Successfully !');
            this.ngOnInit();
          } 
        })
      }
    });
  }
 
  async onStatusChange(e:any, params: any) {
    let action = "update-expertise";
      let param = {
        id: params?.id,
        status: e?.target?.value
      }
      await this.collaborateService.updateData(action, param).subscribe((res: any) => {
        if(res?.status == 200) {
          this.notify?.notificationService?.success(res?.message);
          this.ngOnInit();
        }
      }, error => {
          this.notify?.notificationService?.error(error?.message);
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
    let action = "all-expertise";
    await this.collaborateService.getAllData(action).subscribe(
      (res: any) => {
        if(res?.status == 200) {
          this.dataSource.data = res?.data;
        }
      },
      (error) => {
        this.notify?.notificationService?.error(error?.message);
      }
    );
  }
}
