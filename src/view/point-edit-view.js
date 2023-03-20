import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import {humanizePointDueFullDate} from '../utils/utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';

function createPointsOffersSelectionTemplate(offers, availableOffers, isDisabled) {
  const pointsOffers = availableOffers.offers.map((offer) =>
    `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.type}-${offer.id}" type="checkbox" name=${offer.title} data-offer-id="${offer.id}" ${offers.includes(offer.id) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
    <label class="event__offer-label" for="event-offer-${offer.type}-${offer.id}">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
  </div>`).join('');
  return pointsOffers;
}

const createPointsDestantionTemplate = (destinations) => destinations.map((item) => `<option value="${he.encode(item.name)}"></option>`).join('');

function createPicturesTemplate(pictures) {
  return pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`)
    .join('');
}

function createPointsTypeSelectionTemplate(offersByTypes, type, id, isDisabled) {
  const pointsTypeSelection = offersByTypes.map((item) => {
    const checkedType = item.type.includes(type) ? 'checked' : '';
    return (
      `<div class="event__type-item">
  <input id="event-type-${item.type}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${he.encode(item.type)}" ${checkedType} ${isDisabled ? 'disabled' : ''}>
  <label class="event__type-label  event__type-label--${item.type}" for="event-type-${item.type}-${id}">${item.type}</label>
  </div>`);
  }).join('');
  return pointsTypeSelection;
}

function createPointEditTemplate(point) {

  const {basePrice, dateFrom, dateTo, destination, type, offers, id, offersType, offersByTypes, destinations, isDisabled, isSaving, isDeleting} = point;

  const pointDateFrom = humanizePointDueFullDate(dateFrom);
  const pointDateTo = humanizePointDueFullDate(dateTo);
  const availablepointsOffers = createPointsOffersSelectionTemplate(offers, offersType, isDisabled);
  const pointsTypeSelectionTemplate = createPointsTypeSelectionTemplate(offersByTypes, type, id, isDisabled);
  const pointsdestantionTemplate = createPointsDestantionTemplate(destinations);
  const picturesTemplate = createPicturesTemplate(destination.pictures);

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
          ${pointsTypeSelectionTemplate}
        </fieldset>
      </div>
    </div>
    <div class="event__field-group  event__field-group--destination">
      <label class="event__label  event__type-output" for="event-destination-1">
      ${type}
      </label>
      <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(destination.name)}" list="destination-list-${id}" ${isDisabled ? 'disabled' : ''}>
      <datalist id="destination-list-${id}">
        ${pointsdestantionTemplate}
      </datalist>
    </div>
    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-1">From</label>
      <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${he.encode(pointDateFrom)}" ${isDisabled ? 'disabled' : ''}>
      &mdash;
      <label class="visually-hidden" for="event-end-time-1">To</label>
      <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${he.encode(pointDateTo)}" ${isDisabled ? 'disabled' : ''}>
    </div>

    <div class="event__field-group  event__field-group--price">
      <label class="event__label" for="event-price-${id}">
        <span class="visually-hidden">Price</span>
        &euro;
      </label>
      <input class="event__input  event__input--price" id="event-price-${id}" type="text" name="event-price" value="${he.encode(String(basePrice))}" ${isDisabled ? 'disabled' : ''}>
    </div>

    <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
    <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  </header>
  <section class="event__details">
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
        ${availablepointsOffers}
      </div>
    </section>

    <section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${destination.description}</p>

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

export default class PointEditView extends AbstractStatefulView {
  #handleFormSubmit = null;
  #handleEditFormClose = null;
  #handleDeleteClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({point, onFormSubmit, onFormClose, onDeleteClick}) {
    super();
    this._setState(PointEditView.parsePointToState(point));
    this.#handleFormSubmit = onFormSubmit;
    this.#handleEditFormClose = onFormClose;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  // подготавливает шаблон задачи
  get template() {
    return createPointEditTemplate(this._state);
  }

  // Перегружаем метод родителя removeElement,
  // чтобы при удалении удалялся более не нужный календарь
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

  reset(point) {
    this.updateElement(
      PointEditView.parsePointToState(point)
    );
  }

  _restoreHandlers() {
    this.element.querySelector('form')
      .addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#formCloseHandler);
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
    if (newDestination) {
      this.updateElement({
        destination : newDestination
      });
    }
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
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #formDeleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(PointEditView.parseStateToPoint(this._state));
  };

  #formCloseHandler = () => {
    this.#handleEditFormClose();
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
        onChange: this.#dateFromChangeHandler,
      },
    );
    this.#datepickerTo = flatpickr(
      this.element.querySelector('input[name="event-end-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
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
    const point = {...state,
      destination: state.destination.id
    };

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}
