import {render, RenderPosition, remove} from '../framework/render.js';
import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import NoPointView from '../view/no-points-view.js';
import PointPresenter from './point-presenter.js';
import CreateFormPresenter from './create-form-presenter.js';
import {sortDate, sortPrice, filter} from '../utils/utils.js';
import {SortType, FilterType, UpdateType, UserAction} from '../const.js';


export default class TripListPresenter {
  #pointListContainer = null;
  #pointsModel = null;
  #filterModel = null;
  #sortComponent = null;
  #noPointComponent = null;
  #createFormPresenter = null;
  #onCreateFormDestroy = null;

  #pointListComponent = new PointListView();
  #pointPresenter = new Map();

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;

  constructor({pointListContainer, pointsModel, filterModel, onCreateFormDestroy}) {
    this.#pointListContainer = pointListContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#onCreateFormDestroy = onCreateFormDestroy;

    this.#createFormPresenter = new CreateFormPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#onCreateFormDestroy,
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortDate);
      case SortType.PRICE:
        return filteredPoints.sort(sortPrice);
    }

    return filteredPoints;
  }

  init() {
    this.#renderPointList();
    this.#renderSort();
  }

  createForm() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#createFormPresenter.init();
  }

  #handleModeChange = () => {
    this.#createFormPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelEvent = (updateType, data) => {
    //console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда задача ушла в архив)
    // - обновить всю доску (например, при переключении фильтра)
    switch (updateType) {
      case UpdateType.PATCH:
        // - обновить часть списка (например, когда поменялось описание)
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        // - обновить список (например, когда задача ушла в архив)
        this.#clearPointList();
        this.#renderPointList();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        this.#clearPointList({resetSortType: true, /**/});
        this.#renderPointList();
        break;
    }
  };

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderPointList();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortTypeChange,
      currentSortType: this.#currentSortType //
    });

    render(this.#sortComponent, this.#pointListComponent.element, RenderPosition.BEFOREBEGIN);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handleModeChange,
      onModeChange: this.#handleViewAction
    });

    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPoints() {
    this.points.forEach((point) => this.#renderPoint(point));
  }

  #renderNoPoints() {
    this.#noPointComponent = new NoPointView({
      filterType: this.#filterType
    });

    render(this.#noPointComponent, this.#pointListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #clearPointList({resetSortType = false} = {}) {
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();
    this.#createFormPresenter.destroy();

    remove(this.#sortComponent);

    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderPointList() {
    const points = this.points;
    if (points.length === 0) {
      this.#renderNoPoints();
    }
    this.#renderSort();
    render(this.#pointListComponent, this.#pointListContainer);
    this.#renderPoints(points);

  }

}
