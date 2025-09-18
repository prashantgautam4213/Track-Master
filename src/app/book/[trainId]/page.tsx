"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { format, parseISO } from 'date-fns';
import { ArrowLeft, BaggageClaim, Calendar, Clock, Minus, Plus, TrainFront, Users } from 'lucide-react';

import { trains, updateTrainAvailability } from '@/lib/data';
import type { Train, TrainClass, Booking } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function BookingComponent() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    const { isAuthenticated, user, addBooking } = useAuth();
    const { toast } = useToast();

    const [train, setTrain] = useState<Train | null>(null);
    const [trainClass, setTrainClass] = useState<TrainClass | null>(null);
    const [date, setDate] = useState<Date | null>(null);
    const [passengers, setPassengers] = useState(1);
    const [isBooking, setIsBooking] = useState(false);

    const trainId = params.trainId as string;
    const className = searchParams.get('class') as TrainClass['name'];
    const dateStr = searchParams.get('date');

    useEffect(() => {
        if (!isAuthenticated) {
            const currentPath = `/book/${trainId}?${searchParams.toString()}`;
            // In a real app, you might want to store the intended destination
            // to redirect back after login. For now, just go to login.
            router.push('/login');
        }
    }, [isAuthenticated, router, trainId, searchParams]);

    useEffect(() => {
        const foundTrain = trains.find(t => t.id === trainId);
        if (foundTrain) {
            setTrain(foundTrain);
            const foundClass = foundTrain.classes.find(c => c.name === className);
            setTrainClass(foundClass || null);
        }
        if (dateStr) {
            setDate(parseISO(dateStr));
        }
    }, [trainId, className, dateStr]);

    const handleBooking = () => {
        if (!train || !trainClass || !date) return;
        setIsBooking(true);

        // In a real app, this would be an atomic transaction
        const success = updateTrainAvailability(train.id, trainClass.name, passengers);

        if (success) {
            const newBooking: Booking = {
                id: uuidv4(),
                trainId: train.id,
                trainName: train.name,
                trainNumber: train.number,
                date: format(date, 'yyyy-MM-dd'),
                departureTime: train.departureTime,
                from: train.from,
                to: train.to,
                passengers,
                totalPrice: trainClass.price * passengers,
                class: trainClass.name,
                status: 'upcoming',
            };

            addBooking(newBooking);

            toast({
                title: 'Booking Successful!',
                description: `Your trip from ${train.from} to ${train.to} is confirmed.`,
            });

            router.push('/profile');
        } else {
            toast({
                variant: 'destructive',
                title: 'Booking Failed',
                description: 'Seats are no longer available. Please try another search.',
            });
            // Force a refresh of search data if we had a real API
            setIsBooking(false);
        }
    };
    
    if (!isAuthenticated) {
        return <div className="flex items-center justify-center h-full"><p>Redirecting to login...</p></div>;
    }

    if (!train || !trainClass || !date) {
        return (
            <div className="container mx-auto py-10 text-center">
                <h2 className="text-2xl font-semibold">Booking details not found.</h2>
                <p className="text-muted-foreground mt-2">The train or class you selected is not available.</p>
                <Button asChild className="mt-4">
                    <Link href="/"><ArrowLeft className="mr-2 h-4 w-4" />Back to Search</Link>
                </Button>
            </div>
        )
    }

    const maxPassengers = Math.min(trainClass.availability, 10); // Limit to 10 tickets per booking

    return (
        <div className="container mx-auto max-w-4xl py-10">
            <Link href={`/search?from=${train.from}&to=${train.to}&date=${format(date, 'yyyy-MM-dd')}`} className="inline-flex items-center text-sm text-primary hover:underline mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to search results
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-headline">Confirm Your Booking</CardTitle>
                    <CardDescription>Review your trip details and confirm your reservation.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8 pt-6">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                             <TrainFront className="w-8 h-8 text-primary" />
                             <div>
                                <h3 className="text-xl font-bold">{train.name} <span className="font-normal text-muted-foreground">#{train.number}</span></h3>
                                <p className="font-semibold">{train.from} &rarr; {train.to}</p>
                             </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground"/>
                                <div>
                                    <p className="text-muted-foreground">Date</p>
                                    <p className="font-medium">{format(date, 'PPP')}</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground"/>
                                <div>
                                    <p className="text-muted-foreground">Departure</p>
                                    <p className="font-medium">{train.departureTime}</p>
                                </div>
                            </div>
                             <div className="flex items-center gap-2">
                                <BaggageClaim className="w-4 h-4 text-muted-foreground"/>
                                <div>
                                    <p className="text-muted-foreground">Class</p>
                                    <p className="font-medium">{trainClass.name}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-muted-foreground"/>
                                <div>
                                    <p className="text-muted-foreground">Available Seats</p>
                                    <p className="font-medium">{trainClass.availability}</p>
                                </div>
                            </div>
                        </div>
                         <Separator />
                         <div className="space-y-4">
                            <h4 className="font-semibold">Select Passengers</h4>
                             <div className="flex items-center gap-4">
                                 <Button variant="outline" size="icon" onClick={() => setPassengers(p => Math.max(1, p - 1))} disabled={passengers <= 1}>
                                    <Minus className="h-4 w-4" />
                                 </Button>
                                 <span className="font-bold text-lg w-10 text-center">{passengers}</span>
                                  <Button variant="outline" size="icon" onClick={() => setPassengers(p => Math.min(maxPassengers, p + 1))} disabled={passengers >= maxPassengers}>
                                    <Plus className="h-4 w-4" />
                                 </Button>
                                 {passengers === maxPassengers && <p className="text-sm text-muted-foreground">Maximum of {maxPassengers} passengers.</p>}
                             </div>
                         </div>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-6 flex flex-col justify-between">
                        <div>
                            <h3 className="text-lg font-bold mb-4">Price Summary</h3>
                            <div className="flow-root text-sm">
                                <dl className="space-y-2">
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">Seat Price</dt>
                                        <dd>${trainClass.price.toFixed(2)}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-muted-foreground">Passengers</dt>
                                        <dd>x {passengers}</dd>
                                    </div>
                                </dl>
                            </div>
                             <Separator className="my-4"/>
                             <div className="flex justify-between items-center">
                                <p className="text-lg font-bold">Total Price</p>
                                <p className="text-2xl font-bold text-primary">${(trainClass.price * passengers).toFixed(2)}</p>
                             </div>
                        </div>
                        <Alert className="mt-4">
                            <AlertTitle>Confirm and Pay</AlertTitle>
                            <AlertDescription>
                                Clicking "Confirm Booking" will finalize your reservation. Payment processing is mocked for this demo.
                            </AlertDescription>
                        </Alert>
                    </div>

                </CardContent>
                <CardFooter>
                    <Button size="lg" className="w-full md:w-auto ml-auto" onClick={handleBooking} disabled={isBooking}>
                        {isBooking ? 'Processing...' : 'Confirm Booking'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default function BookingPage() {
    return (
        <Suspense fallback={<div className="container mx-auto py-10">Loading booking details...</div>}>
            <BookingComponent />
        </Suspense>
    )
}
