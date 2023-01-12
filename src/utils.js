import dayjs from 'dayjs';

const TIME_FORNAT = 'HH:mm';
const DATE_FORMAT = 'MMM DD';
const FULL_DATE_FORMAT = 'DD/MM/YY HH:mm';

function humanizePointDueTime(dueDate) {
  return dueDate ? dayjs(dueDate).format(TIME_FORNAT) : '';
};

function humanizePointDueDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE_FORMAT) : '';
};

function humanizePointDueFullDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(FULL_DATE_FORMAT) : '';
};

function getRandomArrayElement(items) {
    return items[Math.floor(Math.random() * items.length)];
};

function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

export {getRandomArrayElement, getRandomNumber, humanizePointDueTime, humanizePointDueDate, humanizePointDueFullDate};

