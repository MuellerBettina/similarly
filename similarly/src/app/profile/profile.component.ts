import {Component, Inject, OnInit} from '@angular/core';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CameraComponent } from "../camera/camera.component"
import {User} from "../models/User";
import {QuestionService} from "../services/question.service";
import {AuthService} from "../services/auth.service";
import {lastValueFrom, Observable} from "rxjs";
import {Question} from "../models/Question";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user_id!: Pick<User, "id"> | undefined
  answered_questions: Question[] | undefined
  user$: Observable<User> | undefined

  constructor(
    // @Inject(MAT_DIALOG_DATA)
    private dialogRef: MatDialog,
    private questionService: QuestionService,
    private authService: AuthService
  ) { }

  async ngOnInit(): Promise<void> {
    this.user_id = this.authService.userId;
    this.user$ = this.authService.getUser(this.user_id)
    this.answered_questions = await lastValueFrom(this.getAnsweredQuestions(this.user_id))
  }

  openModal(): void {
    this.dialogRef.open(CameraComponent);
  }

  loadProfilePicture(): void {

  }

  getAnsweredQuestions(user_id: Pick<User, "id"> | undefined): Observable<Question[]> {
    return this.questionService.fetchAllAnsweredQuestions(user_id);
  }
}
