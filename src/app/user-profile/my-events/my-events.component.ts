import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss']
})
export class MyEventsComponent implements OnInit {

  @Input() profileData: any;
  @Input() commonData: any;
  
  constructor() { }

  ngOnInit(): void {
  }

}
