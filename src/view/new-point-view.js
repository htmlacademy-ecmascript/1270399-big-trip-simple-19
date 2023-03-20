import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizePointDueFullDate} from '../utils/utils.js';
import flatpickr from 'flatpickr';
import he from 'he';
import 'flatpickr/dist/flatpickr.min.css';

function createPointsOffersSelectionTemplate(type, offers, offersType, isDisabled) {
  const pointsOffers = offersType.offers.map((offer) =>
    `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${type}-${offer.id}" type="checkbox" name="event-offer-${type}-${offer.id}" data-offer-id="${offer.id}" ${offers.includes(offer.id) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
    <label class="event__offer-label" for="event-offer-${type}-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`).join('');
  return pointsOffers;
}

const createPointsDestantionTemplate = (destinations) => destinations.map((item) => `<option value="${he.encode(item.name)}"></option>`).join('');

function createPointsTypeSelectionTemplate(offersByTypes, type, ID, isDisabled) {
  const pointsTypeSelection = offersByTypes.map((item) => {
    const checkedType = item.type.includes(type) ? 'checked' : '';
    return (
      `<div class="event__type-item">
  <input id="event-type-${item.type}-${ID}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${he.encode(item.type)}" ${checkedType} ${isDisabled ? 'disabled' : ''}>
  <label class="event__type-label  event__type-label--${item.type}" for="event-type-${item.type}-${ID}">${item.type}</label>
  </div>`);
  }).join('');
  return pointsTypeSelection;
}

const createSectionDestinationTemplate = (destination) => {

  if (destination) {
    const createPicturesTemplate = (pictures) =>
      pictures.map((picture) =>
        ` <img class="event__photo" src="${picture.src}" alt="${picture.description}">`
      ).join('');

    const picturesTemplate = createPicturesTemplate(destination.pictures);

    return (
      `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${destination.description}</p>
    <div class="event__photos-container">
      <div class="event__photos-tape">
      ${picturesTemplate}
      </div>
    </div>
    </section>`
    );
  } else {
    return '';
  }
};

function createAddNewPointTemplate(point) {

  const {basePrice, dateFrom, dateTo, type, offers, offersByTypes, offersType, destination, destinations, isDisabled, isSaving} = point;

  const ID = 1;
  const pointDateFrom = humanizePointDueFullDate(dateFrom);
  const pointDateTo = humanizePointDueFullDate(dateTo);
  const availablepointsOffers = createPointsOffersSelectionTemplate(type, offers, offersType, isDisabled);
  const pointsTypeSelectionTemplate = createPointsTypeSelectionTemplate(offersByTypes, type, ID, isDisabled);
  const pointsdestantionTemplate = createPointsDestantionTemplate(destinations);
  const sectionDestinationTemplate = createSectionDestinationTemplate(destination);

  return (
    `<li class="trip-events__item">
        <form class="event event--edit" action="#" method="post">
          <header class="event__header">
            <div class="event__type-wrapper">
              <label class="event__type  event__type-btn" for="event-type-toggle-${ID}">
                <span class="visually-hidden">Choose event type</span>
                <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
              </label>
              <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${ID}" type="checkbox">
              <div class="event__type-list">
                <fieldset class="event__type-group">
                  <legend class="visually-hidden">Event type</legend>
                  ${pointsTypeSelectionTemplate}
                </fieldset>
              </div>
            </div>
            <div class="event__field-group  event__field-group--destination">
              <label class="event__label  event__type-output" for="event-destination-1">
                ${type}
              </label>
              <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(destination ? destination.name : '')}" list="destination-list-${ID}" ${isDisabled ? 'disabled' : ''}>
              <datalist id="destination-list-${ID}">
                ${pointsdestantionTemplate}
              </datalist>
            </div>
            <div class="event__field-group  event__field-group--time">
              <label class="visually-hidden" for="event-start-time-1">From</label>
              <input class="event__input  event__input--time" id="event-start-time-${ID}" type="text" name="event-start-time" value="${he.encode(pointDateFrom)}" ${isDisabled ? 'disabled' : ''}>
              &mdash;
              <label class="visually-hidden" for="event-end-time-1">To</label>
              <input class="event__input  event__input--time" id="event-end-time-${ID}" type="text" name="event-end-time" value="${he.encode(pointDateTo)}" ${isDisabled ? 'disabled' : ''}>
            </div>
            <div class="event__field-group  event__field-group--price">
              <label class="event__label" for="event-price-${ID}">
                <span class="visually-hidden">Price</span>
                &euro;
              </label>
              <input class="event__input  event__input--price" id="event-price-${ID}" type="text" name="event-price" value="${he.encode(String(basePrice))}" ${isDisabled ? 'disabled' : ''}>
            </div>
            <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
            <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>Cancel</button>
          </header>
          <section class="event__details">
          <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>
          <div class="event__available-offers">
            ${availablepointsOffers}
          </div>
        </section>
        ${sectionDestinationTemplate}
          </section>
        </form>
      </li>`
  );
}

