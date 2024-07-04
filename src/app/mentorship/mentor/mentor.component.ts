import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TokenInterceptor } from 'src/app/core/token.interceptor';
import { Person } from 'src/app/models/person';
import { DataService } from 'src/app/services/data.service';
import { UsersService } from 'src/app/services/users.service';
import { AddMenteeComponent } from 'src/app/shared/dialog/collaborate/add-mentee/add-mentee.component';
import { EditMenteeComponent } from 'src/app/shared/dialog/collaborate/edit-mentee/edit-mentee.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mentor',
  templateUrl: './mentor.component.html',
  styleUrls: ['./mentor.component.scss']
})
export class MentorComponent implements OnInit {
  public status = 'active';
  pageType: string = "mentor";
  getMentor: Array<any> = [];
  searchForm: FormGroup;
  formReset: boolean;
 
  nameChecked: boolean = true;
  emailChecked: boolean; 
  mobileChecked: boolean; 
  instituteChecked: boolean;
  batchChecked: boolean;
  priIndustryChecked: boolean;
  secIndustryChecked: boolean;
  priFunctionChecked: boolean;
  secFunctionChecked: boolean;
  skillChecked: boolean;
  

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['email', 'mobile_number', 'mentee_count'];
  public columnsToDisplay: string[] = ['sr.no', 'profile_pic', ...this.displayedColumns,'addMentee', 'actions'];

  /**
   * it holds a list of active filter for each column.
   * example : {firstName: {contains : 'person 1'}}
   **/
  public columnsFilters = {};

  public dataSource: MatTableDataSource<Person>;
  skill: any;
  getInstitutes: any;
  getBatch: any;
  secondaryInd: any;
  primaryInd: any;
  primaryFunc: any;
  secondaryFunc: any;
  imgPath: any;

  constructor( 
    public dialog: MatDialog,
    private dataService: DataService,
    public router: Router,
    private fb: FormBuilder,
    private notify: TokenInterceptor,
    private userService: UsersService
    ) {
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

  buildForm() {
    this.searchForm = this.fb.group({
      first_name: [""],
      email: [""],
      mobile_number: [""],
      institute_id: [""],
      batchYear_id: [""],
      primary_industry_focus: [""],
      secondary_industry_focus: [""],
      primary_function_area: [""],
      secondary_function_area: [""],
      skill: [""],
      filterType: ['']
    })
  }
  

  /**
   * Function to add project List
   */
  add(params: any, action: string) {
    const dialogRef = this.dialog.open(AddMenteeComponent, {
      width: '750px',
      data: {data: params, action: action}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ngOnInit();
      }
    });
  }
  /**
   * View Mentor Info
   */
  view(e: any) {
    this.router.navigate(["/user-profile"], { queryParams: { id: e?.user_id } });
  }

  /**
   * Function to edit project
   * @param data 
   * @param params 
   */
  edit(data: any, params: any) {
    const dialogRef = this.dialog.open(EditMenteeComponent, {
      width: '650px',
      data: {data: data, action: params}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ngOnInit();
      }
    });
  }

  async onStatusChange(e:any, params: any) {
    let action = "update-gallery";
      let param = {
        id: params?.id,
        status: e?.value
      }
      await this.dataService.updateData(action, param).subscribe((res: any) => {
        if(res?.status == 200) {
        }
      }, error => {
        console.log(error);
      });
    
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Function to Get All project data
   */
  async getAllData() {
    let action = "willProvide-mentorship";
    this.getMentor = [];
    await this.dataService.getAllData(action).subscribe(
      (res: any) => {
        if(res?.status == 200) {
          this.getMentor = res?.data.filter((x:any) => {return x?.status != null && x.status != "rejected"});
          this.dataSource.data = this.getMentor;
        }
      },
      (error) => {
        // this.interceptor.notificationService.openFailureSnackBar(error);
      }
    );
  }

  async getCommonApi() {
    let action = "all-common";
    await this.dataService.getData(action).subscribe(
      (res: any) => {
        this.skill = res?.Skill;
        this.getInstitutes = res?.Institute;
        this.getBatch = res?.Batch_Year;
        this.primaryInd = res?.Primary_Industry;
        this.secondaryInd = res?.Secondary_Industry;
        this.primaryFunc = res?.Primary_Function;
        this.secondaryFunc = res?.Secondary_Function;
      },
      (error) => {
        this.notify.notificationService.openFailureSnackBar(error);
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
        this.notify.notificationService.warning(
          "At least one field should be selected"
        );
      } else {
        this.getMentor = [];
        this.formReset = true;
        this.searchForm.get("filterType").setValue(this.pageType);
        await this.userService
          .filterData(this.searchForm?.value)
          .subscribe((res: any) => {
              this.getMentor = res?.data;
              this.dataSource.data = this.getMentor;
          });
      }
    }
          
    /**
     * Function to Reset Search Form filter
     */
    resetForm() {
      this.searchForm.reset(this.buildForm());
      this.getAllData();
      this.emailChecked = false;
      this.mobileChecked = false;
      this.instituteChecked = false;
      this.batchChecked = false;
      this.priIndustryChecked = false;
      this.secIndustryChecked = false;
      this.priFunctionChecked = false;
      this.secFunctionChecked = false;
      this.skillChecked = false;
      this.formReset = false;
    }
  
}
