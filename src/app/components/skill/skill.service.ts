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

  async getSkills(): Promise<Skill[]> {
    const url = this.skillUrl + '?sort=shortName&order=asc&pagination=false';

    try {
      const response = await this.http.get(url).toPromise();
      return response.json() as Skill[];
    } catch (error) {
      await this.handleError(error);
    }
  }

  async getSkill(id: String): Promise<Skill> {
    const url = `${this.skillUrl}/${id}`;

    try {
      const response = await this.http.get(url).toPromise();
      return response.json() as Skill;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async deleteSkill(skill: Skill): Promise<void> {
    const url = `${this.skillUrl}/${skill.id}`;

    try {
      const response = await this.http.delete(url, {headers: this.headers}).toPromise();
      return null;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async updateSkill(skill: Skill): Promise<Skill> {
    const url = `${this.skillUrl}/${skill.id}`;
    const updatedSkill = Object.assign({}, skill);
    delete updatedSkill.id;
    delete updatedSkill.meta;

    try {
      const response = await this.http.patch(url, JSON.stringify(updatedSkill), {headers: this.headers}).toPromise();
      return response.json() as Skill;
    } catch (error) {
      await this.handleError(error);
    }
  }

  async createSkill(shortName: String, longName: String, description: String): Promise<Skill> {
    const body = {shortName: shortName, longName: longName, description: description};

    try {
      const response = await this.http.post(this.skillUrl, JSON.stringify(body), {headers: this.headers}).toPromise();
      return response.json() as Skill;
    } catch (error) {
      await this.handleError(error);
    }
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }
}
