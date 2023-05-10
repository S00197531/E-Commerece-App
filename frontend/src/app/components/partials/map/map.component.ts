import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LatLngTuple, Map, tileLayer, map} from 'leaflet';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit{

  private readonly DEFAULT_LATLNG: LatLngTuple= [13.75, 21.62]

  @ViewChild('map', {static:true})
  mapRef!: ElementRef

  map!:Map;
  constructor(private locationService: LocationService){}

  ngOnInit(): void {
    this.initializeMap();
    
  }

  initializeMap(){
    if(this.map) return;

    this.map = map(this.mapRef.nativeElement, {
      attributionControl: false
        }).setView(this.DEFAULT_LATLNG, 1);

    tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(this.map);
  }

  findMyLocation(){
    this.locationService.getCurrentLocation().subscribe({
      next: (latlng) => {
        console.log(latlng)
      }
    })
  }
}
