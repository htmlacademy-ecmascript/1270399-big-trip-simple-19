import {render, RenderPosition, remove} from '../framework/render.js';
import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';
import NoPointView from '../view/no-points-view.js';
import PointPresenter from './point-presenter.js';
import CreateFormPresenter from './create-form-presenter.js';
import {sortDate, sortPrice, filter} from '../utils/utils.js';
import {SortType, FilterType, UpdateType, UserAction} from '../const.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import ErrorLoadingView from '../view/error-loading-view.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class TripListPresenter {
  #pointsListContainer = null;
  #sortContainer = null;

  #pointsModel = null;
  #filterModel = null;
  #pointCommonModel = null;

  #pointCommon = null;

  #sortComponent = null;
  #noPointComponent = null;
  #pointListComponent = new PointListView();
  #loadingComponent = new LoadingView();

  #createFormPresenter = null;
  #pointPresenter = new Map();

  #onCreateFormDestroy = null;
  #isPointLoading = true;
  #isPointCommonLoading = true;
  #isErrorLoading = false;

  #errorLoadingView = new ErrorLoadingView();

  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERYTHING;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({pointsListContainer, sortContainer, pointsModel, filterModel, pointCommonModel, onCreateFormDestroy}) {
    this.#pointsListContainer = pointsListContainer;
    this.#sortContainer = sortContainer;
    this.#pointsModel = pointsModel;
    this.#filterModel = filterModel;
    this.#pointCommonModel = pointCommonModel;
    this.#onCreateFormDestroy = onCreateFormDestroy;
    this.#pointCommon = this.#pointCommonModel.pointCommon;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#pointCommonModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        filteredPoints.sort(sortDate);
        break;
      case SortType.PRICE:
        filteredPoints.sort(sortPrice);
        break;
    }

    return filteredPoints;
  }

  init() {
    this.#renderPointList();
    this.#renderSort();
    this.#clearPointList();
  }

  createForm() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#createFormPresenter.init();
  }

  #createNewPointPresenter () {
    this.#createFormPresenter = new CreateFormPresenter({
      formContainer: this.#pointListComponent.element,
      pointCommon: this.#pointCommon,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#onCreateFormDestroy,
    });
  }

  #handleModeChange = () => {
    this.#createFormPresenter.destroy();
    this.#pointPresenter.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenter.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#createFormPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch (err) {
          this.#createFormPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenter.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointPresenter.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPointList();
        this.#renderPointList();
        break;
      case UpdateType.MAJOR:
        this.#clearPointList({ resetSortType: true });
        this.#renderPointList();
        break;
      case UpdateType.INIT_POINT:
        this.#isPointLoading = false;
        break;
      case UpdateType.INIT_POINT_COMMON:
        this.#pointCommon = this.#pointCommonModel.pointCommon;
        this.#isPointCommonLoading = false;
        break;
      case UpdateType.ERROR_LOADING:
        this.#isErrorLoading = true;
        remove(this.#loadingComponent);
        this.#clearPointList();
        this.#renderPointList();
        break;
    }
    if ((updateType === UpdateType.INIT_POINT ||
      updateType === UpdateType.INIT_POINT_COMMON) &&
      (!this.#isPointLoading && !this.#isPointCommonLoading)) {
      this.#createNewPointPresenter();
      remove(this.#loadingComponent);
      this.#clearPointList();
      this.#renderPointList();
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
      currentSortType: this.#currentSortType
    });

    render(this.#sortComponent, this.#sortContainer, RenderPosition.AFTERBEGIN);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      pointContainer: this.#pointListComponent.element,
      pointCommon: this.#pointCommon,
      onModeChange: this.#handleModeChange,
      onDataChange: this.#handleViewAction
    });

    pointPresenter.init(point);
    this.#pointPresenter.set(point.id, pointPresenter);
  }

  #renderPoints(points) {
    points.forEach((point) => this.#renderPoint(point));
  }

  #renderNoPoints() {
    this.#noPointComponent = new NoPointView({
      filterType: this.#filterType
    });

    render(this.#noPointComponent, this.#pointListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #clearPointList({resetSortType = false} = {}) {
    if(this.#createFormPresenter){
      this.#createFormPresenter.destroy();
    }
    this.#pointPresenter.forEach((presenter) => presenter.destroy());
    this.#pointPresenter.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);


    if (this.#noPointComponent) {
      remove(this.#noPointComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#pointsListContainer);
  }

  #renderErrorLoading() {
    render(this.#errorLoadingView, this.#pointsListContainer);
  }

  #renderPointList() {
    if (this.#isErrorLoading) {
      this.#renderErrorLoading();
    }
    if ((this.#isPointLoading || this.#isPointCommonLoading) && !this.#isErrorLoading) {
      this.#renderLoading();
    }
    const points = this.points;
    const pointsCount = this.points.length;
    if (pointsCount === 0 && !this.#isPointLoading) {
      this.#renderNoPoints();
    }
    this.#renderSort();
    render(this.#pointListComponent, this.#pointsListContainer);
    this.#renderPoints(points);
  }
}
