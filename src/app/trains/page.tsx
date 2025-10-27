'use client';

import { useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Train } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function TrainsPage() {
  const { firestore } = useFirebase();
  const trainsQuery = useMemoFirebase(() => query(collection(firestore, 'trains')), [firestore]);
  const { data: trains, isLoading } = useCollection<Train>(trainsQuery);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold font-headline mb-8">Train Schedules</h1>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Train</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Timings</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Classes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-16" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-5 w-36 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : trains ? (
              trains.map((train) => (
                <TableRow key={train.id}>
                  <TableCell>
                    <div className="font-medium">{train.name}</div>
                    <div className="text-sm text-muted-foreground">#{train.number}</div>
                  </TableCell>
                  <TableCell>
                    {train.from} to {train.to}
                  </TableCell>
                  <TableCell>
                    {train.departureTime} - {train.arrivalTime}
                  </TableCell>
                  <TableCell>{train.duration}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      {train.classes.map(
                        (c) => c.availability > 0 && <Badge key={c.name} variant="outline">{c.name}</Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No train schedules available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
