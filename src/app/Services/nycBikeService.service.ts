import { Injectable } from '@angular/core';
import { httpService } from './httpService.service';
import { map } from "rxjs/internal/operators";
import { Observable } from 'rxjs';
import { StaticDataModel } from '../Models/staticData.model';
import { DynamicDataModel } from '../Models/dynamicData.model';

@Injectable()
export class NycBikeService{
public staticDataURL:string;
public dynamicDataURL:string;
public staticData: Array<StaticDataModel>;
public dynamicData: Array<DynamicDataModel>;
constructor(private httpService: httpService) {
this.staticDataURL='https://gbfs.citibikenyc.com/gbfs/en/station_information.json';
this.dynamicDataURL='https://gbfs.citibikenyc.com/gbfs/en/station_status.json';
}
GetStaticData(){
    return this.httpService.GetRequest(this.staticDataURL).pipe(map((response:any)=>{
        this.staticData=[];
        for(let i=0;i<response['data'].stations.length;i++){
            let station= new StaticDataModel();
            station.capacity=response['data'].stations[i].capacity;
            station.stationName=response['data'].stations[i].name;
            station.stationId=response['data'].stations[i].station_id;
            station.latitude=response['data'].stations[i].lat;
            station.longitude=response['data'].stations[i].lon;
            station.dynamicData= new DynamicDataModel();
            this.staticData.push(station);
        }
        return this.staticData;

    }));
}
GetDynamicData(){
    return this.httpService.GetRequest(this.dynamicDataURL).pipe(map((response:any)=>{
        this.dynamicData=[];
        for(let i=0; i<response['data'].stations.length;i++){
            let station= new DynamicDataModel();
            station.availableBikes=response['data'].stations[i].num_bikes_available;
            station.bikesDisabled=response['data'].stations[i].num_bikes_disabled;
            station.lastReported=response['data'].stations[i].last_reported;
            station.stationId=response['data'].stations[i].station_id;
            station.stationStatus=response['data'].stations[i].station_status;
            this.dynamicData.push(station);
        }
        return this.dynamicData;

    }));
}

}