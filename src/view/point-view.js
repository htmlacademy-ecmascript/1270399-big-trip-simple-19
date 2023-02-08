import AbstractView from '../framework/view/abstract-view.js';
import {humanizePointDueTime, humanizePointDueDate} from '../utils/utils.js';
import he from 'he';

function createPointViewTemplate(pointView, pointCommon) {
  const {basePrice, dateFrom, dateTo, destination, offers, type} = pointView;

  const pointDestination = pointCommon.allDestinations.find((item) => destination === item.id);

  const tripDateFrom = humanizePointDueDate(dateFrom);
  const tripTimeFrom = humanizePointDueTime(dateFrom);
  const tripTimeTo = humanizePointDueTime(dateTo);

  const offersTemplate = () => {
    let template = `<li class="event__offer">
    <span class="event__offer-title">
    No additional offers</span>
  </li>`;
    if (offers.length) {
      template = offers.map((item) => {
        const offerTypes = pointCommon.allOffers.find((offerType) => offerType.type === type);
        const selectedOffer = offerTypes.offers.find((offer) => offer.id === item);

        return (`
          <li class="event__offer">
            <span class="event__offer-title">${he.encode(selectedOffer.title)}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${he.encode(selectedOffer.price)}</span>
          </li>`
        );}).join('');
    }

    return template;

  };

  return (`<ul class="trip-events__list">
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${he.encode(dateFrom)}">${he.encode(tripDateFrom)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${he.encode(type)}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${he.encode(type)} ${he.encode(pointDestination ? pointDestination.name : '')}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${he.encode(dateFrom)}">${he.encode(tripTimeFrom)}</time>
            &mdash;
            <time class="event__end-time" datetime="${he.encode(dateTo)}">${he.encode(tripTimeTo)}</time>
          </p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${he.encode(basePrice)}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersTemplate()}
        </ul>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
    </ul>`
  );
}

export default class PointView extends AbstractView {
  #handleEditClick = null;
  #pointView = null;
  #pointCommon = null;

  constructor(pointView) {
    const {point, onRollupClick, pointCommon} = pointView;
    super();
    this.#pointView = point;
    this.#handleEditClick = onRollupClick;
    this.#pointCommon = pointCommon;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
  }

  get template() {
    return createPointViewTemplate(this.#pointView, this.#pointCommon);
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}
