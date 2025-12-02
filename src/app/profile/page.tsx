'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Ticket } from 'lucide-react';
import type { Booking } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { getNextAvailableTrain } from '@/lib/data';
import { v4 as uuidv4 } from 'uuid';

const Badge = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'destructive' | 'outline' }) => {
  const baseClasses = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold';
  const variantClasses = {
    default: 'bg-primary text-primary-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
    outline: 'text-foreground',
  };
  const variant = props.variant || 'default';
  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props} />;
};

export default function ProfilePage() {
  const { isAuthenticated, user, bookings, updateBooking, addBooking } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isRescheduling, setIsRescheduling] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleReschedule = async (booking: Booking) => {
    if (!user) return;
    setIsRescheduling(booking.id);

    try {
      const nextTrain = await getNextAvailableTrain(booking);
      
      let newBooking: Omit<Booking, 'id'> | undefined;
      let message = "No alternative trains found for the same day.";
      let success = false;

      if (nextTrain) {
          const sameClass = nextTrain.classes.find(c => c.name === booking.class && c.availability >= booking.passengers);
          if (sameClass) {
              newBooking = {
                  user_id: user.uid,
                  trainId: nextTrain.id,
                  trainName: nextTrain.name,
                  trainNumber: nextTrain.number,
                  date: booking.date,
                  departureTime: nextTrain.departureTime,
                  from: nextTrain.from,
                  to: nextTrain.to,
                  passengers: booking.passengers,
                  totalPrice: sameClass.price * booking.passengers,
                  class: sameClass.name,
                  status: 'upcoming'
              };
              success = true;
              message = `Successfully rescheduled to ${nextTrain.name}.`;
          } else {
              message = "Found alternative trains, but none have sufficient seat availability in the same class.";
          }
      }

      if (success && newBooking) {
          await addBooking(newBooking);
          await updateBooking(booking.id, { status: 'missed-rescheduled' });
          toast({
              title: 'Reschedule Successful',
              description: message,
          });
      } else {
          await updateBooking(booking.id, { status: 'missed-failed' });
          toast({
              variant: 'destructive',
              title: 'Reschedule Failed',
              description: message,
          });
      }
    } catch (error) {
        console.error("Rescheduling failed:", error);
        await updateBooking(booking.id, { status: 'missed-failed' });
        toast({
            variant: 'destructive',
            title: 'Reschedule Error',
            description: "An unexpected error occurred while trying to reschedule.",
        });
    } finally {
        setIsRescheduling(null);
    }
  };

  const getBookingStatus = (booking: Booking) => {
    const departureDateTime = new Date(`${booking.date}T${booking.departureTime}`);
    const isMissed = new Date() > departureDateTime;

    if (booking.status === 'missed-rescheduled') {
      return <Badge variant="default" className="bg-green-600">Rescheduled</Badge>;
    }
    if (booking.status === 'missed-failed') {
      return <Badge variant="destructive">Reschedule Failed</Badge>;
    }

    if (isMissed && booking.status === 'upcoming') {
      return (
        <Button
          size="sm"
          onClick={() => handleReschedule(booking)}
          disabled={isRescheduling === booking.id}
        >
          {isRescheduling === booking.id ? 'Rescheduling...' : 'Raise Missed Train Query'}
        </Button>
      );
    }
    
    if (isMissed && booking.status !== 'upcoming') {
         return <Badge variant="destructive">Missed</Badge>;
    }

    return <Badge variant="outline">Upcoming</Badge>;
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="text-3xl bg-primary/20 text-primary">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold font-headline">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Manage your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p>{user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p>{user.email}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <Button className="w-full" disabled>Update Profile</Button>
                <Button variant="outline" className="w-full" disabled>Change Password</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold font-headline mb-4">Booking History</h2>
          {bookings && bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((booking) => (
                  <Card key={booking.id} className={booking.status?.startsWith('missed') ? 'bg-muted/50' : ''}>
                    <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4">
                      <div className="flex gap-4 items-center">
                        <div className="bg-primary/10 p-3 rounded-lg">
                          <Ticket className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">
                            {booking.trainName} ({booking.trainNumber})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {booking.from} to {booking.to}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Date: {booking.date} at {booking.departureTime}
                          </p>
                          <p className="text-sm text-muted-foreground">{booking.class} class</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right space-y-2">
                        <p className="font-bold text-lg">₹{booking.totalPrice.toFixed(2)}</p>
                        {getBookingStatus(booking)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-lg">
              <h3 className="text-xl font-semibold">No Bookings Yet</h3>
              <p className="text-muted-foreground mt-2">Start your journey by searching for trains.</p>
              <Button asChild className="mt-4">
                <a href="/">Search Trains</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
