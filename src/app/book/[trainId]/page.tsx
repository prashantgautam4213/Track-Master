
import { Suspense } from 'react';
import BookingComponent from '@/components/booking-component';

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-10">Loading booking details...</div>}>
      <BookingComponent />
    </Suspense>
  );
}
