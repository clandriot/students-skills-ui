import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Student } from './student';

import { environment } from '../../../environments/environment';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class StudentService {
  private rootUrl = environment.apiUrl || 'http://localhost/api/v1/';
  private studentUrl = this.rootUrl + 'students';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {}

  getStudents(classId: String): Promise<Student[]> {
    const filterUrl = this.studentUrl + '?classID=' + classId;
    return this.http.get(filterUrl)
                .toPromise()
                .then(response => response.json() as Student[])
                .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }
}
