import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TokenInterceptor } from 'src/app/core/token.interceptor';
import { Person } from 'src/app/models/person';
import { CelebrateService } from 'src/app/services/celebrate.service';
import { DeletedialogComponent } from 'src/app/shared/dialog/deletedialog/deletedialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-birthday',
  templateUrl: './birthday.component.html',
  styleUrls: ['./birthday.component.scss']
})
export class BirthdayComponent implements OnInit {
  public status = 'active';
  getAllJourney: Array<any> = [];
  imgPath: any;
 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['email', 'mobile_number', 'birth_date'];
  public columnsToDisplay: string[] = ['sr.no', 'profile_pic', ...this.displayedColumns, 'actions'];

  /**
   * it holds a list of active filter for each column.
   * example : {firstName: {contains : 'person 1'}}
   **/
  public columnsFilters = {};

  public dataSource: MatTableDataSource<Person>;

  constructor(
    private celebrateService: CelebrateService, 
    public dialog: MatDialog,
    private notifyService: TokenInterceptor,
    private router: Router
    ) {
    this.dataSource = new MatTableDataSource<Person>();
    this.imgPath = environment?.imgUrl;
  }

  /**
   * Function to View user by Id
   * @param id 
   */
  view(id: any) {
    this.router.navigate(['user-profile'], { queryParams: { id: id } });
  }
  /**
  * Function to navigate user profile by id
  * @param data 
  */
  edit(data: any) {
    this.router.navigate(['user-profile'], { queryParams: { id: data?.id, type: 'edit' } });
  }

  delete(data: any, params: string) {
    let action: string = "delete-journey";
    const dialogRef = this.dialog.open(DeletedialogComponent, {
      width: '400px',
      data: { data: data, info: params }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.celebrateService.deleteData(action, data?.id).subscribe((res: any) => {
          if(res?.status == 200) {
            this.ngOnInit();
            this.notifyService.notificationService.success(res?.message);
          } 
        })
      }
    });
  }

  // add() {
  //   this.router.navigate(['/celebrate/create-featured-alumni']);
  // }

  async onStatusChange(e:any, params: any) {
    let action = "update-journey";
      let param = {
        id: params?.id,
        is_active: e?.target?.value
      }
      console.log(param);
      await this.celebrateService.updateData(action, param).subscribe((res: any) => {
        if(res?.status == 200) {
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
   * initialize data-table by providing persons list to the dataSource.
   */
  ngOnInit(): void {
    this.getAllData();
  }

  async getAllData() {
    let action = "all-birthday";
    await this.celebrateService.getAllData(action).subscribe(
      (res: any) => {
        this.dataSource.data = res?.Birthday;
      },
      (error) => {
        console.log(error)
        this.notifyService.notificationService.error(error?.message);
      }
    );
  }

}
