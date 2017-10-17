import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Test } from './test';
import { SkillScore } from './test';

import { environment } from '../../../environments/environment';

import 'rxjs/add/operator/toPromise';
import * as _ from 'lodash';

@Injectable()
export class TestService {
  private rootUrl = environment.apiUrl || 'http://localhost/api/v1/';
  private testUrl = this.rootUrl + 'tests';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {}

  async getTests(classID: String): Promise<Test[]> {
    const url = this.testUrl + '?classID=' + classID + '&sort=date&order=asc&pagination=false';

    try {
      const response = await this.http.get(url).toPromise();
      return response.json() as Test[];
    } catch (error) {
      await this.handleError(error);
    }
  }

  async deleteTest(test: Test): Promise<void> {
    const url = this.testUrl + '/' + test.id;
    try {
      const response = await this.http.delete(url, {headers: this.headers}).toPromise();
      return null;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async createTest(classId: String, name: String, date: Date, description: String, skillScores: SkillScore[]): Promise<Test> {
    const body = {classID: classId, name: name, date: date, description: description, skills: skillScores};
    try {
      const response = await this.http.post(this.testUrl, JSON.stringify(body), {headers: this.headers}).toPromise();
      return response.json() as Test;
    } catch (error) {
      await this.handleError(error);
    }
  }

  private handleError(error: any): Promise <any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }
}
