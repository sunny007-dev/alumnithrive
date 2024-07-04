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
import { CountryService } from 'src/app/services/country.service';
import { DataService } from 'src/app/services/data.service';
import { UsersService } from 'src/app/services/users.service';
import { DeletedialogComponent } from 'src/app/shared/dialog/deletedialog/deletedialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-featured-alumni',
  templateUrl: './featured-alumni.component.html',
  styleUrls: ['./featured-alumni.component.scss']
})
export class FeaturedAlumniComponent implements OnInit {
  imgPath:any;
  display: number = 1;
  allFeaturedAlumni: Array<any> = [];

  skill: any;
  getInstitutes: any;
  getBatch: any;
  primaryInd: any;
  secondaryFunc: any;
  primaryFunc: any;
  secondaryInd: any;

  searchForm : FormGroup;
  formReset: boolean;
  pageType = "featured-alumni";

  nameChecked: boolean = true;
  emailChecked: boolean;
  phoneChecked: boolean;
  instituteChecked: boolean;
  bactchChecked: boolean;
  cityChecked: boolean;
  countryChecked: boolean;
  cmpChecked: boolean;
  statusChecked: boolean;
 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['full_name', 'email', 'batch'];
  public columnsToDisplay: string[] = ['sr.no','file', ...this.displayedColumns, 'status', 'actions'];

  /**
   * it holds a list of active filter for each column.
   * example : {firstName: {contains : 'person 1'}}
   **/
  public columnsFilters = {};

  public dataSource: MatTableDataSource<Person>;
  status: any;
  countries: any;

  constructor(
    public dialog: MatDialog,
    private celebrateService: CelebrateService,
    public router: Router,
    private notifyService: TokenInterceptor,
    private config: Config,
    private fb: FormBuilder,
    private dataService: DataService,
    private userService: UsersService,
    private countryService: CountryService
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
    this.loadCountries();
    this.getAllData();
  }

/**
 * Build search filter form
 */
buildForm() {
  this.searchForm = this.fb.group({
    fullName: [""],
    first_name: [""],
    email: [""],
    mobile_number: [""],
    institute_name: [""],
    batch: [""],
    current_city: [""],
    current_country: [""],
    current_company:[''],
    status: [""],
    filterType: ['']
  });
}

add(data:any, params:string){
  this.router.navigate(['/celebrate/create-featured-alumni']);
}

view(data: any){
  console.log(data);
  this.router.navigate(['/celebrate/view-featured-alumni'],{
    queryParams: { userId: data?.id }
  });
}

/**
 * Function to Edit Featured Alumni By Id
 * @param data 
 * @param params 
 */
  edit(data: any, params: string) {
    this.router.navigate(['/celebrate/create-featured-alumni'], {queryParams: {alumniId: data?.id, action: params}});
  }

/**
 * Function to Delete Featrued alumni By Id
 * @param data 
 * @param params 
 */
  delete(data: any, params: string) {
    let action: string = "delete-getFeatured";
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

  async onStatusChange(e:any, params: any) {
    let action = "update-getFeatured";
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
    let action = "all-getFeatured";
    await this.celebrateService.getAllData(action).subscribe(
      (res: any) => {
        if(res?.status == 200) this.allFeaturedAlumni = res?.data; this.dataSource.data = res?.data;
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
    this.allFeaturedAlumni = [];
    this.formReset = true;
    this.searchForm.get("filterType").setValue(this.pageType);
    await this.userService
      .filterData(this.searchForm?.value)
      .subscribe((res: any) => {
          this.allFeaturedAlumni = res?.data;
          this.dataSource.data = this.allFeaturedAlumni;
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
  this.phoneChecked = false;
  this.instituteChecked = false;
  this.bactchChecked = false;
  this.cityChecked = false;
  this.countryChecked = false;
  this.cmpChecked = false;
  this.statusChecked = false;
  // this.startDateChecked = false;
  // this.endDateChecked = false
  // this.selectedSearch = [];
  this.formReset = false;
}

  /**
 * Change view mode
 * @param mode 
 */
  changeView(mode: number): void {
    this.display = mode;
  }

  public loadCountries() {
    this.countryService.getCountries().subscribe((data) => {
      this.countries = data;
    });
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
        this.notifyService.notificationService.error(error?.message);
      }
    );
  }

}
