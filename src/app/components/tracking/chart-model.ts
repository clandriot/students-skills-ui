import * as _ from 'lodash';

import { Skill } from '../skill/skill';

export class ChartSerie {
  data: number[];
  label: String;

  constructor(serieName: String, value?: number) {
    this.data = [];
    if (!_.isUndefined(value)) {
      this.data.push(value);
    }
    this.label = serieName;
  }
}

export class ChartData {
  private _series: ChartSerie[];

  constructor() {
    this._series = [];
  }

  get series(): ChartSerie[] {
    return this._series;
  }

  initSeries(skills: Skill[]) {
    _.forEach(skills, skill => this.series.push(new ChartSerie(skill.longName)));
  }

  addPoint(value: number, serieName: String) {
    const chartSerie = _.find(this._series, serie => serie.label === serieName);

    if (_.isUndefined(chartSerie)) {
      this._series.push(new ChartSerie(serieName, value));
    } else {
      chartSerie.data.push(value);
    }
  }
}
