"use client";

import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Clock, Ticket, TrainFront } from 'lucide-react';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import { collection, query, where } from 'firebase/firestore';

import { useCollection, useFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Train } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function SearchResults() {
    const searchParams = useSearchParams();
    const from = searchParams.get('from');
    const to = searchParams.get('to');
    const dateStr = searchParams.get('date');
    const { firestore } = useFirebase();

    const trainsQuery = useMemo(() => {
        if (!from || !to) return null;
        return query(
            collection(firestore, 'trains'),
            where('from', '==', from),
            where('to', '==', to)
        );
    }, [firestore, from, to]);

    const { data: results, isLoading } = useCollection<Train>(trainsQuery);

    if (!from || !to || !dateStr) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold">Invalid Search</h2>
                <p className="text-muted-foreground mt-2">Please provide departure, arrival, and date to search for trains.</p>
                <Button asChild className="mt-4">
                    <Link href="/">New Search</Link>
                </Button>
            </div>
        );
    }
    
    const date = parseISO(dateStr);
    const bookingDate = format(date, 'yyyy-MM-dd');

    return (
        <div className="container mx-auto py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline">Search Results</h1>
                <p className="text-muted-foreground text-lg">
                    Showing trains from <strong>{from}</strong> to <strong>{to}</strong> on <strong>{format(date, 'PPP')}</strong>
                </p>
            </div>

            {isLoading ? (
                <div className="grid gap-6">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                             <CardHeader className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 bg-muted/50 p-4">
                                <Skeleton className="h-8 w-1/2" />
                                <Skeleton className="h-8 w-1/3" />
                             </CardHeader>
                             <CardContent className="p-4 grid gap-4 md:grid-cols-3">
                                <Skeleton className="h-28 w-full" />
                                <Skeleton className="h-28 w-full" />
                                <Skeleton className="h-28 w-full" />
                             </CardContent>
                        </Card>
                    ))}
                </div>
            ) : results && results.length > 0 ? (
                <div className="grid gap-6">
                    {results.map((train: Train) => (
                        <Card key={train.id} className="overflow-hidden">
                            <CardHeader className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 bg-muted/50 p-4">
                                <div className="flex items-center gap-4">
                                    <TrainFront className="w-8 h-8 text-primary" />
                                    <div>
                                        <CardTitle className="text-xl">{train.name}</CardTitle>
                                        <p className="text-sm text-muted-foreground">#{train.number}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between md:justify-end gap-4">
                                    <div className="flex flex-col items-center">
                                        <span className="font-bold text-lg">{train.departureTime}</span>
                                        <span className="text-sm text-muted-foreground">{train.from.split(',')[0]}</span>
                                    </div>
                                    <div className="flex flex-col items-center text-muted-foreground">
                                        <Clock className="w-4 h-4 mb-1" />
                                        <span>{train.duration}</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <span className="font-bold text-lg">{train.arrivalTime}</span>
                                        <span className="text-sm text-muted-foreground">{train.to.split(',')[0]}</span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 grid gap-4 md:grid-cols-3">
                                {train.classes.map(cls => (
                                    <div key={cls.name} className="border rounded-lg p-4 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-semibold">{cls.name}</h4>
                                            {cls.availability > 0 ? (
                                                <>
                                                    <p className="text-sm text-green-600 font-medium mt-1">{cls.availability} seats available</p>
                                                    <p className="text-lg font-bold mt-2">${cls.price.toFixed(2)} <span className="text-sm font-normal text-muted-foreground">/ seat</span></p>
                                                </>
                                            ) : (
                                                <p className="text-sm text-red-600 font-medium mt-1">Not Available</p>
                                            )}
                                        </div>
                                        <Button asChild disabled={cls.availability === 0} className="mt-4">
                                            <Link href={`/book/${train.id}?class=${cls.name}&date=${bookingDate}`}>
                                                <Ticket className="w-4 h-4 mr-2" />
                                                Book Now
                                            </Link>
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border-2 border-dashed rounded-lg">
                    <h2 className="text-2xl font-semibold">No Trains Found</h2>
                    <p className="text-muted-foreground mt-2">Unfortunately, there are no trains available for this route on the selected date.</p>
                     <Button asChild className="mt-4">
                        <Link href="/">New Search</Link>
                    </Button>
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchResults />
        </Suspense>
    );
}

    