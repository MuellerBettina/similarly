import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Marker } from "leaflet";

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.css']
})
export class GeolocationComponent implements OnInit {

  icon = {
    icon: L.icon({
      iconSize: [ 25, 41 ],
      iconAnchor: [ 13, 0 ],
      iconUrl: './assets/icons/marker-icon.png',
      shadowUrl: './assets/icons/marker-shadow.png'
    })
  };

  map: L.Map | undefined;
  private centroid: L.LatLngExpression = [52.51627, 13.37765]; //Brandenburger Tor
  user_position: Marker<any> | undefined;

  constructor() { }

  ngOnInit(): void {
    this.initMap();
  }

  showLocation() {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        this.showUserLocationOnMap({position: position});
      });
    } else {
      console.log("geolocation is not supported");
    }
  }

  showUserLocationOnMap({position}: { position: any }){
    this.user_position = L.marker([position.coords.latitude, position.coords.longitude], this.icon);
    this.refreshMap();
  }

  initMap(): void {
    this.map = L.map('map', {
      center: this.centroid,
      zoom: 10
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 2,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);

    //this.map.locate({setView: true, maxZoom: 18});

    const user_position = this.user_position;
    console.log('user position', this.user_position);
    user_position?.addTo(this.map);


    if(this.user_position){
      const user_position = this.user_position;
      user_position.addTo(this.map);
    }
  }

  refreshMap(): void {
    this.map?.off();
    this.map?.remove();
    this.initMap();
  }
}
