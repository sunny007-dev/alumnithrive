import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TokenInterceptor } from 'src/app/core/token.interceptor';
import { Person } from 'src/app/models/person';
import { Config } from 'src/app/services/config';
import { DonationsService } from 'src/app/services/donations.service';
import { UsersService } from 'src/app/services/users.service';
import { DeletedialogComponent } from 'src/app/shared/dialog/deletedialog/deletedialog.component';

@Component({
  selector: 'app-donations-list',
  templateUrl: './donations-list.component.html',
  styleUrls: ['./donations-list.component.scss']
})
export class DonationsListComponent implements OnInit {

 getAllDonation: Array<any> = [];

 searchForm: FormGroup;
 formReset: boolean;
 pageType: string = "donation";
 donationCat: any;

 titleChecked: boolean = true;
 categoryChecked: boolean;
 typeChecked: boolean;
 targetChecked: boolean;
 amountChecked: boolean;
 statusChecked: boolean;
 
 
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['donation_title', 'donation_type','donation_category_name', 'donation_amount','donation_target_amount'];
  public columnsToDisplay: string[] = ['sr.no', ...this.displayedColumns,'created_at', 'status', 'actions'];

  /**
   * it holds a list of active filter for each column.
   * example : {firstName: {contains : 'person 1'}}
   **/
  public columnsFilters = {};

  public dataSource: MatTableDataSource<Person>;
  status: any;
  donationType: any;

  constructor(
    public dialog: MatDialog,
    private donationsService: DonationsService,
    public router: Router,
    private notify : TokenInterceptor,
    private config: Config,
    private fb: FormBuilder,
    private userService: UsersService
    ) {
      this.status = this.config?.status;
      this.donationType = this.config?.donationType;
      this.dataSource = new MatTableDataSource<Person>();
    }
    
  /**
   * initialize data-table by providing persons list to the dataSource.
   */
  ngOnInit(): void {
    this.buildForm();
    this.getAllData();
    this.getAllCategory();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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
    this.router.navigate(['/donations/add-edit-donations'], {queryParams: {action: params}});
  }
/**
 * Function to Edit donation
 * @param data 
 * @param params 
 */
  edit(data: any, params: string) {
    this.router.navigate(['/donations/add-edit-donations'], {queryParams: {id: data?.id, action: params}});
  }

  delete(data: any, params: string) {
    let action:string = "delete-donation";
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

  /**
 * Build search filter form
 */
  buildForm() {
    this.searchForm = this.fb.group({
      donation_title: [""],
      donation_category_name: [""],
      donation_amount: [""],
      donation_target_amount:[''],
      donation_type: [""],
      status: [""],
      filterType: ['']
    });
  }

  /**
   * Function to Get All project data
   */
  async getAllData() {
    let action = "all-donation";
    // this.getAllContact = [];
    await this.donationsService.getAllData(action).subscribe(
      (res: any) => {
          this.getAllDonation =  res?.Donation;
          this.dataSource.data = this.getAllDonation;
      },
      (error) => {
          this.notify.notificationService.error(error?.message);
      }
    );
  }
/**
 * Function to Change donation status
 * @param e 
 * @param params 
 */
  async onStatusChange(e:any, params: any) {
    let action = "update-donation";
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

    /**
   * Function to Reset Search Form filter
   */
    resetForm(i: any) {
      this.searchForm.reset(this.buildForm());
      this.getAllData();
      // this.nameChecked = false;
      // this.instituteChecked = false;
      // this.designationChecked = false;
      this.categoryChecked= false;
      this.typeChecked= false;
      this.targetChecked= false;
      this.amountChecked= false;
      this.statusChecked= false;
      this.statusChecked = false;
      this.formReset = false;
    }

      /**
   * Function to Get All project data
   */
  async getAllCategory() {
    let action = "all-donationCategories";
    // this.getAllContact = [];
    await this.donationsService.getAllData(action).subscribe(
      (res: any) => {
          this.donationCat = res?.Donation;
      },
      (error) => {
          this.notify.notificationService.error(error?.message);
      }
    );
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
      this.getAllDonation = [];
      this.searchForm.get("filterType").setValue(this.pageType);
      console.log(this.searchForm.value);
      await this.userService
        .filterData(this.searchForm?.value)
        .subscribe((res: any) => {
          this.getAllDonation = res?.data;
          this.dataSource.data = this.getAllDonation;
        });
    }
  }
}
