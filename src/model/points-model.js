import Observable from '../framework/observable.js';
import {UpdateType} from '../const.js';

const BLANK_POINT = {
  'base_price': '',
  'date_from': new Date(),
  'date_to': new Date(),
  destination: 0,
  offers: [],
  type: 'taxi'
};

export default class PointsModel extends Observable {
  #pointsApiService = null;
  #points = [];
  #offersByTypes = [];
  #destinations = [];

  constructor({pointsApiService}) {
    super();
    this.#pointsApiService = pointsApiService;
  }

  get points() {
    return this.#points.map((point) => {
      const offersType = this.#getOffersType(point).offersType;
      const destination = this.#getDestination(point).destination;
      const offersByTypes = this.#offersByTypes;
      const destinations = this.#destinations;

      return {
        ...point,
        destination,
        offersType,
        offersByTypes,
        destinations
      };
    });
  }

  get blankPoint() {
    const offersType = this.#getOffersType(BLANK_POINT).offersType;
    const destination = this.#getDestination(BLANK_POINT).destination;
    const offersByTypes = this.#offersByTypes;
    const destinations = this.#destinations;

    return {
      ...this.#adaptToClient(BLANK_POINT),
      destination,
      offersType,
      offersByTypes,
      destinations
    };
  }

  #getOffersType = (point) => {
    const offersType = this.#offersByTypes.find((offer) => offer.type === point.type);
    return {offersType};
  };

  #getDestination = (point) => {
    const destination = this.#destinations.find((direction) => direction.id === point.destination);
    return {destination};
  };

  async init() {
    try {
      const points = await this.#pointsApiService.points;
      const allOffers = await this.#pointsApiService.offers;
      const destinations = await this.#pointsApiService.destinations;
      this.#points = points.map(this.#adaptToClient);
      this.#offersByTypes = allOffers;
      this.#destinations = destinations;
    } catch(err) {
      this.#points = [];
    }
    this._notify(UpdateType.INIT);
  }

  async updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if(index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#pointsApiService.updatePoint(update);
      const updatedPoint = this.#adaptToClient(response);
      this.#points = [
        ...this.#points.slice(0,index),
        updatedPoint,
        ...this.#points.slice(index + 1)
      ];
      this._notify(updateType, updatedPoint);
    } catch(err) {
      throw new Error('Can\'t update point');
    }

    this._notify(updateType, update);
  }

  async addPoint(updateType, update) {
    try {
      const response = await this.#pointsApiService.addPoint(update);
      const newPoint = this.#adaptToClient(response);
      this.#points = [newPoint, ...this.#points];
      this._notify(updateType, newPoint);
    } catch(err) {
      throw new Error('Can\'t add point');
    }
  }

  async deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      // Обратите внимание, метод удаления задачи на сервере
      // ничего не возвращает. Это и верно,
      // ведь что можно вернуть при удалении задачи?
      await this.#pointsApiService.deletePoint(update);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType);
    } catch(err) {
      throw new Error('Can\'t delete point');
    }
  }

  #adaptToClient(point) {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: new Date(point['date_from']),
      dateTo: new Date(point['date_to']),
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];

    return adaptedPoint;
  }
}
