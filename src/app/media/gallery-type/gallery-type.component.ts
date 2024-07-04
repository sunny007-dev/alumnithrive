import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TokenInterceptor } from 'src/app/core/token.interceptor';
import { Person } from 'src/app/models/person';
import { CelebrateService } from 'src/app/services/celebrate.service';
import { Config } from 'src/app/services/config';
import { SeoService } from 'src/app/services/seo.service';
import { DeletedialogComponent } from 'src/app/shared/dialog/deletedialog/deletedialog.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-gallery-type',
  templateUrl: './gallery-type.component.html',
  styleUrls: ['./gallery-type.component.scss']
})
export class GalleryTypeComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['category_name'];
  public columnsToDisplay: string[] = ['sr.no', ...this.displayedColumns, 'created_at', 'status', 'actions'];

  /**
   * it holds a list of active filter for each column.
   * example : {firstName: {contains : 'person 1'}}
   **/
  public columnsFilters = {};

  public dataSource: MatTableDataSource<Person>;
  status: any;
  imgPath: any;

  constructor(
    public dialog: MatDialog,
    private celebrateService: CelebrateService,
    private notifyService: TokenInterceptor,
    private seoService: SeoService,
    private config: Config,
    public router: Router
    ) {
      this.status = this.config?.status;
      this.dataSource = new MatTableDataSource<Person>();
      this.imgPath = environment?.imgUrl;
  }
  
/**
 * Add Gallery
 * @param params 
 * @param action 
 */
  add(params: any, action?: string) {
    this.router.navigate(['/media/add-edit-gallery-category'], {queryParams: {action:action}});
  }
  
/**
 * Function to Edit Gallery by Id
 * @param data 
 * @param params 
 */
  edit(data: any, params: any) {
    this.router.navigate(['/media/add-edit-gallery-category'], {queryParams: {id: data?.id, action:params}});
  }


  delete(data: any, params: string) {
    let action: string = "delete-galleryCategories";
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
    let action = "update-galleryCategories";
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

  /**
   * initialize data-table by providing persons list to the dataSource.
   */
  ngOnInit(): void {
    const content = "Alumni 2023 description here";
    const title = 'Gallery';
    
    this.seoService.setMetaDescription(content);
    this.seoService.setMetaTitle(title);

    this.getAllData();
  }

  async getAllData() {
    let action = "all-galleryCategories";
    await this.celebrateService.getAllData(action).subscribe(
      (gal: any) => {
        if(gal?.status == 200) this.dataSource.data = gal?.data;
      },
      (error) => {
        this.notifyService.notificationService.error(error?.message);
      }
    );
  }

}
