import { Component, OnInit } from '@angular/core';
import { MapMarkerModel } from './Models/mapMarker.model';
import { StaticDataModel } from './Models/staticData.model';
import { DynamicDataModel } from './Models/dynamicData.model';
import { NycBikeService } from './Services/nycBikeService.service';
import { LineChartModel } from './Models/lineChartData.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public range:number;
  public markers:Array<MapMarkerModel> = [];
  public dynamicData:Array<LineChartModel> = [];
  public staticData:Array<StaticDataModel> = [];
  public stationNames:Array<any> = [];
  keyword = 'stationName';
  public searchedKey:string;

 constructor(private bikeService:NycBikeService ){
 }


 ngOnInit() {
   this.range=20;
   this.bikeService.GetStaticData().subscribe((staticData: Array<StaticDataModel>)=>{

    this.getDynamicDataForBikes(staticData);
   });

   setInterval(() => {
     this.getDynamicDataForBikes()
   }, 60000);

 }
 
  onChangeSearch(val: string) {
    this.searchedKey=val;
  }
  selectEvent(item) {
    this.searchedKey=item.stationName;
  }

  getDynamicDataForBikes(staticDataForBikes: Array<StaticDataModel> = null){
    this.bikeService.GetDynamicData().subscribe((dynamicData:Array<DynamicDataModel>)=>{
      this.markers=[];
      dynamicData.forEach(element=>{
        if(!staticDataForBikes){
          staticDataForBikes = this.staticData;
        }
        let station = staticDataForBikes.find(x=>x.stationId==element.stationId);
        if(station!=undefined)
        {
          station.dynamicData=element;

          let marker= new MapMarkerModel();
          marker.title=station.stationName;
          marker.lat=station.latitude;
          marker.lng=station.longitude;
          
          let capacity = Math.round((station.dynamicData.availableBikes / station.capacity) * 100);
          if(capacity == 0){
            marker.icon = "/assets/red-flag.png";
          }
          else if(capacity < 50) {
            marker.icon = "/assets/orange-flag.png";
          }
          else {
            marker.icon = "/assets/green-flag.png";
          }

          this.markers.push(marker);

        }
      });
      let lineChart:LineChartModel= new LineChartModel();
      lineChart.dynamicData=dynamicData;
      lineChart.statisticalTime= new Date();
      this.dynamicData = [...this.dynamicData, lineChart];
      
      this.staticData = staticDataForBikes;
        this.staticData.forEach(station => {
          this.stationNames.push({stationName: station.stationName,stationId:0});
        });
    });
  }







}
