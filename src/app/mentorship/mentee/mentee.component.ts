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
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mentee',
  templateUrl: './mentee.component.html',
  styleUrls: ['./mentee.component.scss']
})
export class MenteeComponent implements OnInit {
  public status = 'active';
  pageType: string = "mentee";
  searchForm: FormGroup;
  formReset: boolean;
  getMentee: Array<any> = [];
  imgPath: any;

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

  public displayedColumns: string[] = ['email', 'mobile_number', 'mentor_count'];
  public columnsToDisplay: string[] = ['sr.no','profile_pic', ...this.displayedColumns, 'actions'];

  /**
   * it holds a list of active filter for each column.
   * example : {firstName: {contains : 'person 1'}}
   **/
  public columnsFilters = {};

  public dataSource: MatTableDataSource<Person>;
  skill: any;
  getInstitutes: any;
  getBatch: any;
  primaryInd: any;
  secondaryInd: any;
  primaryFunc: any;
  secondaryFunc: any;

  constructor(
    public dialog: MatDialog,
    private dataService: DataService,
    public router: Router,
    private notify: TokenInterceptor,
    private userService: UsersService,
    public fb: FormBuilder
    ) {
    this.dataSource = new MatTableDataSource<Person>();
    this.imgPath = environment?.imgUrl;
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
  view(e: any) {
    this.router.navigate(["/user-profile"], { queryParams: { id: e?.user_id } });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
   * Function to Get All project data
   */
  async getAllData() {
    let action = "willProvide-mentee";
    this.getMentee = [];
    await this.dataService.getAllData(action).subscribe(
      (res: any) => {
        if(res?.status == 200) {
          this.getMentee = res?.data.filter((x:any) => {return x?.status != null && x.status != "rejected"});
          this.dataSource.data = this.getMentee;
        }
      },
      (error) => {
        console.log(error);
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
        this.notify.notificationService.error(error?.message);
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
      this.getMentee = [];
      this.formReset = true;
      this.searchForm.get("filterType").setValue(this.pageType);
      await this.userService
        .filterData(this.searchForm?.value)
        .subscribe((res: any) => {
            this.getMentee = res?.data;
            this.dataSource.data = this.getMentee;
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
