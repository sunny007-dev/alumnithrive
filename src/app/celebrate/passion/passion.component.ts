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
  selector: 'app-passion',
  templateUrl: './passion.component.html',
  styleUrls: ['./passion.component.scss']
})
export class PassionComponent implements OnInit {

  allPassion: Array<any> = [];
  getInstitutes: Array<any> = [];
  imgPath: any;

  searchForm : FormGroup;
  formReset: boolean;
  pageType = "passion";

  nameChecked: boolean = true;
  titleChecked: boolean;
  instituteChecked: boolean;
  statusChecked: boolean;
 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['first_name', 'type'];
  public columnsToDisplay: string[] = [ 'sr.no' ,'photo', ...this.displayedColumns, 'description', 'status', 'actions'];

  /**
   * it holds a list of active filter for each column.
   * example : {firstName: {contains : 'person 1'}}
   **/
  public columnsFilters = {};

  public dataSource: MatTableDataSource<Person>;
  status: any;

  constructor(
    private celebrateService: CelebrateService, 
    public dialog: MatDialog,
    public router: Router,
    private notifyService: TokenInterceptor,
    private config: Config,
    private fb: FormBuilder,
    private dataService: DataService,
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
      this.getCommonApi();
      this.getAllData();
    }

    
  /**
   * Build search filter form
   */
  buildForm() {
    this.searchForm = this.fb.group({
      title: [""],
      first_name: [""],
      institute_name: [""],
      status: [""],
      filterType: ['']
    });
  }

  edit(data: any, params: any) {
    this.router.navigate(['/celebrate/add-edit-journey'], {queryParams: {id: data?.id, action: params, type:'passion'}});
    // const dialogRef = this.dialog.open(AddEditJourneyAchievementPassionComponent, {
    //   width: '450px',
    //   data: {data: data, type: params, action: 'update-journey'}
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     setTimeout(() => {
    //       this.ngOnInit();
    //     }, 500);
    //   }
    // });
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
            this.notifyService.notificationService.success(res?.message);
            this.ngOnInit();
          } 
        })
      }
    });
  }

  add() {
    this.router.navigate(['/celebrate/create-featured-alumni']);
  }

  async onStatusChange(e:any, params: any) {
    let action = "update-journey";
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
    let action = "all-journey";
    this.allPassion = [];
    await this.celebrateService.getAllData(action).subscribe(
      (res: any) => {

        if(res?.status == 200) {
          this.allPassion = res?.data?.filter((x: any) => x?.type == "passion");
        }
        this.dataSource.data = this.allPassion;
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
        this.allPassion = [];
        this.formReset = true;
        this.searchForm.get("filterType").setValue(this.pageType);
        await this.userService
          .filterData(this.searchForm?.value)
          .subscribe((res: any) => {
              this.allPassion = res?.data;
              this.dataSource.data = this.allPassion;
          });
      }
    }
          
  /**
   * Function to Reset Search Form filter
   */
  resetForm() {
    this.searchForm.reset(this.buildForm());
    this.getAllData();
    this.titleChecked = false;
    this.instituteChecked = false;
    this.statusChecked = false;
    this.formReset = false;
  }
  
  async getCommonApi() {
    let action = "all-common";
    await this.dataService.getData(action).subscribe(
      (res: any) => {
        this.getInstitutes = res?.Institute;
      },
      (error) => {
        this.notifyService.notificationService.error(error?.message);
      }
    );
  }

}
