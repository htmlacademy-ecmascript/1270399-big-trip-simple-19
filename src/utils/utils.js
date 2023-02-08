import dayjs from 'dayjs';
import {FilterType} from '../const.js';

const TIME_FORNAT = 'HH:mm';
const DATE_FORMAT = 'MMM DD';
const FULL_DATE_FORMAT = 'DD/MM/YY HH:mm';

function humanizePointDueTime(dueDate) {
  return dueDate ? dayjs(dueDate).format(TIME_FORNAT) : '';
}

function humanizePointDueDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE_FORMAT) : '';
}

function humanizePointDueFullDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(FULL_DATE_FORMAT) : '';
}

function isPointFuture(dateFrom) {
  return dateFrom && (dayjs().isSame(dateFrom, 'D') || dayjs().isBefore(dateFrom, 'D'));
}

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point.dateFrom)),
};

function getWeightForNullValue(valueA, valueB) {
  if (valueA === null && valueB === null) {
    return 0;
  }

  if (valueA === null) {
    return 1;
  }

  if (valueB === null) {
    return -1;
  }

  return null;
}

function sortDate(pointA, pointB) {
  const weight = getWeightForNullValue(pointA.dateFrom, pointB.dateFrom);

  return weight ?? dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

function sortPrice(pointA, pointB) {
  const weight = getWeightForNullValue(pointA.basePrice, pointB.basePrice);

  return weight ?? pointB.basePrice - pointA.basePrice;
}

export {humanizePointDueTime, humanizePointDueDate, humanizePointDueFullDate, filter, sortDate, sortPrice};

