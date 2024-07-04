import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TokenInterceptor } from 'src/app/core/token.interceptor';
import { CollaborateService } from 'src/app/services/collaborate.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-user-list',
  templateUrl: './view-user-list.component.html',
  styleUrls: ['./view-user-list.component.scss']
})
export class ViewUserListComponent{
  getMember: Array<any> = [];
  imgUrl: any;
  loading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<ViewUserListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private collaborateService: CollaborateService,
    private router: Router,
    private notify: TokenInterceptor
  ){
    console.log(this.data);
    this.imgUrl = environment?.imgUrl;
    this.getMemberById(this.data?.id)
  }

  async getMemberById(id:number) {
    this.loading = true;
    let action:string = this.data?.type;
    await this.collaborateService.getDataById(action, id).subscribe((res: any) => {
      this.getMember = res?.data;
      this.loading = false;
    }, err => {
      this.notify.notificationService.error(err?.message);
      this.loading = false;
    })
  }
   /**
   * View User profile
   * @param id 
   */
   viewProfile(id:number) {
    this.dialogRef.close();
    this.router.navigate([`user-profile/${id}`]);
  }
}
