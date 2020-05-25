import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { GlobalDataSummary } from 'src/app/models/global-data';
import {
  IBarChartOptions,
  IChartistAnimationOptions,
  IChartistData
} from 'chartist';
import { ChartEvent, ChartType } from 'ng-chartist';

import {GoogleChartComponent} from 'angular-google-charts';

// needed for advanced usage of ng2-google-charts
import {HostListener} from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  totalConfirmed = 0;
  totalDeaths = 0;
  totalActive = 0;
  totalRecovered = 0;
  globalData: GlobalDataSummary[];
  loading: boolean = true;

  @ViewChild('columnchart') columnchart: GoogleChartComponent;
  @ViewChild('piechart') piechart: GoogleChartComponent;

  chart = {
    PieChart: 'PieChart',
    ColumnChart: 'ColumnChart',
    GeoChart: 'GeoChart',
    height: 400,
    options: {
      'backgroundColor': 'transparent',
      is3D: true,
      legend: {
        position:'top',
        textStyle: {
          color: '#fff'
        },
        bold: false
      },
      hAxis: {
        baselineColor: '#fff',
        textStyle:{color: '#fff'},
      },
      vAxis: {
        baselineColor: '#fff',
        textStyle:{color: '#fff'},
      },
      animation: {
        duration: 1000,
        easing: 'out'
      },
      colorAxis: {colors: ['white', 'red']}
    },
    columnNames: ['Country', 'Cases']
  }

  options = {
    'backgroundColor': 'transparent',
    legend: {
      textStyle: {
        color: '#000'
      },
      bold: false
    },
    animation: {
      duration: 1000,
      easing: 'out'
    },
    colorAxis: {colors: ['white', 'red']}
  }

  dataTable = [];
  mapdataTable = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.dataService.getGlobalData().subscribe({
      next: (result) => {
        this.globalData = result;
        result.forEach(cs => {
          if(!Number.isNaN(cs.confirmed)){
            this.totalActive += cs.active;
            this.totalConfirmed += cs.confirmed;
            this.totalDeaths += cs.deaths;
            this.totalRecovered += cs.recovered;
          }
        })

        this.initChart('confirmed');
      },
      complete: () => {
        this.loading = false;
      }
    })
  }

  initChart(caseType: string){

    this.dataTable = [];
    
    this.globalData.forEach(cs => {
      let val: number;
      let val1: number;
      if(caseType == 'confirmed'){
        // if(cs.confirmed > 12000){
        //   val = cs.confirmed;
        // }
        val = cs.confirmed;
      } else if(caseType == 'active'){
        // if(cs.active > 12000){
        //   val = cs.active;
        // }
        val = cs.active;
      } else if(caseType == 'deaths'){
        // if(cs.deaths > 5000){
        //   val = cs.deaths;
        // }
        val = cs.deaths;
      } else if(caseType == 'recovered'){
        // if(cs.recovered > 12000){
        //   val = cs.recovered;
        // }
        val = cs.recovered;
      }
      this.dataTable.push([
        cs.country,
        val
      ]);
      // this.mapdataTable.push([
      //   cs.country,
      //   val1
      // ]);
    })
  }

  // @HostListener('window:resize', ['$event'])
  // onWindowResize(event: any) {
  //   this.columnchart.draw(); 
  //   this.piechart.draw(); 
  // }

  updateChart(input: HTMLInputElement){
    this.initChart(input.value);
    // this.columnchart.draw(); 
    // this.piechart.draw();
  }

}
