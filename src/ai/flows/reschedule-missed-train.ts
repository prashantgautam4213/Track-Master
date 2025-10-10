'use server';

/**
 * @fileOverview A flow to handle rescheduling a missed train.
 *
 * - rescheduleMissedTrain - Finds and books the next available train for a missed booking.
 * - RescheduleMissedTrainInput - The input type for the rescheduleMissedTrain function.
 * - RescheduleMissedTrainOutput - The return type for the rescheduleMissedTrain function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Booking, Train } from '@/lib/types';
import {v4 as uuidv4} from 'uuid';

// We have to define the schemas for complex types manually for Zod
const TrainClassSchema = z.object({
  name: z.enum(['Economy', 'Business', 'First']),
  availability: z.number(),
  price: z.number(),
});

const TrainSchema = z.object({
  id: z.string(),
  name: z.string(),
  number: z.string(),
  from: z.string(),
  to: z.string(),
  departureTime: z.string(),
  arrivalTime: z.string(),
  duration: z.string(),
  classes: z.array(TrainClassSchema),
});

const BookingSchema = z.object({
  id: z.string(),
  trainId: z.string(),
  trainName: z.string(),
  trainNumber: z.string(),
  date: z.string(),
  departureTime: z.string(),
  from: z.string(),
  to: z.string(),
  passengers: z.number(),
  totalPrice: z.number(),
  class: z.enum(['Economy', 'Business', 'First']),
  status: z.optional(z.enum(['upcoming', 'missed-rescheduled', 'missed-failed'])),
});


const RescheduleMissedTrainInputSchema = z.object({
  missedBooking: BookingSchema,
  allTrains: z.array(TrainSchema),
  userId: z.string(),
});
export type RescheduleMissedTrainInput = z.infer<typeof RescheduleMissedTrainInputSchema>;

const RescheduleMissedTrainOutputSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  newBooking: BookingSchema.optional(),
});
export type RescheduleMissedTrainOutput = z.infer<typeof RescheduleMissedTrainOutputSchema>;

const rescheduleMissedTrainFlow = ai.defineFlow(
  {
    name: 'rescheduleMissedTrainFlow',
    inputSchema: RescheduleMissedTrainInputSchema,
    outputSchema: RescheduleMissedTrainOutputSchema,
  },
  async ({ missedBooking, allTrains }) => {
    const missedDepartureTime = new Date(`${missedBooking.date}T${missedBooking.departureTime}`).getTime();

    const sameDayTrains = allTrains.filter(train => {
      const departureTime = new Date(`${missedBooking.date}T${train.departureTime}`).getTime();
      return (
        train.from === missedBooking.from &&
        train.to === missedBooking.to &&
        departureTime > missedDepartureTime
      );
    });

    if (sameDayTrains.length === 0) {
      return {
        success: false,
        message: "No alternative trains found for the same day. Please contact customer support for further assistance.",
      };
    }

    // Find the next available train with seats in any class
    let newTrain: Train | undefined;
    let newClass: z.infer<typeof TrainClassSchema> | undefined;

    for (const train of sameDayTrains) {
      // Prefer same class or better
      const preferredClasses = 
        missedBooking.class === 'Economy' ? ['Economy', 'Business', 'First'] :
        missedBooking.class === 'Business' ? ['Business', 'First'] : ['First'];

      for (const className of preferredClasses) {
        const trainClass = train.classes.find(c => c.name === className);
        if (trainClass && trainClass.availability >= missedBooking.passengers) {
            newTrain = train;
            newClass = trainClass;
            break;
        }
      }
      if (newTrain) break;
    }

    if (!newTrain || !newClass) {
        return {
            success: false,
            message: "Found alternative trains, but none have sufficient seat availability. Please contact customer support.",
        };
    }
    
    // Create a new booking object
    // In a real application, this would be an atomic database transaction
    // to decrement seat availability and create the new booking.
    const newBooking: Booking = {
        id: missedBooking.id, // Use the same ID to ensure replacement
        trainId: newTrain.id,
        trainName: newTrain.name,
        trainNumber: newTrain.number,
        date: missedBooking.date,
        departureTime: newTrain.departureTime,
        from: newTrain.from,
        to: newTrain.to,
        class: newClass.name,
        passengers: missedBooking.passengers,
        totalPrice: newClass.price * missedBooking.passengers,
        status: 'missed-rescheduled', // Set status to 'missed-rescheduled'
    };
    
    // Here you would update the database:
    // 1. Decrement availability for `newTrain` in `newClass`.
    // 2. Add `newBooking` to the user's bookings.
    // 3. Update the status of `missedBooking` to `missed-rescheduled`.
    
    return {
      success: true,
      message: `Successfully rescheduled to ${newTrain.name}.`,
      newBooking,
    };
  }
);

export async function rescheduleMissedTrain(input: RescheduleMissedTrainInput): Promise<RescheduleMissedTrainOutput> {
  return rescheduleMissedTrainFlow(input);
}
