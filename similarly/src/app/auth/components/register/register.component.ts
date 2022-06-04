import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(r: NgForm){
    this.authService.signup(r.value).subscribe((msg) => {
      console.log(msg);
      this.router.navigate(['login'])
    });
    console.log(r.value);
    console.log(r.valid);
  }
}
