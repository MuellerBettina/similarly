import { Component, OnInit } from '@angular/core';
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

  constructor(
    private questionService: QuestionService,
    private authService: AuthService
  ) { }

  async ngOnInit(): Promise<void> {
    this.user_id = this.authService.userId;
    this.answered_questions = await lastValueFrom(this.getAnsweredQuestions(this.user_id))
  }

  getAnsweredQuestions(user_id: Pick<User, "id"> | undefined): Observable<Question[]> {
    return this.questionService.fetchAllAnsweredQuestions(user_id);
  }

}
