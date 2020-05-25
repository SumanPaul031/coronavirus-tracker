import { Component, OnInit, Input } from '@angular/core';
import { CountUpOptions } from 'countup.js';

@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.css']
})
export class DashboardCardComponent implements OnInit {

  @Input('totalConfirmed') totalConfirmed;
  @Input('totalActive') totalActive;
  @Input('totalDeaths') totalDeaths;
  @Input('totalRecovered') totalRecovered;

  opts: CountUpOptions;

  constructor() { }

  ngOnInit(): void {
    this.opts = {
      decimalPlaces: 2,
      separator: ':',
      duration: 5
    };
  }

}
