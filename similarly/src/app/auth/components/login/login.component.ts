import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit(l: NgForm) {
    this.authService.login(l.value.email, l.value.password).subscribe(
      res => console.log(res),
      err => console.log(err)
    );
  }
}
