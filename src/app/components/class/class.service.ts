import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Class } from './class';

import { environment } from '../../../environments/environment';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class ClassService {
  private rootUrl = environment.apiUrl || 'http://localhost/api/v1/';
  private classUrl = this.rootUrl + 'classs';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {}

  getClasses(): Promise<Class[]> {
    return this.http.get(this.classUrl)
                .toPromise()
                .then(response => response.json() as Class[])
                .catch(this.handleError);
  }

  getClass(id: String): Promise<Class> {
    const url = `${this.classUrl}/${id}`;
    return this.http.get(url)
                  .toPromise()
                  .then(response => response.json() as Class)
                  .catch(this.handleError);
  }

  deleteClass(classToDelete: Class): Promise<void> {
    const url = `${this.classUrl}/${classToDelete.id}`;
    return this.http.delete(url, {headers: this.headers})
                  .toPromise()
                  .then(() => null)
                  .catch(this.handleError);
  }

  updateClass(newClass: Class): Promise<Class> {
    const url = `${this.classUrl}/${newClass.id}`;
    const updatedClass = Object.assign({}, newClass);
    delete updatedClass.id;
    delete updatedClass.meta;
    return this.http.patch(url, JSON.stringify(updatedClass), {headers: this.headers})
                  .toPromise()
                  .then(() => newClass)
                  .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }
}
