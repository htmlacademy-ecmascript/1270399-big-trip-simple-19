import {FilterType} from '../const';
import dayjs from 'dayjs';

function isPointFuture(dateFrom) {
  return dateFrom && (dayjs().isSame(dateFrom, 'D') || dayjs().isBefore(dateFrom, 'D'));
}

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter((point) => isPointFuture(point.dateFrom)),
};

export {filter};
