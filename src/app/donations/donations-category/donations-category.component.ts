import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TokenInterceptor } from 'src/app/core/token.interceptor';
import { Person } from 'src/app/models/person';
import { Config } from 'src/app/services/config';
import { DonationsService } from 'src/app/services/donations.service';
import { DeletedialogComponent } from 'src/app/shared/dialog/deletedialog/deletedialog.component';

@Component({
  selector: 'app-donations-category',
  templateUrl: './donations-category.component.html',
  styleUrls: ['./donations-category.component.scss']
})
export class DonationsCategoryComponent implements OnInit {
  getAllContact: Array<any> = [];
 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['name'];
  public columnsToDisplay: string[] = ['sr.no', ...this.displayedColumns, 'created_at', 'status', 'actions'];

  /**
   * it holds a list of active filter for each column.
   * example : {firstName: {contains : 'person 1'}}
   **/
  public columnsFilters = {};

  public dataSource: MatTableDataSource<Person>;
  status: any;

  constructor(
    public dialog: MatDialog,
    private donationsService: DonationsService,
    public router: Router,
    private notify : TokenInterceptor,
    private config: Config
    ) {
      this.status = this.config?.status;
      this.dataSource = new MatTableDataSource<Person>();
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
   * Function to View donation details
   * @param data 
   * @param params 
   */
  view(data: any, params: string) {
    this.router.navigate(['/donations/view-donations'], {queryParams: {id:data?.id}});
  }

  /**
   * Function to Add Donation
   * @param params 
   */
  add(params: string) {
    this.router.navigate(['/donations/add-edit-donations-category'], {queryParams: {action: params}});
  }
/**
 * Function to Edit donation
 * @param data 
 * @param params 
 */
  edit(data: any, params: string) {
    this.router.navigate(['/donations/add-edit-donations-category'], {queryParams: {id: data?.id, action: params}});
  }

  /**
   * Function to Get All project data
   */
  async getAllData() {
    let action = "all-donationCategories";
    // this.getAllContact = [];
    await this.donationsService.getAllData(action).subscribe(
      (res: any) => {
        console.log(res, 'Don')
          this.dataSource.data = res?.Donation;
      },
      (error) => {
          this.notify.notificationService.error(error?.message);
      }
    );
  }

  /**
   * Function to remove items by id
   * @param id 
   * @param params 
  */
  delete(data: any, params: string) {
    let action: string = "delete-donationCategories";
    const dialogRef = this.dialog.open(DeletedialogComponent, {
      width: '400px',
      data: { info: params }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.donationsService.deleteData(action, data?.id).subscribe((res: any) => {
          if(res?.status == 200) this.notify.notificationService.success(res?.message); this.ngOnInit();
        })
      }
    });
  }

  async onStatusChange(e:any, params: any) {
    let action = "update-donationCategories";
      let param = {
        id: params?.id,
        status: e?.target?.value
      }
      await this.donationsService.updateData(action, param).subscribe((res: any) => {
        if(res?.status == 200) {
          this.notify.notificationService.success(res?.message);
          this.ngOnInit();
        }
      }, error => {
          this.notify.notificationService.error(error?.message);
      });
  }
}
