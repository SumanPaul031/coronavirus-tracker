import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { GlobalDataSummary } from 'src/app/models/global-data';
import { DateWiseData } from 'src/app/models/datewise-data';
import { GoogleChartComponent } from 'angular-google-charts';
import { merge } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css']
})
export class CountriesComponent implements OnInit {

  totalConfirmed = 0;
  totalDeaths = 0;
  totalActive = 0;
  totalRecovered = 0;

  // data: GlobalDataSummary[];
  data;
  countries: string[] = [];

  dateWiseData;
  selectedCountryData: DateWiseData[];
  selectedCountry = 'India';

  displayedColumns: string[] = ['num', 'Date', 'Cases'];
  loading: boolean = true;

  @ViewChild('linechart') linechart: GoogleChartComponent;

  chart = {
    LineChart: 'LineChart',
    height: 400,
    options: {
      'backgroundColor': 'transparent',
      is3D: true,
      legend: {
        position:'top',
        textStyle: {
          color: '#fff'
        }
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
      }
    },
    columnNames: ['Date', 'Cases']
  }

  dataTable = [];

  constructor(private service: DataService) { }

  ngOnInit(): void {
    merge(
      this.service.getDateWiseData().pipe(map(result => {
        this.dateWiseData = result;
      })),
      this.service.getGlobalData().pipe(map(result => {
        this.data = result;
        console.log(this.data.length);
        this.data.forEach(cs => {
          this.countries.push(cs.country);
        })
      }))
    ).subscribe({
      complete: () => {
        // this.selectedCountryData = this.dateWiseData['India'];
        // this.updateChart();
        this.updateValues('India');
        this.loading = false;
      }
    })
  }

  updateChart(){
    this.dataTable = [];
    
    this.selectedCountryData.forEach(cs => {
      this.dataTable.push([cs.date, cs.cases])
    })
  }

  updateValues(country){
    console.log(country);
    this.data.forEach(cs => {
      if(cs.country == country){
        this.totalActive = cs.active;
        this.totalConfirmed = cs.confirmed;
        this.totalDeaths = cs.deaths;
        this.totalRecovered = cs.recovered;
      }
    })

    this.selectedCountryData = this.dateWiseData[country];
    this.updateChart();
  }

}
