
export type TrainClass = {
  name: '1AC' | '2AC' | '3AC' | '3AC Eco' | 'Sleeper';
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
  user_id?: string; // Foreign key to auth.users
  trainId: string;
  trainName: string;
  trainNumber: string;
  date: string; // YYYY-MM-DD
  departureTime: string; // HH:MM
  from: string;
  to: string;
  passengers: number;
  totalPrice: number;
  class: TrainClass['name'];
  status?: 'upcoming' | 'missed-rescheduled' | 'missed-failed';
};

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
};
