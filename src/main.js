import TripPresenter from './presenter/trip-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import PointsModel from './model/points-model.js';
import FilterModel from './model/filter-model.js';
import NewPointButtonView from './view/new-point-button-view.js';
import PointsApiService from './points-api-service.js';

const AUTHORIZATION = 'Basic hS2f253253fvzxcvzxcv52j';
const END_POINT = 'https://19.ecmascript.pages.academy/big-trip-simple';

const siteMainElement = document.querySelector('.trip-events');
const siteHeaderElement = document.querySelector('.trip-controls__filters');
const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});
const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({filterContainer: siteHeaderElement,
  filterModel,
  pointsModel
});

const tripPresenter = new TripPresenter({tripContainer: siteMainElement,
  filterModel,
  pointsModel,
  onNewPointDestroy: handleNewPointFormClose,
});

const newPointButtonElement = new NewPointButtonView({
  onClick: handleNewPointButtonClick,
});

function handleNewPointFormClose() {
  newPointButtonElement.element.disabled = false;
}

function handleNewPointButtonClick() {
  tripPresenter.createPoint();
  newPointButtonElement.element.disabled = true;
}

filterPresenter.init();
tripPresenter.init();
pointsModel.init();
