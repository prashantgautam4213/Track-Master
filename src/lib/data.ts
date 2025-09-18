import type { Train, User, Booking } from './types';

export const stations = [
  'Grand Central Terminal, NY',
  'Union Station, Chicago',
  '30th Street Station, PA',
  'Union Station, Los Angeles',
  'South Station, Boston',
  'King Street Station, Seattle',
  'Union Station, Denver',
  'Penn Station, Baltimore',
];

export const trains: Train[] = [
  {
    id: 'T123',
    name: 'Metropolis Express',
    number: '123',
    from: 'Grand Central Terminal, NY',
    to: 'Union Station, Chicago',
    departureTime: '08:00',
    arrivalTime: '22:00',
    duration: '14h 0m',
    classes: [
      { name: 'Economy', availability: 150, price: 120 },
      { name: 'Business', availability: 40, price: 250 },
      { name: 'First', availability: 10, price: 400 },
    ],
  },
  {
    id: 'T456',
    name: 'Coastal Starlight',
    number: '456',
    from: 'Union Station, Los Angeles',
    to: 'King Street Station, Seattle',
    departureTime: '10:30',
    arrivalTime: '18:30',
    duration: '8h 0m',
    classes: [
      { name: 'Economy', availability: 200, price: 90 },
      { name: 'Business', availability: 50, price: 180 },
      { name: 'First', availability: 0, price: 320 },
    ],
  },
  {
    id: 'T789',
    name: 'Keystone Service',
    number: '789',
    from: '30th Street Station, PA',
    to: 'Grand Central Terminal, NY',
    departureTime: '09:15',
    arrivalTime: '11:00',
    duration: '1h 45m',
    classes: [
      { name: 'Economy', availability: 5, price: 55 },
      { name: 'Business', availability: 25, price: 95 },
      { name: 'First', availability: 8, price: 150 },
    ],
  },
  {
    id: 'T101',
    name: 'Rocky Mountain Runner',
    number: '101',
    from: 'Union Station, Denver',
    to: 'Union Station, Chicago',
    departureTime: '12:00',
    arrivalTime: '06:00',
    duration: '18h 0m',
    classes: [
      { name: 'Economy', availability: 80, price: 150 },
      { name: 'Business', availability: 20, price: 300 },
      { name: 'First', availability: 5, price: 500 },
    ],
  },
  {
    id: 'T212',
    name: 'Acela Express',
    number: '212',
    from: 'South Station, Boston',
    to: 'Penn Station, Baltimore',
    departureTime: '14:00',
    arrivalTime: '20:30',
    duration: '6h 30m',
    classes: [
      { name: 'Economy', availability: 0, price: 110 },
      { name: 'Business', availability: 60, price: 220 },
      { name: 'First', availability: 15, price: 350 },
    ],
  },
];

const mockBookings: Booking[] = [
    {
      id: 'B001',
      trainName: 'Metropolis Express',
      trainNumber: '123',
      date: '2024-08-15',
      from: 'Grand Central Terminal, NY',
      to: 'Union Station, Chicago',
      class: 'Business',
      passengers: 1,
      totalPrice: 250,
    },
    {
      id: 'B002',
      trainName: 'Keystone Service',
      trainNumber: '789',
      date: '2024-07-20',
      from: '30th Street Station, PA',
      to: 'Grand Central Terminal, NY',
      class: 'Economy',
      passengers: 2,
      totalPrice: 110,
    }
]


export const mockUser: User = {
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    bookings: mockBookings
}

export const demoUser: User = {
    name: 'Demo User',
    email: 'demo@example.com',
    bookings: []
}
