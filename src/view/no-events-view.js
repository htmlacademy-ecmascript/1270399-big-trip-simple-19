import {createElement} from '../render.js';

function createNoPointTemplate() {
  return (
    `<p class="trip-events__msg">
        Click New Event to create your first point
    </p>`
  );
}
export default class NoPointView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createNoPointTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}