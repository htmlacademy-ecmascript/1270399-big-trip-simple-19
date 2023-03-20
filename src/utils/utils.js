import dayjs from 'dayjs';

const TIME_FORMAT = 'HH:mm';
const DATE_FORMAT = 'MMM DD';
const FULL_DATE_FORMAT = 'DD/MM/YY HH:mm';

function humanizePointDueTime(dueDate) {
  return dueDate ? dayjs(dueDate).format(TIME_FORMAT) : '';
}

function humanizePointDueDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE_FORMAT) : '';
}

function humanizePointDueFullDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(FULL_DATE_FORMAT) : '';
}

const getRandomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

function getWeightForNullDate(dateA, dateB) {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
}

function sortDay(pointA, pointB) {
  const weight = getWeightForNullDate(pointA.dateFrom, pointB.dateFrom);

  return weight ?? dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}

function sortPrice(pointA, pointB) {
  const weight = getWeightForNullDate(pointA.basePrice, pointB.basePrice);

  return weight ?? pointB.basePrice - pointA.basePrice;
}

const firstLetterUp = (item) => {
  if (!item) {
    return item;}
  return item[0].toUpperCase() + item.slice(1);
};

export {getRandomArrayElement, humanizePointDueTime, humanizePointDueDate, humanizePointDueFullDate, sortDay, sortPrice, firstLetterUp};
