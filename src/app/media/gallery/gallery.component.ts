import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { TokenInterceptor } from "src/app/core/token.interceptor";
import { Person } from "src/app/models/person";
import { CelebrateService } from "src/app/services/celebrate.service";
import { Config } from "src/app/services/config";
import { SeoService } from "src/app/services/seo.service";
import { DeletedialogComponent } from "src/app/shared/dialog/deletedialog/deletedialog.component";
import { environment } from "src/environments/environment";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDragHandle,
} from "@angular/cdk/drag-drop";
import { FormBuilder, FormGroup } from "@angular/forms";
import { UsersService } from "src/app/services/users.service";

@Component({
  selector: "app-gallery",
  templateUrl: "./gallery.component.html",
  styleUrls: ["./gallery.component.scss"],
})
export class GalleryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("table") table: MatTable<any>;

  public displayedColumns: string[] = ["title", "category_name", "order_by"];
  public columnsToDisplay: string[] = [
    "sr.no",
    "file",
    ...this.displayedColumns,
    "link",
    "status",
    "actions",
  ];

  /**
   * it holds a list of active filter for each column.
   * example : {firstName: {contains : 'person 1'}}
   **/
  public columnsFilters = {};

  public dataSource: MatTableDataSource<Person>;
  status: any;
  imgPath: any;
  display: number = 1;
  allGallery: any;
  galleryType: any;

  searchForm : FormGroup;
  formReset: boolean;
  pageType = "gallery";

  titleChecked: boolean = true;
  categoryChecked: boolean;
  statusChecked: boolean;

  constructor(
    public dialog: MatDialog,
    private celebrateService: CelebrateService,
    private notifyService: TokenInterceptor,
    private seoService: SeoService,
    private config: Config,
    public router: Router,
    private fb: FormBuilder,
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
    const content = "Alumni 2023 description here";
    const title = "Gallery";

    this.seoService.setMetaDescription(content);
    this.seoService.setMetaTitle(title);

    this.buildForm();
    this.getGalleryType();
    this.getAllData();
  }

/**
 * Build search filter form
 */
  buildForm() {
    this.searchForm = this.fb.group({
      title: [""],
      category_name: [""],
      status: [""],
      filterType: ['']
    });
  }

  /**
   * Function to drop table list
   * @param event
   */
  dropList(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.item.dropContainer.data,
        event.previousIndex,
        event.currentIndex
      );
      this.dataSource.data = event.item?.dropContainer?.data;
      this.updateOrder(this.allGallery);
      this.allGallery = [];
      setTimeout(() => {
        this.ngOnInit();
      }, 1000);
    }
  }

  /**
   * Function to Update order
   * @param data 
   */
  async updateOrder(data: any) {
    let action: string = "swap-galleryOrder";
    await this.celebrateService.postData(action, data).subscribe(
      (x: any) => {
        if (x?.status == 200) {
          this.notifyService.notificationService.success(x?.message);
        } else {
          this.notifyService.notificationService.warning(
            "Something went wrong !"
          );
        }
      },
      (error) => {
        this.notifyService.notificationService.error(error?.message);
      }
    );
  }

  view(data: any) {
    this.router.navigate(["/media/view-gallery"], {
      queryParams: { id: data?.id },
    });
  }
  /**
   * Add Gallery
   * @param params
   * @param action
   */
  add(params: any, action?: string) {
    this.router.navigate(["/media/add-edit-gallery"], {
      queryParams: { action: action },
    });
  }

  /**
   * Function to Edit Gallery by Id
   * @param data
   * @param params
   */
  edit(data: any, params: any) {
    this.router.navigate(["/media/add-edit-gallery"], {
      queryParams: { id: data?.id, action: params },
    });
  }

  /**
   * Function to delete data with id
   * @param data 
   * @param params 
   */
  delete(data: any, params: string) {
    let action: string = "delete-gallery";
    const dialogRef = this.dialog.open(DeletedialogComponent, {
      width: "400px",
      data: { data: data, info: params },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.celebrateService
          .deleteData(action, data?.id)
          .subscribe((res: any) => {
            if (res?.status == 200) {
              this.notifyService.notificationService.success(res?.message);
              this.ngOnInit();
            }
          });
      }
    });
  }

  /**
   * Function to Change status
   * @param e 
   * @param params 
   */
  async onStatusChange(e: any, params: any) {
    let action = "update-gallery";
    let param = {
      id: params?.id,
      status: e?.target?.value,
    };
    await this.celebrateService.updateData(action, param).subscribe(
      (res: any) => {
        if (res?.status == 200) {
          this.notifyService.notificationService.success(res?.message);
          this.ngOnInit();
        }
      },
      (error) => {
        this.notifyService.notificationService.error(error?.message);
      }
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async getAllData() {
    let action = "all-gallery";
    await this.celebrateService.getAllData(action).subscribe(
      (gal: any) => {
        if (gal?.status == 200) {
          this.allGallery = gal?.data;
          this.sortByOrder();
          this.dataSource.data = this.allGallery;
        }
      },
      (error) => {
        this.notifyService.notificationService.error(error?.message);
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

  /**
  * Function to sorting data
  */
  sortByOrder() {
    this.allGallery.sort((a, b) => a.order_by - b.order_by);
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
        this.allGallery = [];
        this.formReset = true;
        this.searchForm.get("filterType").setValue(this.pageType);
        await this.userService
          .filterData(this.searchForm?.value)
          .subscribe((res: any) => {
              this.allGallery = res?.data;
              this.dataSource.data = this.allGallery;
          });
      }
    }
      
    /**
     * Function to Reset Search Form filter
     */
    resetForm() {
      this.searchForm.reset(this.buildForm());
      this.getAllData();
      this.categoryChecked = false;
      this.statusChecked = false;
      this.formReset = false;
    }
  
        /**
     * Function to get all jobs
     */
    async getGalleryType() {
      let action:string = "all-galleryCategories";
      await this.celebrateService.getAllData(action).subscribe((res:any) => {
        if(res?.status == 200) {
          this.galleryType = res?.data;
        }
      })
    }
}
