import {render} from '../framework/render.js';
import FormCreationView from '../view/create-form-view.js';
import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import NoPointView from '../view/no-points-view.js';
import PointPresenter from './point-presenter.js';
import {updateItem} from '../utils.js';


export default class TripListPresenter {
  #pointListContainer = null;
  #pointsModel = null;

  #pointListComponent = new PointListView();
  #pointPresenter = new Map();

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

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#listPoints = updateItem(this.#listPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

}
