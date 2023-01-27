import { nanoid } from 'nanoid';
import {getRandomArrayElement} from '../utils/utils.js';
import {getRandomNumber} from '../utils/utils.js';


const mockDestinations = [
  {
    id: 1,
    description: 'Chamonix, is a beautiful city, a true asian pearl, with crowded streets.',
    name: 'Chamonix',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber(1000,9999)}`,
        description: 'Chamonix parliament building'
      }
    ]
  },
  {
    id: 2,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    name: 'London',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber(1000,9999)}`,
        description: 'London parliament building'
      }
    ]
  },
  {
    id: 3,
    description: 'Cras aliquet varius magna, non porta ligula feugiat eget.',
    name: 'Moscow',
    pictures: [
      {
        src: `https://loremflickr.com/248/152?random=${getRandomNumber(1000,9999)}`,
        description: 'Moscow parliament building'
      }
    ]
  },
  {
    id: 4,
    description: 'Fusce tristique felis at fermentum pharetra.',
    name: 'Paris',
    pictures: [
      {
        src: 'http://picsum.photos/300/200?r=0.0762563005163317',
        description: 'Paris parliament building'
      }
    ]
  }
];

const mockOffers = [
  {
    type: 'taxi',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a business class',
        price: 120
      },
      {
        id: 2,
        title: 'Add luggage',
        price: 30
      },
    ]
  },
  {
    type: 'bus',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a business class',
        price: 120
      },
      {
        id: 2,
        title: 'Add luggage',
        price: 30
      }
    ]
  },
  {
    type: 'ship',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a business class',
        price: 120
      },
      {
        id: 2,
        title: 'Add luggage',
        price: 30
      },
      {
        id: 3,
        title: 'Add meal',
        price: 15
      }
    ]
  },
  {
    type: 'drive',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a business class',
        price: 120
      }
    ]
  },
  {
    type: 'flight',
    offers: [
      {
        id: 1,
        title: 'Upgrade to a business class',
        price: 120
      },
      {
        id: 2,
        title: 'Add luggage',
        price: 30
      },
      {
        id: 3,
        title: 'Add meal',
        price: 15
      }
    ]
  }
];

const mockPoints = [
  {
    basePrice: 100,
    dateFrom: '2022-01-10T22:55:56.845Z',
    dateTo: '2022-01-11T11:22:13.375Z',
    destination: 1,
    id: '0',
    offers: [1, 2],
    type: 'bus'
  },
  {
    basePrice: 50,
    dateFrom: '2022-02-13T22:55:56.845Z',
    dateTo: '2022-02-16T11:22:13.375Z',
    destination: 2,
    id: '1',
    offers: [1],
    type: 'taxi'
  },
  {
    basePrice: 1100,
    dateFrom: '2022-03-24T22:55:56.845Z',
    dateTo: '2022-03-27T11:22:13.375Z',
    destination: 3,
    id: '2',
    offers: [1, 2, 3],
    type: 'flight'
  },
  {
    basePrice: 500,
    dateFrom: '2023-04-24T22:55:56.845Z',
    dateTo: '2023-04-27T11:22:13.375Z',
    destination: 4,
    id: '3',
    offers: [1, 2],
    type: 'ship'
  }
];

function getRandomPoint() {
  return {
    id: nanoid(),
    ...getRandomArrayElement(mockPoints)
  };
}

export {mockDestinations, mockOffers, mockPoints, getRandomPoint};
