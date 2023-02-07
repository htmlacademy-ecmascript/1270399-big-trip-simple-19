import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {mockDestinations, mockOffers} from '../mock/points-mock.js';
import {humanizePointDueFullDate} from '../utils/utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function createEventTypeItemTemplate(offers) {
  const checkedType = offers.map((item) =>
    `<div class="event__type-item">
  <input id="event-type-${item.type}-${item.id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${item.type}">
  <label class="event__type-label  event__type-label--${item.type}" for="event-type-${item.type}-${item.id}">${item.type}</label>
  </div>`
  ).join('');

  return checkedType;
}

const destantionTemplate = mockDestinations.map((item) => `<option value="${item.name}"></option>`).join('');

function createSectionOffersTemplate(offerTypes, offer, type) {
  let pointTypeOffers = '';
  if (offerTypes) {
    pointTypeOffers = offerTypes.offers.map((item) => (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${item.id}" type="checkbox" name=${item.title}  data-offer-id="${item.id}" ${offer.includes(item.id) ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-${type}-${item.id}">
      <span class="event__offer-title">${item.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${item.price}</span>
      </label>
      </div>`
    )).join('');
  }
  return pointTypeOffers;
}

function createPicturesTemplate(pointDestination) {
  let pictures = '';
  if (pointDestination) {
    pictures = pointDestination.pictures.map(
      (picture) => `<img class="event__photo" src=${picture.src} alt="${picture.description}">`
    ).join('');
  }
  return pictures;
}

function createFormEditTemplate(pointEdit) {
  const {basePrice, dateFrom, dateTo, destination, id, offers, type} = pointEdit;

  const pointTypeOffer = mockOffers.find((offer) => offer.type === type);
  const pointDestination = mockDestinations.find((item) => destination === item.id);

  const tripDateFrom = humanizePointDueFullDate(dateFrom);
  const tripDateTo = humanizePointDueFullDate(dateTo);

  const createSectionTemplate = createSectionOffersTemplate(pointTypeOffer, offers, type);
  const eventTypeItemTemplate = createEventTypeItemTemplate(mockOffers);
  const picturesTemplate = createPicturesTemplate(pointDestination);

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
              ${eventTypeItemTemplate}
          </fieldset>
        </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
          ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${pointDestination ? pointDestination.name : ''}" list="destination-list-${id}">
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
          <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${basePrice !== null ? basePrice : ''}">
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
            ${createSectionTemplate}
          </div>
      </section>
        <section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${pointDestination ? pointDestination.description : ''}</p>
          <div class="event__photos-container">
          <div class="event__photos-tape">
          ${picturesTemplate}
          </div>
        </div>
        </section>
      </section>
    </form>
  </li>`
  );
}

export default class EditFormView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleFormClose = null;
  #datePickerFrom = null;
  #datePickerTo = null;
  #handleDeleteClick = null;
  #offers = null;
  #destination = null;


  constructor(pointEdit) {
    const {point, onFormSubmit, onFormClose, onDeleteClick, offers, destination} = pointEdit;
    super();
    this._setState(EditFormView.parsePointToState(point));
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormClose = onFormClose;
    this.#handleDeleteClick = onDeleteClick;
    this.#offers = offers;
    this.#destination = mockDestinations.find((item) => destination === item.id);

    this._restoreHandlers();
  }

  get template() {
    return createFormEditTemplate(this._state);
  }

  reset(point) {
    this.updateElement(
      EditFormView.parsePointToState(point),
    );
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this. #formSubmitHandler);
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#closeFormHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationInputHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
    this.element.querySelector('.event__available-offers').addEventListener('change', this.#changeOfferHandler);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceEventHandler);
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditFormView.parseStateToPoint(this._state), this.#offers, this.#destination);
  };

  #closeFormHandler = () => {
    this.#handleFormClose();
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditFormView.parseStateToPoint(this._state));
  };

  #typeChangeHandler = (evt) => {
    evt.preventDefault();
    const offers = this._state.type === evt.target.value ? this._state.offers : [];
    this.updateElement({
      type: evt.target.value,
      offers
    });
  };

  #destinationInputHandler = (evt) => {
    evt.preventDefault();
    const pointDestination = mockDestinations.find((destination) => evt.target.value === destination.name);
    const destinationId = pointDestination === undefined ? -1 : pointDestination.id;
    this.updateElement({
      destination: destinationId
    });
  };

  removeElement() {
    super.removeElement();

    if (this.#datePickerFrom) {
      this.#datePickerFrom.destroy();
      this.#datePickerFrom = null;
    }

    if (this.#datePickerTo) {
      this.#datePickerTo.destroy();
      this.#datePickerTo = null;
    }
  }

  #dateStartChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateEndChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #setDatepickerFrom() {
    this.#datePickerFrom = flatpickr(
      this.element.querySelector('[name=event-start-time]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        defaultDate: this._state.dateFrom,
        onClose: this.#dateStartChangeHandler,
      }
    );
  }

  #setDatepickerTo() {
    this.#datePickerTo = flatpickr(
      this.element.querySelector('[name=event-end-time]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        defaultDate: this._state.dateTo,
        onClose: this.#dateEndChangeHandler,
      }
    );
  }

  #changeOfferHandler = (evt) => {
    evt.preventDefault();
    let offers = this._state.offers;
    const offerId = parseInt(evt.target.dataset.offerId, 10);
    if (evt.target.checked) {
      offers.push(offerId);
      offers.sort();
    } else {
      offers = this._state.offers.filter((offer) => offer !== offerId);
    }
    this.updateElement({
      offers
    });
  };

  #priceEventHandler = (evt) => {
    const updatePrice = evt.target.value;
    const REGEX = /^[\D0]+|\D/g;
    if (updatePrice) {
      if(!REGEX.test(updatePrice)) {
        this._state.basePrice = updatePrice;
        this._setState(this._state.basePrice);
      }
    }
  };

  static parsePointToState = (point) => ({ ...point });

  static parseStateToPoint = (state) => ({ ...state });
}
