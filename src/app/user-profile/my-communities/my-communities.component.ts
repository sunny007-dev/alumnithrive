import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-communities',
  templateUrl: './my-communities.component.html',
  styleUrls: ['./my-communities.component.scss']
})
export class MyCommunitiesComponent implements OnInit {

  @Input() profileData: any;
  @Input() commonData: any;

  constructor() { }

  ngOnInit(): void {
  }

}
