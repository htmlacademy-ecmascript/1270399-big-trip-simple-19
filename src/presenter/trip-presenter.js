import { render } from '../render.js';
import FormCreationView from '../view/create-form-view.js';
import EditFormView from '../view/edit-form-view.js';
import PointView from '../view/point-view.js';
import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';

const POINTS_AMOUNT = 3;

export default class TripPresenter {
  pointListComponent = new PointListView();

  constructor({pointListContainer}) {
    this.pointListContainer = pointListContainer;
  }

  init() {
    render(new SortView(), this.pointListContainer);
    render(this.pointListComponent, this.pointListContainer);
    render(new EditFormView(), this.pointListComponent.getElement());
    render(new FormCreationView(), this.pointListComponent.getElement());


    for (let i = 0; i < POINTS_AMOUNT; i++) {
      render(new PointView(), this.pointListComponent.getElement());
    }

  }
}
