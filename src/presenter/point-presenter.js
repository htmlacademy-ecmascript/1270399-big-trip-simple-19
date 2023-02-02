import {render, replace, remove, RenderPosition} from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';
import PointView from '../view/point-view.js';
import CreateFormView from '../view/create-form-view.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointListContainer = null;
  #handleDataChange = null;
  #handleModeChange = null;

  #pointComponent = null;
  #pointEditComponent = null;
  #createPointComponent = null;
  #handleCreationButtonClick = null;

  #point = null;
  #mode = Mode.DEFAULT;

  constructor({pointListContainer, onDataChange, onModeChange, onCreationButtonClick}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#handleCreationButtonClick = onCreationButtonClick;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;
    const prevCreatePointComponent = this.#createPointComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      onRollupClick: this.#handleEditClick
    });

    this.#pointEditComponent = new EditFormView({
      point: this.#point,
      onFormSubmit: this.#handleFormSubmit,
      onFormClose: this.#handleCloseClick
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointListContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
    remove(prevCreatePointComponent);
  }

  initCreatePoint(point) {
    this.#handleCreationButtonClick.addEventListener('click', () => {
      this.#createPointComponent = new CreateFormView({
        point: point,
        onCloseClick: this.#handleCloseNewPoint,
        onFormSubmit: this.#handleNewPointFormSubmit,
      });
      render(this.#createPointComponent, this.#pointListContainer, RenderPosition.AFTERBEGIN);
      document.addEventListener('keydown', this.#escKeyDownHandler);
    });
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point);
      this.#replaceEditToPoint();
    }
  }

  #replacePointToEdit() {
    replace(this.#pointEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceEditToPoint() {
    replace(this.#pointComponent, this.#pointEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#replaceEditToPoint();
    }
  };

  #handleEditClick = () => {
    this.#replacePointToEdit();
    this.#pointEditComponent.reset(this.#point);
  };

  #handleFormSubmit = (point) => {
    this.#handleDataChange(point);
    this.#replaceEditToPoint();
  };

  #handleNewPointFormSubmit = (point) => {
    this.#handleDataChange(point);
    this.#handleCloseNewPoint();
  };

  #handleCloseClick = () =>{
    this.#replaceEditToPoint();
  };

  #handleCloseNewPoint = () => {
    this.#createPointComponent.element.remove();
  };
}
