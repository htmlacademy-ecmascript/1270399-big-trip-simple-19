import AbstractView from '../framework/view/abstract-view.js';
import {mockDestinations, mockOffers} from '../mock/points-mock.js';
import {humanizePointDueTime, humanizePointDueDate} from '../utils.js';

function createPointViewTemplate(point) {
  const {basePrice, dateFrom, dateTo, destination, offers, type} = point;

  const pointTypeOffer = mockOffers.find((offer) => offer.type === type);
  const pointDestination = mockDestinations.find((item) => destination === item.id);
  const offersChecked = pointTypeOffer.offers.filter((offer) => offers.includes(offer.id));

  const tripDateFrom = humanizePointDueDate(dateFrom);
  const tripTimeFrom = humanizePointDueTime(dateFrom);
  const tripTimeTo = humanizePointDueTime(dateTo);

  const offersTemplate = () => {
    if (!offersChecked.length) {
      return `<li class="event__offer">
    <span class="event__offer-title">No additional offers</span>
    </li>`;
    } else {
      const offersCheckedTemplate = offersChecked.map((offer) => `<li class="event__offer">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </li>`).join('');
      return offersCheckedTemplate;
    }
  };

  return (`<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${tripDateFrom}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${pointDestination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${tripTimeFrom}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${tripTimeTo}</time>
          </p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersTemplate()}
        </ul>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class PointListView extends AbstractView {
  #handleRollupClick = null;
  #point = null;

  constructor({point, onRollupClick}) {
    super();
    this.#point = point;
    this.#handleRollupClick = onRollupClick;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
  }

  get template() {
    return createPointViewTemplate(this.#point);
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };
}
