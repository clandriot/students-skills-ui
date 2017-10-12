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

  async getStudents(classId: String): Promise<Student[]> {
    const filterUrl = this.studentUrl + '?classID=' + classId + '&sort=lastName&order=asc&pagination=false';

    try {
      const response = await this.http.get(filterUrl).toPromise();
      return response.json() as Student[];
    } catch (error) {
      await this.handleError(error);
    }
  }

  async getStudent(id: String): Promise<Student> {
    const url = `${this.studentUrl}/${id}`;
    try {
      const response = await this.http.get(url).toPromise();
      return response.json() as Student;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async deleteStudent(student: Student): Promise<void> {
    const url = `${this.studentUrl}/${student.id}`;

    try {
      const response = await this.http.delete(url, {headers: this.headers}).toPromise();
      return null;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async updateStudent(student: Student): Promise<Student> {
    const url = `${this.studentUrl}/${student.id}`;
    const updatedStudent = Object.assign({}, student);
    delete updatedStudent.id;
    delete updatedStudent.meta;

    try {
      const response = await this.http.patch(url, JSON.stringify(updatedStudent), {headers: this.headers}).toPromise();
      return response.json() as Student;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async createStudent(classId: String, firstName: String, lastName: String): Promise<Student> {
    const body = {classID: classId, firstName: firstName, lastName: lastName};

    try {
      const response = await this.http.post(this.studentUrl, JSON.stringify(body), {headers: this.headers}).toPromise();
      return response.json() as Student;
    } catch (error) {
      await this.handleError(error);
    }
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }
}
