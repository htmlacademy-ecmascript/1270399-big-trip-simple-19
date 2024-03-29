import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {mockDestinations, mockOffers} from '../mock/points-mock.js';
import {humanizePointDueFullDate} from '../utils/utils.js';

const BLANK_POINT = {
  basePrice: 100,
  dateFrom: '2022-01-10T22:55:56.845Z',
  dateTo: '2022-01-11T11:22:13.375Z',

  destination: {
    id: 1,
    description: 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    name: 'Chamonix',
    pictures: [
      {
        src: 'https://loremflickr.com/248/152?random=1111',
        description: 'Chamonix parliament building'
      }
    ]
  },
  offers: [1, 2],
  type: 'bus'
};

function createFormCreationTemplate(point) {
  const {basePrice, dateFrom, dateTo, destination, id, offers, type} = point;

  const pointTypeOffer = mockOffers.find((offer) => offer.type === type);
  const pointDestination = mockDestinations.find((item) => destination === item.id);

  const tripDateFrom = humanizePointDueFullDate(dateFrom);
  const tripDateTo = humanizePointDueFullDate(dateTo);

  const tripTypeTemplate = mockOffers.map((item) =>
    `<div class="event__type-item">
  <input id="event-type-${item.type}-${item.id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item.type}">
  <label class="event__type-label  event__type-label--${item.type}" for="event-type-${item.type}-${item.id}">${item.type}</label>
</div>`).join('');

  const destantionTemplate = mockDestinations.map((item) => `<option value="${item.name}"></option>`).join('');

  const offersTemplate = pointTypeOffer.offers
    .map((offer) =>
      `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.type}-${offer.id}" type="checkbox" name=${offer.title} ${offers.includes(offer.id) ? 'checked' : ''}>
    <label class="event__offer-label" for="event-offer-${offer.type}-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`).join('');

  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
              ${tripTypeTemplate}
          </fieldset>
        </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
          ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${pointDestination /**/}" list="destination-list-${id}">
          <datalist id="destination-list-${id}">
          ${destantionTemplate}
          </datalist>
        </div>
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${tripDateFrom}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${tripDateTo}">
        </div>
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice}">
        </div>
        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
      <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${offersTemplate}
          </div>
      </section>
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${pointDestination /**/}</p>
          <div class="event__photos-container">
          <div class="event__photos-tape">
            <img class="event__photo" src="img/photos/1.jpg" alt="Event photo">
            <img class="event__photo" src="img/photos/2.jpg" alt="Event photo">
            <img class="event__photo" src="img/photos/3.jpg" alt="Event photo">
            <img class="event__photo" src="img/photos/4.jpg" alt="Event photo">
            <img class="event__photo" src="img/photos/5.jpg" alt="Event photo">
          </div>
        </div>
      </section>
    </section>
  </form>
</li>`
  );
}

export default class CreateFormView extends AbstractStatefulView {
  #handleClickClose = null;
  #handleFormSubmit = null;
  #handleDeleteClick = null;

  constructor({point = BLANK_POINT, onCloseClick, onFormSubmit, onDeleteClick}) {
    super();
    this._setState(point);

    this.#handleClickClose = onCloseClick;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  get template() {
    return createFormCreationTemplate(this._state);
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this. #formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeFormHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__field-group--destination').addEventListener('change', this.#destinationInputHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(CreateFormView.parseStateToPoint(this._state));
  };

  #closeFormHandler = (evt) => {
    evt.preventDefault();
    this.#handleClickClose();
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(CreateFormView.parseStateToPoint(this._state));
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: evt.target.value
    });
  };

  #destinationInputHandler = (evt) => {
    evt.preventDefault();
    const findDestination = (name) => mockDestinations.find((destination) => destination.name === name);
    this.updateElement({
      destination: findDestination(evt.target.value)
    });
  };

  static parsePointToState = (point) => ({ ...point });

  static parseStateToPoint = (state) => ({ ...state });
}
