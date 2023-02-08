import {render} from './framework/render.js';
import TripListPresenter from './presenter/trip-list-presenter.js';
import PointsModel from './model/points-model.js';
import NewPointButtonView from './view/new-point-button-view.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';
import PointsApiService from './points-api-service.js';
import PointCommonApiService from './point-common-api-service.js';
import PointCommonModel from './model/point-common-model.js';

const AUTHORIZATION = 'Basic 234erw3rw3423e2';
const END_POINT = 'https://19.ecmascript.pages.academy/big-trip-simple';

const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});

const pointCommonModel = new PointCommonModel({
  pointCommonApiService: new PointCommonApiService(END_POINT, AUTHORIZATION)
});

const siteHeaderElement = document.querySelector('.trip-controls__filters');
const tripMainElement = document.querySelector('.main__control');
const tripEventsContentElement = document.querySelector('.trip-events__content');
const tripEventsSortElement = document.querySelector('.trip-events__sort');

const filterModel = new FilterModel();

const tripListPresenter = new TripListPresenter({
  pointsListContainer: tripEventsContentElement,
  sortContainer: tripEventsSortElement,
  pointsModel,
  pointCommonModel,
  filterModel,
  onCreateFormDestroy: handleCreatePointFormClose,
});

const filterPresenter = new FilterPresenter({
  filterContainer: siteHeaderElement,
  filterModel,
  pointsModel
});

const createPointButtonComponent = new NewPointButtonView({
  onClick: handleCreatePointButtonClick
});

function handleCreatePointButtonClick() {
  tripListPresenter.createForm();
  createPointButtonComponent.element.disabled = true;
}

function handleCreatePointFormClose() {
  createPointButtonComponent.element.disabled = false;
}

filterPresenter.init();
tripListPresenter.init();

Promise.all([
  pointsModel.init(),
  pointCommonModel.init()])
  .then(() => {
    render(createPointButtonComponent, tripMainElement);
  });
