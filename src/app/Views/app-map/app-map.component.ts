import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { MapMarkerModel } from 'src/app/Models/mapMarker.model';

@Component({
  selector: 'app-map',
  templateUrl: './app-map.component.html',
  styleUrls: ['./app-map.component.scss']
})
export class AppMapComponent implements OnInit, OnChanges {
  public currentPosition: any = {lat:0 , lng: 0}
  public lat:number;
  public lng:number;
  @Input() Range = 20;
  //public lstDynamicData:Array<DynamicDataModel>=[];
  @Input() Markers:Array<MapMarkerModel> = [];
  public filteredMarkers:Array<MapMarkerModel> = [];

  constructor() { }

  ngOnInit() {
    this.GetAndSetCurrentLocation();
  }

  ngOnChanges(changes: any){
    if (changes.Range || (changes.Markers && changes.Markers.currentValue &&  changes.Markers.currentValue.length > 0)){
      this.FilterMarkers();
      if(this.filteredMarkers.length==0){
        setTimeout(() => {
          this.GetAndSetCurrentLocation()
        },3000);
      }
    }
  }

  private GetAndSetCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: Position) => {
        if (position) {
          this.lat=position.coords.latitude;
          this.lng=position.coords.longitude;
          this.currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
        }
      });
    }
  }

  private FilterMarkers() {
    this.filteredMarkers = [];

    this.Markers.forEach(marker => {
      const markerLatLng = new google.maps.LatLng(marker.lat, marker.lng);
      const currentLocationLatLng = new google.maps.LatLng(this.currentPosition.lat, this.currentPosition.lng);
      const distanceInKm = google.maps.geometry.spherical.computeDistanceBetween(markerLatLng, currentLocationLatLng) / 1000;
      
      if(distanceInKm <= this.Range) {
        this.filteredMarkers.push(marker);
      }
    });
  }
}
