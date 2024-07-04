import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactService } from 'src/app/services/contact.service';

@Component({
  selector: 'app-view-queries',
  templateUrl: './view-queries.component.html',
  styleUrls: ['./view-queries.component.scss']
})
export class ViewQueriesComponent implements OnInit {

  contactId: number;
  contactData: any;
  loading: boolean;
  pageType: any;
  
  constructor(public aroute: ActivatedRoute, private contactService: ContactService) { 
        // Get Id by queryparams
        this.aroute.queryParams.subscribe((params: any) => {
          this.contactId = params?.id;
          this.pageType = params?.type
        })
  }

  async ngOnInit() {
    this.loading = true;
    if(this.contactId) this.getAllData();
  }
/**
 * Function to get single Offer Expertise by id
 */
  async getAllData() {
    this.loading = true;
    let action  = 'single-contactQueries';
      await this.contactService.getDataById(action, this.contactId).subscribe((res:any) => {
        console.log(res);
        this.contactData = res?.data;
        this.loading = false;
      }); 
  }


}
