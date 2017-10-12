import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Class } from './class';

import { environment } from '../../../environments/environment';

import 'rxjs/add/operator/toPromise';
import * as _ from 'lodash';

@Injectable()
export class ClassService {
  private rootUrl = environment.apiUrl || 'http://localhost/api/v1/';
  private classUrl = this.rootUrl + 'classs';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {}

  async getClasses(): Promise<Class[]> {
    const url = this.classUrl + '?sort=name&order=asc&pagination=false';
    try {
      const response = await this.http.get(url).toPromise();
      return response.json() as Class[];
    } catch (error) {
      await this.handleError(error);
    }
  }

  async getClass(id: String): Promise<Class> {
    const url = `${this.classUrl}/${id}`;
    try {
      const response = await this.http.get(url).toPromise();
      return response.json() as Class;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async deleteClass(classToDelete: Class): Promise<void> {
    const url = `${this.classUrl}/${classToDelete.id}`;
    try {
      await this.http.delete(url, {headers: this.headers});
      return null;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async updateClass(newClass: Class): Promise<Class> {
    const url = `${this.classUrl}/${newClass.id}`;
    const updatedClass = _.cloneDeep(newClass);

    try {
      const response = await this.http.patch(url, JSON.stringify(_.pick(updatedClass, ['name', 'defaultSkills'])), {headers: this.headers})
                                  .toPromise();
      return response.json() as Class;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async createClass(name: String): Promise<Class> {
    try {
      const response = await this.http.post(this.classUrl, JSON.stringify({name: name}), {headers: this.headers})
                                .toPromise();
      return response.json() as Class;
    } catch (error) {
      await this.handleError(error);
    }
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }
}
