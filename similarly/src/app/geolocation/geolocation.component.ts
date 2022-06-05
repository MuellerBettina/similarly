import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.css']
})
export class GeolocationComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  showLocation() {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function (position){
        console.log(position);
      });
    } else {
      console.log("geolocation is not supported");
    }
  }
}
