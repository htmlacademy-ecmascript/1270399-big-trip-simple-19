import { render } from '../render.js';
import FormCreationView from '../view/create-form-view.js';
import EditFormView from '../view/edit-form-view.js';
import PointView from '../view/point-view.js';
import PointListView from '../view/point-list-view.js';
import SortView from '../view/sort-view.js';

export default class TripPresenter {
  pointListComponent = new PointListView();

  constructor({pointListContainer, pointsModel}) {
    this.pointListContainer = pointListContainer;
    this.pointsModel = pointsModel;
  }

  init() {
    this.listPoints = [...this.pointsModel.getPoints()];

    render(new SortView(), this.pointListContainer);
    render(this.pointListComponent, this.pointListContainer);
    render(new EditFormView(this.listPoints[0]), this.pointListComponent.getElement());
    render(new FormCreationView(), this.pointListComponent.getElement());

    for (let i = 0; i < this.listPoints.length; i++) {
      render(new PointView({point: this.listPoints[i]}), this.pointListComponent.getElement());
    }

  }
}
