import { render } from './render.js';
import FilterView from './view/filter-view.js';
import TripPresenter from './presenter/trip-presenter.js';

const siteHeaderElement = document.querySelector('.trip-controls__filters');
const siteMainElement = document.querySelector('.trip-events');
const tripPresenter = new TripPresenter({pointListContainer: siteMainElement});

render(new FilterView(), siteHeaderElement);

tripPresenter.init();
