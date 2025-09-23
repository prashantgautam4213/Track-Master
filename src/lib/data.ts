import type { Train, User, Booking } from './types';

export const stations = [
  'New Delhi, DL',
  'Mumbai Central, MH',
  'Chennai Central, TN',
  'Howrah Junction, WB',
  'Bengaluru City, KA',
  'Secunderabad Jn, TS',
  'Pune Junction, MH',
  'Ahmedabad Junction, GJ',
];

export const trains: Train[] = [
  {
    id: 'T123',
    name: 'Mumbai Rajdhani',
    number: '12951',
    from: 'Mumbai Central, MH',
    to: 'New Delhi, DL',
    departureTime: '17:00',
    arrivalTime: '08:30',
    duration: '15h 30m',
    classes: [
      { name: 'Economy', availability: 150, price: 2100 },
      { name: 'Business', availability: 40, price: 3500 },
      { name: 'First', availability: 10, price: 5400 },
    ],
  },
  {
    id: 'T124',
    name: 'August Kranti Rajdhani',
    number: '12953',
    from: 'Mumbai Central, MH',
    to: 'New Delhi, DL',
    departureTime: '17:10',
    arrivalTime: '10:55',
    duration: '17h 45m',
    classes: [
      { name: 'Economy', availability: 120, price: 2000 },
      { name: 'Business', availability: 30, price: 3300 },
      { name: 'First', availability: 5, price: 5200 },
    ],
  },
  {
    id: 'T456',
    name: 'Bengaluru Rajdhani',
    number: '22691',
    from: 'Bengaluru City, KA',
    to: 'New Delhi, DL',
    departureTime: '20:00',
    arrivalTime: '05:30',
    duration: '33h 30m',
    classes: [
      { name: 'Economy', availability: 200, price: 2500 },
      { name: 'Business', availability: 50, price: 4200 },
      { name: 'First', availability: 0, price: 6000 },
    ],
  },
   {
    id: 'T457',
    name: 'Karnataka Express',
    number: '12627',
    from: 'Bengaluru City, KA',
    to: 'New Delhi, DL',
    departureTime: '19:20',
    arrivalTime: '09:00',
    duration: '37h 40m',
    classes: [
      { name: 'Economy', availability: 10, price: 950 },
      { name: 'Business', availability: 5, price: 1900 },
      { name: 'First', availability: 2, price: 3400 },
    ],
  },
  {
    id: 'T789',
    name: 'Howrah Rajdhani',
    number: '12301',
    from: 'Howrah Junction, WB',
    to: 'New Delhi, DL',
    departureTime: '16:50',
    arrivalTime: '10:00',
    duration: '17h 10m',
    classes: [
      { name: 'Economy', availability: 5, price: 2200 },
      { name: 'Business', availability: 25, price: 3800 },
      { name: 'First', availability: 8, price: 5800 },
    ],
  },
  {
    id: 'T101',
    name: 'Duronto Express',
    number: '12285',
    from: 'Secunderabad Jn, TS',
    to: 'New Delhi, DL',
    departureTime: '12:50',
    arrivalTime: '10:35',
    duration: '21h 45m',
    classes: [
      { name: 'Economy', availability: 80, price: 1800 },
      { name: 'Business', availability: 20, price: 3200 },
      { name: 'First', availability: 5, price: 5000 },
    ],
  },
  {
    id: 'T212',
    name: 'Chennai Rajdhani',
    number: '12433',
    from: 'Chennai Central, TN',
    to: 'New Delhi, DL',
    departureTime: '06:05',
    arrivalTime: '10:30',
    duration: '28h 25m',
    classes: [
      { name: 'Economy', availability: 0, price: 2400 },
      { name: 'Business', availability: 60, price: 4000 },
      { name: 'First', availability: 15, price: 6200 },
    ],
  },
];

const mockBookings: Booking[] = [
    {
      id: 'B001',
      trainId: 'T123',
      trainName: 'Mumbai Rajdhani',
      trainNumber: '12951',
      date: '2024-08-15',
      departureTime: '17:00',
      from: 'Mumbai Central, MH',
      to: 'New Delhi, DL',
      class: 'Business',
      passengers: 1,
      totalPrice: 3500,
      status: 'upcoming'
    },
    {
      id: 'B002',
      trainId: 'T789',
      trainName: 'Howrah Rajdhani',
      trainNumber: '12301',
      date: '2024-07-20',
      departureTime: '16:50',
      from: 'Howrah Junction, WB',
      to: 'New Delhi, DL',
      class: 'Economy',
      passengers: 2,
      totalPrice: 4400,
      status: 'upcoming'
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

// In a real application, this would be a database call.
// For this prototype, we'll just modify the in-memory array.
export function updateTrainAvailability(trainId: string, className: 'Economy' | 'Business' | 'First', passengers: number) {
    const train = trains.find(t => t.id === trainId);
    if (!train) return false;

    const trainClass = train.classes.find(c => c.name === className);
    if (!trainClass) return false;

    if (trainClass.availability < passengers) return false;

    trainClass.availability -= passengers;
    return true;
}
