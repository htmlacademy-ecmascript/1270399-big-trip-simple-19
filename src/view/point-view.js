import AbstractView from '../framework/view/abstract-view.js';
import {humanizePointDueDate, humanizePointDueTime} from '../utils/utils.js';

function createSelectedAvailableOffers (offers, availableOffers) {
  if (!offers.length) {
    return `<li class="event__offer">
  <span class="event__offer-title">No additional offers</span>
  </li>`;
  } else {
    const templateOffers = availableOffers.offers.map((item) =>
      offers.includes(item.id) ? // includes содержит ли элемент массив
        `<li class="event__offer">
      <span class="event__offer-title">${item.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${item.price}</span>
      </li>` : '').join(''); // Join переводит в строку
    return templateOffers;
  }
}


function createPointTemplate(point) {
  const {basePrice, dateFrom, dateTo, destination, offers, offersType, type} = point;

  const pointDate = humanizePointDueDate(dateFrom);
  const pointTimeFrom = humanizePointDueTime(dateFrom);
  const pointTimeTo = humanizePointDueTime(dateTo);

  const selectedAvailableOffers = createSelectedAvailableOffers(offers, offersType);

  return (
    `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${dateFrom}">${pointDate}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${dateFrom}">${pointTimeFrom}</time>
          &mdash;
          <time class="event__end-time" datetime="${dateTo}">${pointTimeTo}</time>
        </p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      <ul class="event__selected-offers">
      ${selectedAvailableOffers}
      </ul>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`
  );
}

export default class PointView extends AbstractView {
  #point = null;
  #handleEditClick = null;

  constructor({point, onEditClick}) {
    super();
    this.#point = point;
    this.#handleEditClick = onEditClick;

    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createPointTemplate(this.#point);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}
