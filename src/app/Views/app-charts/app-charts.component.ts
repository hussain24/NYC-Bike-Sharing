import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import { DynamicDataModel } from 'src/app/Models/dynamicData.model';
import { StaticDataModel } from 'src/app/Models/staticData.model';
import { LineChartModel } from 'src/app/Models/lineChartData.model';

@Component({
  selector: 'app-charts',
  templateUrl: './app-charts.component.html',
  styleUrls: ['./app-charts.component.scss']
})
export class AppChartsComponent implements OnInit {

  @Input() DynamicData:Array<LineChartModel>;
  @Input() StaticData:Array<StaticDataModel>;
  @Input() SearchedKeyword:string;
  
  public lineChartData: ChartDataSets[] = [
    { data: [0], label: '' }
  ];
  public lineChartLabels: Label[] = [''];
  public barChartLabels: Label[] = ['Usage Statistics'];
  public barChartType: ChartType = 'bar';
  public barChartData: ChartDataSets[] = [{data:[0],label:''}];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [{}]
    },
    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'x-axis-0',
          value: 'March',
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: 'LineAnno'
          }
        },
      ],
    },
  };
  public lineChartType: ChartType = 'line';
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
 

  constructor() {
  }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: any){
    if (changes.StaticData &&  changes.StaticData.currentValue.length > 0){
      this.setBarChartData(changes.StaticData.currentValue, this.SearchedKeyword);
    }
    if (changes.DynamicData &&  changes.DynamicData.currentValue.length > 0){
      this.setLineChartData(changes.DynamicData.currentValue, this.SearchedKeyword);
    }
    if(changes.SearchedKeyword)
    {
      this.setBarChartData(this.StaticData, changes.SearchedKeyword.currentValue);
      this.setLineChartData(this.DynamicData, changes.SearchedKeyword.currentValue);
    }

  }

  setLineChartData(dynamicDataForBikes: Array<LineChartModel>, searchKey: string) {
    if(dynamicDataForBikes && dynamicDataForBikes.length){
      let dynamicDataSets:any=[];
      let staticDataDictionary: any = [];

      let labelsForLineChart = [];
      this.StaticData.forEach(data => {
        staticDataDictionary[data.stationId] = data;

        if(!searchKey || data.stationName.toLowerCase().includes(searchKey.toLowerCase())) {
          labelsForLineChart.push(data.stationName);
        }
      });


      for(let i = 0; i < dynamicDataForBikes.length; i++) {
        let dataSet = [];
        dynamicDataForBikes[i].dynamicData.forEach(e => {
          let stationStaticData = staticDataDictionary[e.stationId];
          if(!searchKey || stationStaticData.stationName.toLowerCase().includes(searchKey.toLowerCase())) {
            let usage = stationStaticData.capacity - e.availableBikes;
            dataSet.push(usage);
          }
        });
        dynamicDataSets.push({ data: dataSet, label: dynamicDataForBikes[i].statisticalTime.toTimeString() });
      }

      this.lineChartData = dynamicDataSets;
      this.lineChartLabels = labelsForLineChart;
    }
  }

  setBarChartData(staticDataForBikes: Array<StaticDataModel>, searchKey: string){
    if(staticDataForBikes && staticDataForBikes.length){
      let stat:any=[];
      staticDataForBikes.forEach(e=>{
        if(!searchKey || e.stationName.toLowerCase().includes(searchKey.toLowerCase())) {
          let c = e.capacity-e.dynamicData.availableBikes;
          let d:ChartDataSets={data:[c], label: e.stationName};
          stat.push(d);
        }
        });
        this.barChartData = stat;
    }
  }
}
