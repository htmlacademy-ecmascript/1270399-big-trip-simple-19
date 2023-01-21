import {render, replace} from '../framework/render.js';
import FormCreationView from '../view/create-form-view.js';
import EditFormView from '../view/edit-form-view.js';
import PointView from '../view/point-view.js';
import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import NoPointView from '../view/no-points-view.js';


export default class TripPresenter {
  #pointListContainer = null;
  #pointsModel = null;

  #pointListComponent = new PointListView();

  #listPoints = [];

  constructor({pointListContainer, pointsModel}) {
    this.#pointListContainer = pointListContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#listPoints = [...this.#pointsModel.points];

    render(new SortView(), this.#pointListContainer);

    if (this.#listPoints.length === 0) {
      render(new NoPointView(), this.#pointListContainer);
    } else {
      render(this.#pointListComponent, this.#pointListContainer);
      render(new FormCreationView(), this.#pointListComponent.element);

      for (let i = 0; i < this.#listPoints.length; i++) {
        this.#renderPoint(this.#listPoints[i]);
      }
    }
  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        replaceEditToPoint.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointView({
      point,
      onRollupClick: () => {
        replacePointToEdit.call(this);
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const pointEditComponent = new EditFormView({
      point,
      onFormSubmit: () => {
        replaceEditToPoint.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onFormClose: () => {
        replaceEditToPoint.call(this);
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replacePointToEdit() {
      replace(pointEditComponent, pointComponent);
    }

    function replaceEditToPoint() {
      replace(pointComponent, pointEditComponent);
    }

    render(pointComponent, this.#pointListComponent.element);
  }
}
