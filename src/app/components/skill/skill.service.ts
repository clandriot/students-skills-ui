import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { Skill } from './skill';

import { environment } from '../../../environments/environment';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class SkillService {
  private rootUrl = environment.apiUrl || 'http://localhost/api/v1/';
  private skillUrl = this.rootUrl + 'skills';
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {}

  getSkills(): Promise<Skill[]> {
    const url = this.skillUrl + '?sort=shortName&order=asc&pagination=false';
    return this.http.get(url)
                .toPromise()
                .then(response => response.json() as Skill[])
                .catch(this.handleError);
  }

  getSkill(id: String): Promise<Skill> {
    const url = `${this.skillUrl}/${id}`;
    return this.http.get(url)
                  .toPromise()
                  .then(response => response.json() as Skill)
                  .catch(this.handleError);
  }

  deleteSkill(skill: Skill): Promise<void> {
    const url = `${this.skillUrl}/${skill.id}`;
    return this.http.delete(url, {headers: this.headers})
                  .toPromise()
                  .then(() => null)
                  .catch(this.handleError);
  }

  updateSkill(skill: Skill): Promise<Skill> {
    const url = `${this.skillUrl}/${skill.id}`;
    const updatedSkill = Object.assign({}, skill);
    delete updatedSkill.id;
    delete updatedSkill.meta;
    return this.http.patch(url, JSON.stringify(updatedSkill), {headers: this.headers})
                  .toPromise()
                  .then(() => skill)
                  .catch(this.handleError);
  }

  createSkill(shortName: String, longName: String, description: String): Promise<Skill> {
    const body = {shortName: shortName, longName: longName, description: description};
    return this.http.post(this.skillUrl, JSON.stringify(body), {headers: this.headers})
                  .toPromise()
                  .then(res => res.json() as Skill)
                  .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }
}
