import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizePointDueFullDate} from '../utils/utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import {POINT_TYPES} from '../const.js';
import he from 'he';

export const BLANK_POINT = {
  basePrice: 1,
  destination: -1,
  offers: [],
  type: POINT_TYPES[0]
};

function createEventTypeItemTemplate(offers, id, type) {
  const checkedType = offers.map((item) => {
    const checked = item.type === type ? 'checked' : '';
    return `<div class="event__type-item">
  <input id="event-type-${he.encode(item.type)}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value=""${he.encode(item.type)}" ${checked}">
  <label class="event__type-label  event__type-label--${he.encode(item.type)}" for="event-type-${he.encode(item.type)}-${id}">${he.encode(item.type)}</label>
  </div>`;
  }).join('');

  return checkedType;
}

function createSectionOffersTemplate(offerTypes, offer, type) {
  let pointTypeOffers = '';
  if (offerTypes) {
    pointTypeOffers = offerTypes.offers.map((item) => (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${he.encode(type)}-${item.id}" type="checkbox" name=${he.encode(item.title)} data-offer-id="${item.id}" ${offer.includes(item.id) ? 'checked' : ''}>
        <label class="event__offer-label" for="event-offer-${type}-${item.id}">
      <span class="event__offer-title">${he.encode(item.title)}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${he.encode(item.price)}</span>
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
      (picture) => `<img class="event__photo" src=${he.encode(picture.src)} alt="${he.encode(picture.description)}">`
    ).join('');
  }
  return pictures;
}

function createFormEditTemplate(pointEdit, pointCommon) {
  const isNewPoint = !('id' in pointEdit);
  const {basePrice, dateFrom, dateTo, destination, id, offers, type, isDisabled, isSaving, isDeleting} = pointEdit;

  const destantionTemplate = pointCommon.allDestinations.map((destantion) => `<option value="${he.encode(destantion.name)}">`).join('');

  const pointTypeOffer = pointCommon.allDestinations.find((offer) => offer.type === type);
  const pointDestination = pointCommon.allOffers.find((item) => destination === item.id);

  const tripDateFrom = humanizePointDueFullDate(dateFrom);
  const tripDateTo = humanizePointDueFullDate(dateTo);

  const createSectionTemplate = createSectionOffersTemplate(pointTypeOffer, offers, type);
  const eventTypeItemTemplate = createEventTypeItemTemplate(pointCommon.allOffers, id, type);
  const picturesTemplate = createPicturesTemplate(pointDestination);

  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${he.encode(String(id))}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${he.encode(type)}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${he.encode(String(id))}" type="checkbox" ${isDisabled ? 'disabled' : ''}>
        <div class="event__type-list">
          <fieldset class="event__type-group">
            <legend class="visually-hidden">Event type</legend>
              ${eventTypeItemTemplate}
          </fieldset>
        </div>
        </div>
        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${he.encode(String(id))}">
          ${he.encode(type)}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${he.encode(String(id))}" type="text" name="event-destination" value="${he.encode(pointDestination ? pointDestination.name : '')}" list="destination-list-${he.encode(String(id))}"
          ${isDisabled ? 'disabled' : ''}>
          <datalist id="destination-list-${he.encode(String(id))}">
          ${destantionTemplate}
          </datalist>
        </div>
        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${he.encode(String(id))}">From</label>
          <input class="event__input  event__input--time" id="event-start-time-${he.encode(String(id))}" type="text" name="event-start-time" value="${tripDateFrom}" ${isDisabled ? 'disabled' : ''}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-${he.encode(String(id))}">To</label>
          <input class="event__input  event__input--time" id="event-end-time-${he.encode(String(id))}" type="text" name="event-end-time" value="${tripDateTo}" ${isDisabled ? 'disabled' : ''}>
        </div>
        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${he.encode(String(id))}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${he.encode(String(id))}" type="text" name="event-price" value="${he.encode(basePrice) !== null ? he.encode(basePrice) : ''}" ${isDisabled ? 'disabled' : ''}>
          </div>
          <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>${isNewPoint ? `
          <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>Cancel</button>` : `
          <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
          <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}><span class="visually-hidden">Open event</span></button>`}
        </header>
      <section class="event__details">
      <section class="event__section  event__section--offers">
      ${!pointTypeOffer || !pointTypeOffer.offers || pointTypeOffer.offers.length === 0 ? '' : '<h3 class="event__section-title  event__section-title--offers">Offers</h3>'}
          <div class="event__available-offers">
            ${createSectionTemplate}
          </div>
      </section>
        <section class="event__section  event__section--destination">
        ${pointDestination ? '<h3 class="event__section-title  event__section-title--destination">Destination</h3>' : '' }
          <p class="event__destination-description">${he.encode(pointDestination ? pointDestination.description : '')}</p>
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
  #pointCommon = null;


  constructor({ point = {
    ...BLANK_POINT,
    dateFrom: new Date(),
    dateTo: new Date(),
  }, onFormSubmit, onFormClose, onDeleteClick, pointCommon}) {
    super();
    this._setState(EditFormView.parsePointToState(point));
    this.#pointCommon = pointCommon;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleFormClose = onFormClose;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  get template() {
    return createFormEditTemplate(this._state, this.#pointCommon);
  }

  reset(point) {
    this.updateElement(
      EditFormView.parsePointToState(point),
    );
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this. #formSubmitHandler);
    const rollupButton = this.element.querySelector('.event__rollup-btn');
    if (rollupButton) {
      this.element.querySelector('.event__rollup-btn')
        .addEventListener('click', this.#closeFormHandler);
    }
    this.element.querySelector('.event__type-group').addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationInputHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#formDeleteClickHandler);
    if (this.#pointCommon.allOffers.find((offerTypes) => offerTypes.type === this._state.type).offers)
    {
      this.element.querySelector('.event__available-offers')
        .addEventListener('change', this.#changeOfferHandler);
    }
    this.element.querySelector('.event__input--price').addEventListener('input', this.#priceEventHandler);
    this.#setDatepickerFrom();
    this.#setDatepickerTo();
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditFormView.parseStateToPoint(this._state));
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
    const pointDestination = this.#pointCommon.allDestinations.find((item) => evt.target.value === item.name);
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

  static parsePointToState(point) {
    return {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = { ...state };

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}