export default class NewPointView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleDeleteClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({point, onFormSubmit, onDeleteClick}) {
    super();
    this._setState(NewPointView.parsePointToState(point));
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  get template() {
    return createAddNewPointTemplate(this._state);
  }

  removeElement() {
    super.removeElement();
    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  _restoreHandlers() {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__reset-btn')
      .addEventListener('click', this.#formDeleteClickHandler);
    this.element.querySelector('.event__type-group')
      .addEventListener('change', this.#pointTypeHandler);
    this.element.querySelector('.event__field-group--destination')
      .addEventListener('change', this.#pointDestinationHandler);
    this.element.querySelector('.event__field-group--price')
      .addEventListener('change', this.#pointPriceHandler);
    if (this.element.querySelector('.event__section--offers') !== null) {
      this.element.querySelector('.event__section--offers')
        .addEventListener('change', this.#pointOfferChangeHandler);
    }
    this.#setDatepicker();
  }

  #pointOfferChangeHandler = (evt) => {
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

  #pointTypeHandler = (evt) => {
    const newType = evt.target.value;
    const newOfferByTypes = this._state.offersByTypes.find((offer) => offer.type === newType);

    this.updateElement({
      type: newType,
      offersType: newOfferByTypes,
      offers:[]
    });
  };

  #pointDestinationHandler = (evt) => {
    const newName = evt.target.value;
    const newDestination = this._state.destinations.find((direction) => direction.name === newName);
    if (!newDestination) {
      this.updateElement({...this._state});
      return;
    }
    this.updateElement({
      destination : newDestination
    });
  };

  #pointPriceHandler = (evt) => {
    const prevPrice = this._state.basePrice;
    const newPrice = evt.target.value;
    const REGEX = /^[\D0]+|\D/g;
    if(!REGEX.test(newPrice)) {
      this._setState({basePrice: Number(newPrice)});
    } else {
      evt.target.value = prevPrice;
    }
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(NewPointView.parseStateToPoint(this._state));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(NewPointView.parseStateToPoint(this._state));
  };

  #dateFromChangeHandler = ([userDate]) => {
    this.updateElement({
      dateFrom: userDate,
    });
  };

  #dateToChangeHandler = ([userDate]) => {
    this.updateElement({
      dateTo: userDate,
    });
  };

  #setDatepicker() {
  // flatpickr есть смысл инициализировать только в случае,
  // если поле выбора даты доступно для заполнения
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('input[name="event-start-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateFrom,
        onChange: this.#dateFromChangeHandler,
      },
    );
    this.#datepickerTo = flatpickr(
      this.element.querySelector('input[name="event-end-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler,
      },
    );
  }

  static parsePointToState(point) {
    return {...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    if (state.destination && state.basePrice) {
      const point = {...state,
        destination: state.destination.id
      };

      delete point.isDisabled;
      delete point.isSaving;
      delete point.isDeleting;

      return point;
    }
  }
}
