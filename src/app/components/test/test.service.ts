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

  async getTest(testId: String): Promise<Test> {
    const url = this.testUrl + '/' + testId;

    try {
      const response = await this.http.get(url).toPromise();
      return response.json() as Test;
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

  async createTest(test: Test): Promise<Test> {
    try {
      const response = await this.http.post(this.testUrl, JSON.stringify(test), {headers: this.headers}).toPromise();
      return response.json() as Test;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async updateTest(test: Test): Promise<Test> {
    const url = this.testUrl + '/' + test.id;
    const updatedTest = _.cloneDeep(test);

    delete updatedTest.id;
    delete updatedTest.meta;

    try {
      const response = await this.http.patch(url, JSON.stringify(updatedTest), {headers: this.headers}).toPromise();
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
