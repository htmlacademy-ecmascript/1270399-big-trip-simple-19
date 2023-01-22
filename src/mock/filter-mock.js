import {filter} from '../utils.js';

function generateFilter(points) {
  return Object.entries(filter).map(
    ([filterName, filterPoints]) => ({
      name: filterName,
      count:filterPoints(points).length,
    })
  );
}

export {generateFilter};
