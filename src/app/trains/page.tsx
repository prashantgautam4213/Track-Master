'use client';

import { useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { trains } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Train } from '@/lib/types';

type SortKey = 'name' | 'departureTime' | 'duration';

export default function TrainsPage() {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedTrains = useMemo(() => {
    const sorted = [...trains].sort((a, b) => {
      if (sortKey === 'duration') {
        const durationA = parseInt(a.duration.split('h')[0]) * 60 + parseInt(a.duration.split('h')[1].replace('m', ''));
        const durationB = parseInt(b.duration.split('h')[0]) * 60 + parseInt(b.duration.split('h')[1].replace('m', ''));
        return durationA - durationB;
      }
      if (sortKey === 'departureTime') {
        return a.departureTime.localeCompare(b.departureTime);
      }
      // default to name
      return a.name.localeCompare(b.name);
    });

    if (sortOrder === 'desc') {
      return sorted.reverse();
    }
    return sorted;
  }, [sortKey, sortOrder]);
  
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  }

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) {
      return <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground/50" />;
    }
    return sortOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-headline">Train Schedules</h1>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('name')}>
                  Train {getSortIcon('name')}
                </Button>
              </TableHead>
              <TableHead>Route</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('departureTime')}>
                  Timings {getSortIcon('departureTime')}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort('duration')}>
                  Duration {getSortIcon('duration')}
                </Button>
              </TableHead>
              <TableHead className="text-right">Classes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTrains.length > 0 ? (
              sortedTrains.map((train) => (
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
