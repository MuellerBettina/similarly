import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { User } from "../models/User";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent implements OnInit {

  user_id!: Pick<User, "id"> | undefined

  constructor(
    private authService: AuthService,
    public dialogRef: MatDialogRef<CameraComponent>
  ) {}

  videoPlayer: any;
  imagePickerArea: any;
  captureButton: any;
  canvas: any;
  context: any;
  imageURI: any;
  file: any;

  ngOnInit(): void {
    this.user_id = this.authService.userId;
    this.videoPlayer = document.querySelector('#player');
    this.imagePickerArea = document.querySelector('#pick-image');
    this.captureButton = document.querySelector('#capture-btn');
    this.canvas = document.querySelector('#canvas');
    this.initMedia();
  }

  initMedia(): void {
    navigator.mediaDevices.getUserMedia(
      {
        video: {width:320, height:240},
        audio:false
      }
    )
      .then( stream => {
        this.videoPlayer.srcObject = stream;
        this.videoPlayer.style.display = 'block';
      })
      .catch( err => {
        this.imagePickerArea.style.display = 'block';
      });

  }

  capturePicture(): void {
    this.context = this.canvas.getContext('2d');
    this.context.drawImage(this.videoPlayer, 0, 0, 320, 240);
    this.imageURI = this.canvas.toDataURL('image/jpg');

    fetch(this.imageURI).then(res => {
      return res.blob()
    }).then(blob => {
      this.file = new File([blob], "profile_picture.jpg", { type: "image/jpg" })
    })
  }

  submitProfilePicture(): void {
    this.authService.addProfilePicture(this.user_id, this.file).subscribe(data => console.log(data))
    this.dialogRef.close('Profile picture saved!');
  }
}
