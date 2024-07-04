import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { CommunityService } from 'src/app/services/community.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-business-ventures',
  templateUrl: './view-business-ventures.component.html',
  styleUrls: ['./view-business-ventures.component.scss']
})
export class ViewBusinessVenturesComponent implements OnInit {
  userId: number;
  ventureData: any;
  loading:boolean;
  imgUrl: any;

  constructor(public aroute: ActivatedRoute, private communityService: CommunityService) {
    this.imgUrl = environment?.imgUrl;
    // Get Id by queryparams
    this.aroute.queryParams.subscribe((params: any) => {
      this.userId = params?.userId;
    })
  }

  async ngOnInit() {
    this.loading = true;
    let action  = 'single-entrepreneur';
      await this.communityService.getDataById(action, this.userId).pipe(
        map((x:any) => {
          return x?.data?.filter((z: any) => {return z})
        })
      ).subscribe((res:any) => {
        this.ventureData = res[0];
        this.loading = false;
      });  
  }

}
