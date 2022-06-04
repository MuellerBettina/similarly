import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, first } from 'rxjs/operators';
import {Observable, Subscription} from 'rxjs';

import { Question } from '../models/Question';
import { User } from '../models/User';

import { ErrorHandlerService} from './error-handler.service';

@Injectable({
  providedIn: 'root'
})

export class QuestionService {
  private questionsUrl = 'http://localhost:3000/questions';
  private selectionsUrl = 'http://localhost:3000/selections';

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'} ),
  };

  constructor(private http: HttpClient, private errorHandlerService: ErrorHandlerService) { }

  fetchAllQuestions(): Observable<Question[]>{
    return this.http
      .get<Question[]>(this.questionsUrl, { responseType: 'json' })
      .pipe(
        catchError(this.errorHandlerService.handleError<Question[]>('fetchAllQuestions', []))
      );
  }

  //methode die user_id übergeben bekommt und Question-Observable-Array zurückgibt
  fetchAllUnansweredQuestions(user_id: Pick<User, "id"> | undefined): Observable<Question[]>{
    return this.http
      .get<Question[]>(`${this.questionsUrl}/unanswered/${user_id}`, { responseType: 'json'})
      .pipe(
        catchError(this.errorHandlerService.handleError<Question[]>('fetchAllUnansweredQuestions', []))
      );
  }

  postSelection(user_id: Pick<User, "id"> | undefined, selected_answer: string, question_id: string): Subscription{
    console.log('this is the user id',user_id, 'this is the selected answer:', selected_answer,'this is the question_id', question_id)
    return this.http
      .post(
        this.selectionsUrl,
        {
          user_id: user_id,
          question_id: question_id,
          selected_answer: selected_answer
        },
        this.httpOptions
      ).subscribe();
  }
}
