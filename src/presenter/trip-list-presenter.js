import {render, RenderPosition} from '../framework/render.js';
import FormCreationView from '../view/create-form-view.js';
import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import NoPointView from '../view/no-points-view.js';
import PointPresenter from './point-presenter.js';
import {sortDate, sortPrice, updateItem} from '../utils/utils.js';
import {SortType} from '../const.js';


export default class TripListPresenter {
  #pointListContainer = null;
  #pointsModel = null;
  #sortComponent = null;

  #pointListComponent = new PointListView();
  #pointPresenter = new Map();
  #noPointComponent = new NoPointView();

  #currentSortType = SortType.DAY;

  #listPoints = [];

  constructor({pointListContainer, pointsModel}) {
    this.#pointListContainer = pointListContainer;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.#listPoints = [...this.#pointsModel.points];
    this.#listPoints.sort(sortDate);
    this.#renderFormCreationView();
    this.#renderPointList();
    this.#renderSort();
  }

  #handleModeChange = () => {
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#listPoints = updateItem(this.#listPoints, updatedPoint);
    this.#pointPresenter.get(updatedPoint.id).init(updatedPoint);
  };

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this.#listPoints.sort(sortDate);
        break;
      case SortType.PRICE:
        this.#listPoints.sort(sortPrice);
        break;
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearPointList();
    this.#renderPointList();
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

  #clearPointList() {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange
    });
    if (this.#listPoints.every((point) => point === null)) {
      return;
    }
    render(this.#sortComponent, this.#pointListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderNoPoints() {
    render(this.#noPointComponent, this.#pointListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #renderFormCreationView() {
    if (this.#listPoints.length === 0) {
      this.#renderNoPoints();
      return;
    }

    render(new FormCreationView(), this.#pointListComponent.element);
  }

  #renderPointList() {
    render(this.#pointListComponent, this.#pointListContainer);

    if (this.#listPoints.length === 0) {
      this.#renderNoPoints();
      return;
    }

    for (let i = 0; i < this.#listPoints.length; i++) {
      this.#renderPoint(this.#listPoints[i]);
    }
  }

}
