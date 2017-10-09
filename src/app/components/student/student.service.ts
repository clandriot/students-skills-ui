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

  getStudent(id: String): Promise<Student> {
    const url = `${this.studentUrl}/${id}`;
    return this.http.get(url)
                  .toPromise()
                  .then(response => response.json() as Student)
                  .catch(this.handleError);
  }

  deleteStudent(student: Student): Promise<void> {
    const url = `${this.studentUrl}/${student.id}`;
    return this.http.delete(url, {headers: this.headers})
                  .toPromise()
                  .then(() => null)
                  .catch(this.handleError);
  }

  updateStudent(student: Student): Promise<Student> {
    const url = `${this.studentUrl}/${student.id}`;
    const updatedStudent = Object.assign({}, student);
    delete updatedStudent.id;
    delete updatedStudent.meta;
    return this.http.patch(url, JSON.stringify(updatedStudent), {headers: this.headers})
                  .toPromise()
                  .then(() => student)
                  .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }
}
