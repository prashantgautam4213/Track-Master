import type { Train } from './types';
import { supabase } from './supabase-client';

export async function getStations() {
  const { data, error } = await supabase.from('stations').select('name');
  if (error) {
    console.error('Error fetching stations:', error);
    return [];
  }
  return data.map(s => s.name);
}

export async function getTrains(from?: string, to?: string): Promise<Train[]> {
  let query = supabase
    .from('trains')
    .select(`
      id,
      name,
      number,
      from_station,
      to_station,
      departure_time,
      arrival_time,
      duration,
      train_classes (
        class_name,
        availability,
        price
      )
    `);

  if (from) {
    query = query.eq('from_station', from);
  }
  if (to) {
    query = query.eq('to_station', to);
  }

  const { data: trainsData, error } = await query;

  if (error) {
    console.error('Error fetching trains:', error);
    return [];
  }
  
  return trainsData.map((train: any) => ({
    id: train.id,
    name: train.name,
    number: train.number,
    from: train.from_station,
    to: train.to_station,
    departureTime: train.departure_time,
    arrivalTime: train.arrival_time,
    duration: train.duration,
    classes: train.train_classes.map((c: any) => ({
      name: c.class_name,
      availability: c.availability,
      price: c.price,
    })),
  }));
}

export async function getTrainById(trainId: string): Promise<Train | null> {
    const { data, error } = await supabase
    .from('trains')
    .select(`
        id,
        name,
        number,
        from_station,
        to_station,
        departure_time,
        arrival_time,
        duration,
        train_classes (
            class_name,
            availability,
            price
        )
    `)
    .eq('id', trainId)
    .single();

  if (error) {
    console.error('Error fetching train by id:', error);
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    number: data.number,
    from: data.from_station,
    to: data.to_station,
    departureTime: data.departure_time,
    arrivalTime: data.arrival_time,
    duration: data.duration,
    classes: data.train_classes.map((c: any) => ({
        name: c.class_name,
        availability: c.availability,
        price: c.price,
    })),
  };
}

export async function getNextAvailableTrain(booking: any) {
    const missedDepartureTime = new Date(`${booking.date}T${booking.departureTime}`).toISOString();
    
    const { data, error } = await supabase
        .from('trains')
        .select(`
            id, name, number, from_station, to_station, departure_time,
            train_classes (class_name, availability, price)
        `)
        .eq('from_station', booking.from)
        .eq('to_station', booking.to)
        .gt('departure_time', booking.departureTime)
        .order('departure_time', { ascending: true })
        .limit(1);

    if (error) {
        console.error('Error fetching next train:', error);
        return null;
    }
    
    if (!data || data.length === 0) return null;

    const nextTrain = data[0];
    
    return {
        id: nextTrain.id,
        name: nextTrain.name,
        number: nextTrain.number,
        from: nextTrain.from_station,
        to: nextTrain.to_station,
        departureTime: nextTrain.departure_time,
        classes: nextTrain.train_classes.map((c: any) => ({
            name: c.class_name,
            availability: c.availability,
            price: c.price,
        })),
    };
}
