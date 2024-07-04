import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { CelebrateService } from "src/app/services/celebrate.service";
import { CommonService } from "src/app/services/common.service";
import { environment } from "src/environments/environment";
import {CdkDragDrop, moveItemInArray, transferArrayItem, CdkDragHandle} from '@angular/cdk/drag-drop';
import * as moment from "moment";
import * as Highcharts from 'highcharts';
// import { Options } from "highcharts";

import { Chart } from "chart.js";

declare var require: any;
const More = require('highcharts/highcharts-more');
More(Highcharts);

import Histogram from 'highcharts/modules/histogram-bellcurve';
Histogram(Highcharts);

import highcharts3D from 'highcharts/highcharts-3d';
import { UsersService } from "src/app/services/users.service";
highcharts3D(Highcharts);

const Exporting = require('highcharts/modules/exporting');
Exporting(Highcharts);

const ExportData = require('highcharts/modules/export-data');
ExportData(Highcharts);

const Accessibility = require('highcharts/modules/accessibility');
Accessibility(Highcharts);

@Component({
  selector: "app-default",
  templateUrl: "./default.component.html",
  styleUrls: ["./default.component.scss"],
})
export class DefaultComponent implements OnInit, AfterViewInit{
  @ViewChild('chart1') public chart1: ElementRef;
  chart: any;
  options: any;
  userOption: any;

  totalAnalyticsCount = [];
  newsData: any;
  eventData: any;
  imgPath: any;
  currentUser: any;
  date: any;
  jsonData: any;
  totalRegisterd: any;
  userChart: any;
  convertUser:Array<any> = [];
  visitorCount: any;
 
  constructor(
    private commonService: CommonService,
    private celebrateService: CelebrateService,
    private userService: UsersService
  ) {
    setInterval(() => {
      this.date = moment().format('MMMM Do YYYY, h:mm:ss a');
    }, 1000);
    this.imgPath = environment?.imgUrl;
    this.currentUser = this.userService.getCurrentUser();
      
    this.getAllData();
    // this.options = {
    //   chart: {
    //       type: 'pie',
    //       options3d: {
    //           enabled: true,
    //           alpha: 40
    //       }
    //   },
    //   title: {
    //       text: 'Total User'
    //   },
    //   subtitle: {
    //       text: ''
    //   },
    //   plotOptions: {
    //       pie: {
    //           innerSize: 100,
    //           depth: 65
    //       }
    //   },
    //   series: [{
    //       name: 'Users',
    //       data: [
    //           ['Register', 8],
    //           ['Rejected', 3],
    //           ['Pending', 1],
    //           ['Approved', 6],
    //       ],
    //       animation: {
    //         defer: 200
    //       }
    //   }]
    // };
  }

  ngOnInit(): void {  
    $.getScript("./assets/js/deafult-dashboard.js");
    this.getAllNewsData();
    this.getAllEventData();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.userChart.map((x:any) => {
          let data = Object.entries(x);
          this.convertUser.push(data);
      })
      this.userChart = this.convertUser.flat();
      console.log(this.userChart)
          //User chart
        this.options = {
          chart: {
              type: 'pie',
              options3d: {
                  enabled: true,
                  alpha: 40
              }
          },
          title: {
              text: 'Total User'
          },
          subtitle: {
              text: ''
          },
          plotOptions: {
              pie: {
                  innerSize: 100,
                  depth: 65
              }
          },
          series: [{
              name: 'Users',
              // data: [
              //           ['Register', 8],
              //           ['Rejected', 3],
              //           ['Pending', 1],
              //           ['Approved', 6],
              //       ]
              
              data: this.userChart
          }]
        };

        Highcharts.chart('donChart', this.options);
        this.visitorChart();
      }, 1500);
  }

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.totalAnalyticsCount, event.previousIndex, event.currentIndex);
  }


  /**
   * Get all Dashboard data
   */
  async getAllData() {
    let action: string = "all-dashboard"
    await this.commonService.getAllData(action).subscribe((res:any) => {
      if(res?.status == 200) {
        this.userChart = res?.users;
        this.totalRegisterd = res?.users;
        this.visitorCount = res?.visitors
        this.totalAnalyticsCount = res?.count;
        console.log(this.userChart, 'user')
      }
      else console.log('Something went wrong')
    })
  }

  /**
   * Function to Get all latest news
   */
  getAllNewsData() {
    this.celebrateService.getAllData("all-news").subscribe((x: any) => {
      this.newsData = x.data.sort().reverse();
    });
  }
  /**
   * Function to Get all latest news
   */
  getAllEventData() {
    this.celebrateService.getAllData("all-eventsGet").subscribe((x: any) => {
      this.eventData = x.data.sort().reverse();
    });
  }
  /**
   * Function to get visitor chart
   */
  visitorChart() {
    let ctx: any = document.getElementById('visitor') as HTMLElement;
    const data = {
      labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      datasets: [
        {
          label: 'Website',
          data: this.visitorCount[0].web,
          backgroundColor: '#3f51b5',
          borderColor: 'lightblue',
          fill: false,
          lineTension: 0,
          radius: 3,
        },
        {
          label: 'App',
          data: this.visitorCount[0].mobile,
          backgroundColor: 'green',
          borderColor: 'lightgreen',
          fill: false,
          lineTension: 0,
          radius: 3,
        },
      ],
    };

    //options
    this.options = {
      responsive: true,
      // title: {
      //   display: true,
      //   position: 'top',
      //   fontSize: 18,
      //   fontColor: '#111',
      // },
      legend: {
        display: true,
        position: 'top',
        labels: {
          fontColor: '#333',
          fontSize: 16
        },
      },
    };

    const chart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: this.options
    });
  }

  totalUserChart() {
    let user: any = document.getElementById('userChart') as HTMLElement;
    const data = {
      labels: ['Register', 'Pending', 'Approved', 'Rejected'],
        datasets: [
          {
            label: 'My First Dataset',
            data: [200, 50, 130, 20],
            backgroundColor: [
              '#02ba5a',
              '#fba540',
              '#14abef',
              '#e42343'
            ],
          },
        ]
    }

    //User options
    this.userOption = {
      borderRadius: 20,
      responsive: true
    }
    const chart= new Chart(user, {
      type: 'doughnut',
      data: data,
      options: this.userOption
    });
  }
}
