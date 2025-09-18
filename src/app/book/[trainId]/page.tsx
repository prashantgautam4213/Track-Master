"use client";

import { useEffect, useState, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { format, parseISO } from 'date-fns';
import { ArrowLeft, BaggageClaim, Calendar, Clock, Minus, Plus, TrainFront, Users, CreditCard, Landmark, QrCode, Tag, Sparkles } from 'lucide-react';

import { trains, updateTrainAvailability } from '@/lib/data';
import type { Train, TrainClass, Booking } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';

const MOCK_COUPON_CODE = 'DEMO20';
const MOCK_COUPON_DISCOUNT = 0.2; // 20%

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
    
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [couponError, setCouponError] = useState('');

    const trainId = params.trainId as string;
    const className = searchParams.get('class') as TrainClass['name'];
    const dateStr = searchParams.get('date');

    useEffect(() => {
        if (!isAuthenticated) {
            const currentPath = `/book/${trainId}?${searchParams.toString()}`;
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
    
    const basePrice = useMemo(() => {
        if (!trainClass) return 0;
        return trainClass.price * passengers;
    }, [trainClass, passengers]);
    
    const discount = useMemo(() => {
        if (!couponApplied) return 0;
        return basePrice * MOCK_COUPON_DISCOUNT;
    }, [basePrice, couponApplied]);

    const totalPrice = useMemo(() => basePrice - discount, [basePrice, discount]);

    const handleApplyCoupon = () => {
        setCouponError('');
        if (couponCode.toUpperCase() === MOCK_COUPON_CODE) {
            setCouponApplied(true);
            toast({ title: 'Coupon Applied!', description: `You received a ${MOCK_COUPON_DISCOUNT * 100}% discount.` });
        } else {
            setCouponError('Invalid coupon code.');
            setCouponApplied(false);
        }
    };


    const handleBooking = () => {
        if (!train || !trainClass || !date) return;
        setIsBooking(true);

        // Simulate payment processing
        setTimeout(() => {
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
                    totalPrice: totalPrice,
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
                setIsBooking(false);
            }
        }, 1500); // 1.5 second delay to simulate payment
    };
    
    if (!isAuthenticated) {
        return <div className="flex items-center justify-center h-full"><p>Redirecting to login...</p></div>;
    }

    if (!train || !trainClass || !date) {
        return (
            <div className="container mx-auto py-10 text-center">
                <Skeleton className="h-8 w-64 mx-auto" />
                <Skeleton className="h-4 w-80 mx-auto mt-4" />
                <div className="mt-8">
                     <Button disabled><ArrowLeft className="mr-2 h-4 w-4" />Back to Search</Button>
                </div>
            </div>
        )
    }

    const maxPassengers = Math.min(trainClass.availability, 10);

    return (
        <div className="container mx-auto max-w-6xl py-10">
            <Link href={`/search?from=${train.from}&to=${train.to}&date=${format(date, 'yyyy-MM-dd')}`} className="inline-flex items-center text-sm text-primary hover:underline mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to search results
            </Link>

            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-headline">Confirm Your Booking</CardTitle>
                    <CardDescription>Review your trip details and complete your payment.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
                    {/* Trip Details */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="flex items-center gap-4">
                             <TrainFront className="w-8 h-8 text-primary" />
                             <div>
                                <h3 className="text-xl font-bold">{train.name} <span className="font-normal text-muted-foreground">#{train.number}</span></h3>
                                <p className="font-semibold">{train.from} &rarr; {train.to}</p>
                             </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-muted-foreground"/><div><p className="text-muted-foreground">Date</p><p className="font-medium">{format(date, 'PPP')}</p></div></div>
                             <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-muted-foreground"/><div><p className="text-muted-foreground">Departure</p><p className="font-medium">{train.departureTime}</p></div></div>
                             <div className="flex items-center gap-2"><BaggageClaim className="w-4 h-4 text-muted-foreground"/><div><p className="text-muted-foreground">Class</p><p className="font-medium">{trainClass.name}</p></div></div>
                            <div className="flex items-center gap-2"><Users className="w-4 h-4 text-muted-foreground"/><div><p className="text-muted-foreground">Available</p><p className="font-medium">{trainClass.availability}</p></div></div>
                        </div>
                         <Separator />
                         <div className="space-y-4">
                            <h4 className="font-semibold">Select Passengers</h4>
                             <div className="flex items-center gap-4">
                                 <Button variant="outline" size="icon" onClick={() => setPassengers(p => Math.max(1, p - 1))} disabled={passengers <= 1}><Minus className="h-4 w-4" /></Button>
                                 <span className="font-bold text-lg w-10 text-center">{passengers}</span>
                                  <Button variant="outline" size="icon" onClick={() => setPassengers(p => Math.min(maxPassengers, p + 1))} disabled={passengers >= maxPassengers}><Plus className="h-4 w-4" /></Button>
                                 {passengers === maxPassengers && <p className="text-sm text-muted-foreground">Max {maxPassengers} passengers.</p>}
                             </div>
                         </div>
                    </div>

                    {/* Payment Details */}
                    <div className="lg:col-span-1 space-y-6">
                        <h3 className="text-xl font-bold">Payment Details</h3>
                        <RadioGroup defaultValue="upi" className="space-y-4">
                            <Label>Select Payment Method</Label>
                            <div className="flex items-center space-x-2 p-4 border rounded-md has-[:checked]:bg-primary/5 has-[:checked]:border-primary">
                                <RadioGroupItem value="upi" id="upi" />
                                <Label htmlFor="upi" className="flex items-center gap-3 cursor-pointer w-full"><Sparkles className="h-5 w-5 text-purple-500"/><div><p className="font-semibold">UPI</p><p className="text-xs text-muted-foreground">Pay with any UPI app</p></div></Label>
                            </div>
                            <div className="flex items-center space-x-2 p-4 border rounded-md has-[:checked]:bg-primary/5 has-[:checked]:border-primary">
                                <RadioGroupItem value="card" id="card" />
                                <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer w-full"><CreditCard className="h-5 w-5 text-blue-500"/><div><p className="font-semibold">Credit/Debit Card</p><p className="text-xs text-muted-foreground">Visa, Mastercard, etc.</p></div></Label>
                            </div>
                            <div className="flex items-center space-x-2 p-4 border rounded-md has-[:checked]:bg-primary/5 has-[:checked]:border-primary">
                                <RadioGroupItem value="netbanking" id="netbanking" />
                                <Label htmlFor="netbanking" className="flex items-center gap-3 cursor-pointer w-full"><Landmark className="h-5 w-5 text-green-500"/><div><p className="font-semibold">Net Banking</p><p className="text-xs text-muted-foreground">All major banks supported</p></div></Label>
                            </div>
                        </RadioGroup>
                         <div className="space-y-2">
                            <Label htmlFor="coupon">Coupon Code</Label>
                            <div className="flex space-x-2">
                                <Input id="coupon" placeholder="e.g. DEMO20" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} disabled={couponApplied}/>
                                <Button variant="outline" onClick={handleApplyCoupon} disabled={couponApplied || !couponCode}>
                                    {couponApplied ? 'Applied' : 'Apply'}
                                </Button>
                            </div>
                            {couponError && <p className="text-sm text-destructive">{couponError}</p>}
                        </div>
                    </div>

                    {/* Price Summary */}
                    <div className="bg-muted/50 rounded-lg p-6 flex flex-col justify-between lg:col-span-1">
                        <div>
                            <h3 className="text-lg font-bold mb-4">Price Summary</h3>
                            <div className="flow-root text-sm">
                                <dl className="space-y-2">
                                    <div className="flex justify-between"><dt className="text-muted-foreground">Seat Price</dt><dd>${trainClass.price.toFixed(2)}</dd></div>
                                    <div className="flex justify-between"><dt className="text-muted-foreground">Passengers</dt><dd>x {passengers}</dd></div>
                                    <div className="flex justify-between"><dt className="text-muted-foreground">Base Total</dt><dd>${basePrice.toFixed(2)}</dd></div>
                                    {couponApplied && (
                                        <div className="flex justify-between text-green-600"><dt>Coupon Discount</dt><dd>-${discount.toFixed(2)}</dd></div>
                                    )}
                                </dl>
                            </div>
                             <Separator className="my-4"/>
                             <div className="flex justify-between items-center">
                                <p className="text-lg font-bold">Total Price</p>
                                <p className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</p>
                             </div>
                        </div>
                        <Alert className="mt-4">
                            <AlertTitle>Confirm and Pay</AlertTitle>
                            <AlertDescription>
                                Payment processing is mocked for this demonstration. No real transaction will be made.
                            </AlertDescription>
                        </Alert>
                    </div>

                </CardContent>
                <CardFooter>
                    <Button size="lg" className="w-full md:w-auto ml-auto" onClick={handleBooking} disabled={isBooking}>
                        {isBooking ? 'Processing Payment...' : `Pay $${totalPrice.toFixed(2)} & Confirm`}
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

    