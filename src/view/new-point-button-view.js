export default class NewPointButtonView {
  #element = null;
  #handleNewTaskButtonClick = null;

  constructor({onClick}) {
    this.#handleNewTaskButtonClick = onClick;
    this.#element = document.querySelector('.trip-main__event-add-btn');
    this.#element.addEventListener('click',this.#clickHandler);
  }

  get element() {
    return this.#element;
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleNewTaskButtonClick();
  };
}
