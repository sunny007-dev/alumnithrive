import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Person } from 'src/app/models/person';
import { DataService } from 'src/app/services/data.service';
import { DeletedialogComponent } from 'src/app/shared/dialog/deletedialog/deletedialog.component';
import { Router } from '@angular/router';
import { CommunityService } from 'src/app/services/community.service';
import { TokenInterceptor } from 'src/app/core/token.interceptor';
import { Config } from 'src/app/services/config';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { ViewUserListComponent } from 'src/app/shared/dialog/collaborate/view-user-list/view-user-list.component';

@Component({
  selector: 'app-clubs',
  templateUrl: './clubs.component.html',
  styleUrls: ['./clubs.component.scss']
})
export class ClubsComponent implements OnInit {

  status: any;
  imgPath: any;
  clubType:any;

  searchForm: FormGroup;
  formReset: boolean;
  pageType: string = "clubs";

  nameChecked: boolean = true;
  typeChecked: boolean;
  statusChecked: boolean;
 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['name', 'type'];
  public columnsToDisplay: string[] = ['sr.no', 'clubImage', ...this.displayedColumns, 'userList','status', 'actions'];

  /**
   * it holds a list of active filter for each column.
   * example : {firstName: {contains : 'person 1'}}
   **/
  public columnsFilters = {};

  public dataSource: MatTableDataSource<Person>;
  display: number = 1;
  clubs: any;

  constructor(
    public dialog: MatDialog,
    private dataService: DataService,
    public router: Router,
    private communityService : CommunityService,
    private notify: TokenInterceptor,
    private config: Config,
    private fb: FormBuilder,
    private userService: UsersService
    ) {
      this.status = this.config?.status
      this.dataSource = new MatTableDataSource<Person>();
      this.imgPath = environment?.imgUrl;
  }

  /**
   * initialize data-table by providing persons list to the dataSource.
   */
    ngOnInit(): void {
      this.buildForm();
      this.getAllData();
      this.getAllClubType();
    }

  /**
   * Build search filter form
   */
  buildForm() {
    this.searchForm = this.fb.group({
      name: [""],
      type: [""],
      status: [""],
      filterType: ['']
    });
  }
  
  add(params: any, action?: string) {
    this.router.navigate(['/community/add-clubs']);
  }

  view(data:any){
    this.router.navigate(['/community/view-club'], {queryParams: { id: data.id}});
  }
  
  edit(id: number, params: string) {
    this.router.navigate(['/community/add-clubs'], {queryParams: { clubId: id, action: 'update-club' }, skipLocationChange: true});
  }

  delete(data: any, params: string) {
    let action: string = "delete-club";
    const dialogRef = this.dialog.open(DeletedialogComponent, {
      width: '380px',
      data: { info: params }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.communityService.deleteData(action, data?.id).subscribe((item:any) => {
          if(item?.status == 200) {
            this.notify.notificationService.success(item?.message);
            this.ngOnInit();
          }
        });
      }
    });
  }

  async onStatusChange(e:any, params: any) {
    let action = "update-club";
      let param = {
        id: params?.id,
        status: e?.target?.value
      }
      await this.communityService.updateData(action, param).subscribe((res: any) => {
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


  async getAllData() {
    let action = "all-clubsGet";
    await this.dataService.getAllData(action).subscribe(
      (club: any) => {
        if(club?.status == 200) {
          this.clubs = club?.data;
          this.dataSource.data = club?.data;
        }
      },
      (error) => {
        this.notify.notificationService.error(error?.message);
      }
    );
  }

  /**
   * Change view mode
   * @param mode 
   */
    changeView(mode: number): void {
      this.display = mode;
    }

  async searchData(){
    let isValue = Object.keys(this.searchForm.value).some(
      (value) => !!this.searchForm.value[value]
    );

    if (!isValue) {
      this.formReset = false;
      this.notify.notificationService.warning(
        "At least one field should be selected"
      );
    } else {
      this.formReset = true;
      this.clubs = [];
      this.searchForm.get("filterType").setValue(this.pageType);
      console.log(this.searchForm.value);
      await this.userService
        .filterData(this.searchForm?.value)
        .subscribe((res: any) => {
          this.clubs = res?.data;
          this.dataSource.data = this.clubs;
        });
    }
  }
  /**
   * Function to Reset Search Form filter
   */
    resetForm(i: any) {
      this.searchForm.reset(this.buildForm());
      this.getAllData();
      this.typeChecked = false;
      this.statusChecked = false;
      this.formReset = false;
    }

    async getAllClubType() {
      let action:string = "all-clubType";
      await this.dataService.getAllData(action).subscribe(
        (res: any) => {
          if(res?.status == 200) {
            this.clubType = res?.data;
          }
        },
        (error) => {
          this.notify.notificationService.error(error?.message);
        }
      );
    }
    viewClubMemberList(data:any, name:string, type: string) {
      const dialogRef = this.dialog.open(ViewUserListComponent, {
        width: '700px',
        data: { id: data?.id, name: name, type: type }
      });
    }
}
