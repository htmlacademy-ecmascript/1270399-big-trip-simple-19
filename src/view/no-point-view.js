import AbstractView from '../framework/view/abstract-view.js';
import {FilterType} from '../const.js';

const NoPointsTextType = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.FUTURE]: 'There are no future points now'
};

function createNoPointTemplate(filterType) {
  const noPointsTextType = NoPointsTextType[filterType];

  return `<p class="trip-events__msg">${noPointsTextType}</p>`;
}

export default class noPointView extends AbstractView {
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createNoPointTemplate(this.#filterType);
  }
}
