import { render } from './render.js';
import FilterView from './view/filter-view.js';
import TripPresenter from './presenter/trip-presenter.js';
import PointsModel from './model/points-model.js';

const siteHeaderElement = document.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const tripPresenter = new TripPresenter({
  pointListContainer: siteMainElement,
  pointsModel,
});

render(new FilterView(), siteHeaderElement);

tripPresenter.init();
