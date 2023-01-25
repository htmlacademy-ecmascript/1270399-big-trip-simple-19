import {render} from './framework/render.js';
import FilterView from './view/filter-view.js';
import TripListPresenter from './presenter/trip-list-presenter.js';
import PointsModel from './model/points-model.js';
import {generateFilter} from './mock/filter-mock.js';

const siteHeaderElement = document.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const tripPresenter = new TripListPresenter({pointListContainer: siteMainElement, pointsModel});
const filters = generateFilter(pointsModel.points);

render(new FilterView({filters}), siteHeaderElement);

tripPresenter.init();
