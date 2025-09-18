export type TrainClass = {
  name: 'Economy' | 'Business' | 'First';
  availability: number;
  price: number;
};

export type Train = {
  id: string;
  name: string;
  number: string;
  from: string;
  to: string;
  departureTime: string; // "HH:MM"
  arrivalTime: string; // "HH:MM"
  duration: string; // "Xh Ym"
  classes: TrainClass[];
};

export type Booking = {
  id: string;
  trainName: string;
  trainNumber: string;
  date: string;
  from: string;
  to: string;
  passengers: number;
  totalPrice: number;
  class: TrainClass['name'];
};

export type User = {
  name: string;
  email: string;
  bookings: Booking[];
};
