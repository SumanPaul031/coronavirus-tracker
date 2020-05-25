import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { GlobalDataSummary } from '../models/global-data';
import { DateWiseData } from '../models/datewise-data';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private baseUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/`;
  private globalDataUrl = ``;
  private datewiseDataUrl = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv`;
  private extension = `.csv`;
  month;
  date;
  year;

  constructor(private http: HttpClient) { 
    let now = new Date;
    this.month = now.getMonth() + 1;
    this.date = now.getDate();
    this.year = now.getFullYear();
    
    this.globalDataUrl = `${this.baseUrl}${this.getDate(this.month)}-${this.getDate(this.date)}-${this.year}${this.extension}`;
  }

  getDate(date: number){
    if(date < 10){
      return '0'+date;
    }
    return date;
  }

  getDateWiseData(){
    return this.http.get(this.datewiseDataUrl, { responseType: 'text' }).pipe(
      map(result => {
        let rows = result.split('\n');
        let mainData = {};
        let header = rows[0];
        let dates = header.split(/,(?=\S)/);
        dates.splice(0, 4);
        rows.splice(0, 1);
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/);
          let country = cols[1];
          cols.splice(0,4);
          mainData[country] = [];
          cols.forEach((val, index) => {
            let dw: DateWiseData = {
              cases: +val,
              country: country,
              date: new Date(Date.parse(dates[index]))
            };
            mainData[country].push(dw);
          })
        });
        return mainData;
      })
    );
  }

  getGlobalData(){
    return this.http.get(this.globalDataUrl, { responseType: 'text' }).pipe(
      map(result => {
        let data: GlobalDataSummary[] = [];
        let raw = {};
        let rows = result.split('\n');
        rows.splice(0, 1);
        // console.log(rows.length);
        rows.forEach(row => {
          let cols = row.split(/,(?=\S)/);
          let cs = {
            country: cols[3],
            confirmed: +cols[7],
            deaths: +cols[8],
            recovered: +cols[9],
            active: +cols[10]
          };
          let temp: GlobalDataSummary = raw[cs.country];
          if(temp){
            temp.active = cs.active + temp.active;
            temp.confirmed = cs.confirmed + temp.confirmed;
            temp.deaths = cs.deaths + temp.deaths;
            temp.recovered = cs.recovered + temp.recovered;
            raw[cs.country] = temp;
          } else{
            raw[cs.country] = cs;
          }
          // data.push()
        });  
        delete raw['undefined']; 
        console.log(raw);    
        return <GlobalDataSummary[]>Object.values(raw);
      }),
      catchError((error: HttpErrorResponse) => {
        if(error.status == 404){
          this.date = this.date - 1;
          this.globalDataUrl = `${this.baseUrl}${this.getDate(this.month)}-${this.getDate(this.date)}-${this.year}${this.extension}`;
          return this.getGlobalData()
        }
      })
    );
  }
}
