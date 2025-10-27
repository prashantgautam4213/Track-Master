'use client';

import { useMemo, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { trains, stations } from '@/lib/data';
import { ArrowDown, ArrowUp, ChevronsUpDown, Clock, Route, Train, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type SortKey = 'name' | 'departureTime' | 'duration' | 'from';

export default function TrainsPage() {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedStation, setSelectedStation] = useState<string>('All');

  const sortedTrains = useMemo(() => {
    const filteredTrains = selectedStation === 'All'
      ? trains
      : trains.filter(train => train.from === selectedStation);

    const sorted = [...filteredTrains].sort((a, b) => {
      switch (sortKey) {
        case 'duration':
          const durationA = parseInt(a.duration.split('h')[0]) * 60 + parseInt(a.duration.split('h')[1].replace('m', ''));
          const durationB = parseInt(b.duration.split('h')[0]) * 60 + parseInt(b.duration.split('h')[1].replace('m', ''));
          return durationA - durationB;
        case 'departureTime':
          return a.departureTime.localeCompare(b.departureTime);
        case 'from':
          return a.from.localeCompare(b.from);
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    if (sortOrder === 'desc') {
      return sorted.reverse();
    }
    return sorted;
  }, [sortKey, sortOrder, selectedStation]);
  
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

  const sortOptions: { key: SortKey, label: string, icon: React.ReactNode }[] = [
    { key: 'name', label: 'Train Name', icon: <Train /> },
    { key: 'from', label: 'Route', icon: <Route /> },
    { key: 'departureTime', label: 'Time', icon: <Clock /> },
    { key: 'duration', label: 'Duration', icon: <Clock /> },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold font-headline">Train Schedules</h1>
      </div>
      
      <div className="mb-4 space-y-4">
        <Card>
            <CardContent className="p-4 flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <label htmlFor="station-filter" className="text-sm font-medium">Filter by Departure Station:</label>
                </div>
                <Select value={selectedStation} onValueChange={setSelectedStation}>
                  <SelectTrigger id="station-filter" className="w-full md:w-[280px]">
                    <SelectValue placeholder="Select a station" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Stations</SelectItem>
                    {stations.map(station => (
                      <SelectItem key={station} value={station}>{station}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="p-4 flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium mr-2">Sort by:</span>
                {sortOptions.map(option => (
                    <Button key={option.key} variant={sortKey === option.key ? 'default' : 'outline'} onClick={() => handleSort(option.key)}>
                        {option.icon}
                        {option.label}
                        {sortKey === option.key && (sortOrder === 'asc' ? <ArrowUp className="ml-2 h-4 w-4" /> : <ArrowDown className="ml-2 h-4 w-4" />)}
                    </Button>
                ))}
            </CardContent>
        </Card>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <div className="flex items-center">
                  Train {getSortIcon('name')}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Route {getSortIcon('from')}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Timings {getSortIcon('departureTime')}
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center">
                  Duration {getSortIcon('duration')}
                </div>
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
                <TableCell colSpan={5} className="text-center h-24">
                  No train schedules found for the selected station.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
