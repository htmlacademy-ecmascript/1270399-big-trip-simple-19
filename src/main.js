import {render} from './framework/render.js';
import TripListPresenter from './presenter/trip-list-presenter.js';
import PointsModel from './model/points-model.js';
import NewPointButtonView from './view/new-point-button-view.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilterModel from './model/filter-model.js';

const siteHeaderElement = document.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.trip-events');
const tripMainElement = document.querySelector('.trip-main');

const pointsModel = new PointsModel();
const filterModel = new FilterModel();

const tripListPresenter = new TripListPresenter({
  pointListContainer: siteMainElement,
  pointsModel,
  filterModel,
  onCreateFormDestroy: handleCreatePointFormClose,
});

const filterPresenter = new FilterPresenter({
  filterContainer: siteHeaderElement,
  filterModel,
  pointsModel: pointsModel
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

render(createPointButtonComponent, tripMainElement);

filterPresenter.init();
tripListPresenter.init();
