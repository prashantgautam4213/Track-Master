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
    id: 'T123R',
    name: 'Delhi Rajdhani',
    number: '12952',
    from: 'New Delhi, DL',
    to: 'Mumbai Central, MH',
    departureTime: '16:55',
    arrivalTime: '08:15',
    duration: '15h 20m',
    classes: [
      { name: 'Economy', availability: 145, price: 2150 },
      { name: 'Business', availability: 35, price: 3550 },
      { name: 'First', availability: 8, price: 5450 },
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
    id: 'T124R',
    name: 'Delhi August Kranti',
    number: '12954',
    from: 'New Delhi, DL',
    to: 'Mumbai Central, MH',
    departureTime: '17:15',
    arrivalTime: '10:05',
    duration: '16h 50m',
    classes: [
      { name: 'Economy', availability: 110, price: 2050 },
      { name: 'Business', availability: 25, price: 3350 },
      { name: 'First', availability: 7, price: 5250 },
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
    id: 'T456R',
    name: 'Delhi-Bengaluru Rajdhani',
    number: '22692',
    from: 'New Delhi, DL',
    to: 'Bengaluru City, KA',
    departureTime: '20:45',
    arrivalTime: '06:40',
    duration: '33h 55m',
    classes: [
        { name: 'Economy', availability: 180, price: 2550 },
        { name: 'Business', availability: 45, price: 4250 },
        { name: 'First', availability: 12, price: 6050 },
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
    id: 'T457R',
    name: 'Karnataka Express Return',
    number: '12628',
    from: 'New Delhi, DL',
    to: 'Bengaluru City, KA',
    departureTime: '20:20',
    arrivalTime: '13:40',
    duration: '41h 20m',
    classes: [
      { name: 'Economy', availability: 15, price: 980 },
      { name: 'Business', availability: 8, price: 1950 },
      { name: 'First', availability: 3, price: 3450 },
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
    id: 'T789R',
    name: 'Delhi-Howrah Rajdhani',
    number: '12302',
    from: 'New Delhi, DL',
    to: 'Howrah Junction, WB',
    departureTime: '16:55',
    arrivalTime: '09:55',
    duration: '17h 00m',
    classes: [
        { name: 'Economy', availability: 10, price: 2250 },
        { name: 'Business', availability: 20, price: 3850 },
        { name: 'First', availability: 10, price: 5850 },
    ],
  },
  {
    id: 'T790',
    name: 'Poorva Express',
    number: '12303',
    from: 'Howrah Junction, WB',
    to: 'New Delhi, DL',
    departureTime: '08:00',
    arrivalTime: '06:00',
    duration: '22h 00m',
    classes: [
      { name: 'Economy', availability: 300, price: 850 },
      { name: 'Business', availability: 100, price: 1500 },
      { name: 'First', availability: 30, price: 2800 },
    ],
  },
  {
    id: 'T790R',
    name: 'Poorva Express Return',
    number: '12304',
    from: 'New Delhi, DL',
    to: 'Howrah Junction, WB',
    departureTime: '17:40',
    arrivalTime: '17:00',
    duration: '23h 20m',
    classes: [
      { name: 'Economy', availability: 280, price: 870 },
      { name: 'Business', availability: 90, price: 1550 },
      { name: 'First', availability: 25, price: 2850 },
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
    id: 'T101R',
    name: 'Delhi-Secunderabad Duronto',
    number: '12286',
    from: 'New Delhi, DL',
    to: 'Secunderabad Jn, TS',
    departureTime: '15:55',
    arrivalTime: '14:50',
    duration: '22h 55m',
    classes: [
      { name: 'Economy', availability: 70, price: 1850 },
      { name: 'Business', availability: 15, price: 3250 },
      { name: 'First', availability: 4, price: 5050 },
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
  {
    id: 'T601',
    name: 'Grand Trunk Express',
    number: '12615',
    from: 'Chennai Central, TN',
    to: 'New Delhi, DL',
    departureTime: '18:50',
    arrivalTime: '05:05',
    duration: '34h 15m',
    classes: [
        { name: 'Economy', availability: 250, price: 1000 },
        { name: 'Business', availability: 80, price: 2500 },
        { name: 'First', availability: 20, price: 4500 },
    ],
  },
  {
    id: 'T601R',
    name: 'Grand Trunk Express',
    number: '12616',
    from: 'New Delhi, DL',
    to: 'Chennai Central, TN',
    departureTime: '16:10',
    arrivalTime: '04:30',
    duration: '36h 20m',
    classes: [
        { name: 'Economy', availability: 240, price: 1020 },
        { name: 'Business', availability: 75, price: 2550 },
        { name: 'First', availability: 18, price: 4550 },
    ],
  },
  {
    id: 'T501',
    name: 'Pune-Secunderabad Shatabdi',
    number: '12025',
    from: 'Pune Junction, MH',
    to: 'Secunderabad Jn, TS',
    departureTime: '06:00',
    arrivalTime: '14:20',
    duration: '8h 20m',
    classes: [
      { name: 'Economy', availability: 90, price: 1200 },
      { name: 'Business', availability: 30, price: 2000 },
      { name: 'First', availability: 0, price: 3000 },
    ],
  },
  {
    id: 'T501R',
    name: 'Secunderabad-Pune Shatabdi',
    number: '12026',
    from: 'Secunderabad Jn, TS',
    to: 'Pune Junction, MH',
    departureTime: '14:45',
    arrivalTime: '23:10',
    duration: '8h 25m',
    classes: [
      { name: 'Economy', availability: 85, price: 1250 },
      { name: 'Business', availability: 25, price: 2050 },
      { name: 'First', availability: 5, price: 3050 },
    ],
  },
  {
    id: 'T502',
    name: 'Ahmedabad-Mumbai Shatabdi',
    number: '12009',
    from: 'Ahmedabad Junction, GJ',
    to: 'Mumbai Central, MH',
    departureTime: '06:10',
    arrivalTime: '12:45',
    duration: '6h 35m',
    classes: [
      { name: 'Economy', availability: 110, price: 1100 },
      { name: 'Business', availability: 40, price: 2200 },
      { name: 'First', availability: 10, price: 3300 },
    ],
  },
  {
    id: 'T502R',
    name: 'Mumbai-Ahmedabad Shatabdi',
    number: '12010',
    from: 'Mumbai Central, MH',
    to: 'Ahmedabad Junction, GJ',
    departureTime: '17:30',
    arrivalTime: '23:55',
    duration: '6h 25m',
    classes: [
        { name: 'Economy', availability: 100, price: 1150 },
        { name: 'Business', availability: 35, price: 2250 },
        { name: 'First', availability: 8, price: 3350 },
    ],
  },
  {
    id: 'T503',
    name: 'Karnavati Express',
    number: '12934',
    from: 'Ahmedabad Junction, GJ',
    to: 'Mumbai Central, MH',
    departureTime: '05:00',
    arrivalTime: '12:25',
    duration: '7h 25m',
    classes: [
        { name: 'Economy', availability: 200, price: 600 },
        { name: 'Business', availability: 50, price: 1300 },
        { name: 'First', availability: 0, price: 2500 },
    ],
  },
  {
    id: 'T503R',
    name: 'Karnavati Express Return',
    number: '12933',
    from: 'Mumbai Central, MH',
    to: 'Ahmedabad Junction, GJ',
    departureTime: '14:05',
    arrivalTime: '21:05',
    duration: '7h 00m',
    classes: [
        { name: 'Economy', availability: 190, price: 620 },
        { name: 'Business', availability: 45, price: 1350 },
        { name: 'First', availability: 10, price: 2550 },
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
