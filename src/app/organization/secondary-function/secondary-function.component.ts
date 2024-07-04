import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TokenInterceptor } from 'src/app/core/token.interceptor';
import { Person } from 'src/app/models/person';
import { Config } from 'src/app/services/config';
import { OrganizationService } from 'src/app/services/organization.service';
import { DeletedialogComponent } from 'src/app/shared/dialog/deletedialog/deletedialog.component';
import { AddEditFunctionComponent } from 'src/app/shared/dialog/organization/add-edit-function/add-edit-function.component';

@Component({
  selector: 'app-secondary-function',
  templateUrl: './secondary-function.component.html',
  styleUrls: ['./secondary-function.component.scss']
})
export class SecondaryFunctionComponent implements OnInit {
 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['secondary_function_area'];
  public columnsToDisplay: string[] = ['sr.no', ...this.displayedColumns, 'created_at', 'status', 'actions'];

  public columnsFilters = {};

  public dataSource: MatTableDataSource<Person>;
  status: any;

  constructor(
    private organizationService: OrganizationService, 
    public dialog: MatDialog,
    private config: Config,
    private notify: TokenInterceptor,
    public router: Router
    ) {
      this.status = this.config?.status;
      this.dataSource = new MatTableDataSource<Person>();
  }

  
  add(params?: string) {
    this.router.navigate(['/organization/add-edit-secondary-function'], {queryParams: {action: params}});
  }

  edit(data: any, params: any) {
    this.router.navigate(['/organization/add-edit-secondary-function'], {queryParams: {id:data?.id, action: params}});
  }

  delete(data: any, params: string) {
    let action: string = "delete-secondaryFunction";
    const dialogRef = this.dialog.open(DeletedialogComponent, {
      width: '400px',
      data: { data: data, info: params }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.organizationService.deleteData(action, data?.id).subscribe((res: any) => {
          if(res?.status == 200) {
            this.notify.notificationService.success(res?.message);
            this.ngOnInit();
          } 
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
    this.getAllData();
  }

  async getAllData() {
    let action = "all-secondaryFunction";
    await this.organizationService.getAllData(action).subscribe(
      (prim: any) => {
        if(prim?.status == 200) this.dataSource.data = prim?.data;
      },
      (error) => {
        this.notify.notificationService.error(error?.message);
      }
    );
  }

  async onStatusChange(e:any, params: any) {
    let action = "update-secondaryFunction";
      let param = {
        id: params?.id,
        status: e?.target?.value
      }

      await this.organizationService.updateData(action, param).subscribe((res: any) => {
        if(res?.status == 200) {
          this.notify.notificationService.success(res?.message);
          this.ngOnInit();
        }
      }, error => {
          this.notify.notificationService.error(error?.message);
      });
  }

}
