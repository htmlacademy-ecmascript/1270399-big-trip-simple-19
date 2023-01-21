import {getRandomPoint} from '../mock/points-mock.js';

const POINT_COUNT = 7;

export default class PointsModel {
  #points = Array.from({length: POINT_COUNT}, getRandomPoint);

  get points() {
    return this.#points;
  }
}
