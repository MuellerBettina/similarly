import { Component, OnInit } from '@angular/core';
import {mergeMap, Observable, of, concatAll, Subject, startWith, zip, Subscription, lastValueFrom} from "rxjs";
import { Question } from "../models/Question";
import { QuestionService } from "../services/question.service";
import { AuthService } from "../services/auth.service";
import { User } from "../models/User";
import { Selection } from "../models/Selection";

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  user_id!: Pick<User, "id"> | undefined
  questions$: Observable<Question[]> | undefined
  unanswered_questions: Question[] | undefined
  question$: Observable<Question> | undefined

  amountOfUnAnsweredQuestions = 0;
  questionIndex = 0;

  constructor(
    private questionService: QuestionService,
    private authService: AuthService
  ) { }

  async ngOnInit(): Promise<void> {
    this.user_id = this.authService.userId
    this.unanswered_questions = await lastValueFrom(this.getUnansweredQuestions(this.user_id));
    this.amountOfUnAnsweredQuestions = this.unanswered_questions.length
    /*this.questions$ = this.getQuestions();*/

  }

  getUnansweredQuestions(user_id: Pick<User, "id"> | undefined): Observable<Question[]> {
    return this.questionService.fetchAllUnansweredQuestions(user_id);
  }

  getQuestions(): Observable<Question[]> {
    return this.questionService.fetchAllQuestions();
  }

  skipQuestion(): void {
    if (this.questionIndex < this.amountOfUnAnsweredQuestions-1){
      this.questionIndex++;
    }
    else {
      alert("There are no more questions to answer for you.")
    }
  }

  saveAnswer(selected_answer: string, question_id: string): void {
    this.questionService.postSelection(this.user_id, selected_answer, question_id)
  }
}
