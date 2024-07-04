import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { TokenInterceptor } from 'src/app/core/token.interceptor';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-point-table',
  templateUrl: './point-table.component.html',
  styleUrls: ['./point-table.component.scss']
})
export class PointTableComponent implements OnInit {
  userId: any;
  currentUser: any;
  profileData: any;
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  value = 50;
  bufferValue = 75;

  constructor(private dataService: DataService,
    private notify: TokenInterceptor, private router: Router,
    private location: Location) {
    if (localStorage) {
      this.currentUser =
        JSON?.parse(localStorage?.getItem("currentUser") || "");
    }
   }

  ngOnInit(): void {
    this.getAllProfileData();
  }


  async getAllProfileData() {
    let action: string = "all-profileUsers";
    await this.dataService
      .getDataById(action, (this.userId) ? this.userId : this.currentUser?.id)
      .subscribe((res: any) => {
        this.profileData = res;
      }, error => {
        this.notify.notificationService.error(error);
      });
  }

  /**
   * Click to Edit/View User profile
   */
  viewProfile() {
    this.router.navigate(['user-profile'], { queryParams: { id: this.currentUser?.id, type: 'edit' } });
    setTimeout(() => {
        location.reload();
    }, 500);
  }

  navigateBack(){
    this.location.back();
  }
}
