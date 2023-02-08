import {render, replace, remove} from '../framework/render.js';
import EditFormView from '../view/edit-form-view.js';
import PointView from '../view/point-view.js';
import {UserAction, UpdateType} from '../const.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #pointContainer = null;

  #pointComponent = null;
  #pointEditComponent = null;

  #handleDataChange = null;
  #handleModeChange = null;

  #point = null;
  #pointCommon = null;

  #mode = Mode.DEFAULT;

  constructor({pointContainer, onDataChange, onModeChange, pointCommon}) {
    this.#pointContainer = pointContainer;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
    this.#pointCommon = pointCommon;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      pointCommon: this.#pointCommon,
      onRollupClick: this.#handleEditClick
    });

    this.#pointEditComponent = new EditFormView({
      point: this.#point,
      pointCommon: this.#pointCommon,
      onFormSubmit: this.#handleFormSubmit,
      onFormClose: this.#handleCloseClick,
      onDeleteClick: this.#handleDeleteClick
    });

    if (prevPointComponent === null || prevPointEditComponent === null) {
      render(this.#pointComponent, this.#pointContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
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
  };

  #handleCloseClick = () => {
    this.#pointEditComponent.reset(this.#point);
    this.#replaceEditToPoint();
  };

  #handleFormSubmit = (update) => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      update
    );
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  };

  setSaving() {
    if (this.#mode === Mode.EDITING)
    {this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });}
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }
}
