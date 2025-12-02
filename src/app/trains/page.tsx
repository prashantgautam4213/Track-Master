'use client';

import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Route, Search, Train, MapPin } from 'lucide-react';

import { getTrains, getStations } from '@/lib/data';
import type { Train as TrainType } from '@/lib/types';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TrainsPage() {
  const [fromStation, setFromStation] = useState<string | undefined>();
  const [toStation, setToStation] = useState<string | undefined>();
  const [allTrains, setAllTrains] = useState<TrainType[]>([]);
  const [stations, setStations] = useState<string[]>([]);
  
  useEffect(() => {
    async function loadData() {
      const [trainsData, stationsData] = await Promise.all([getTrains(), getStations()]);
      setAllTrains(trainsData);
      setStations(stationsData);
    }
    loadData();
  }, []);
  
  const filteredTrains = useMemo(() => {
    let results = allTrains;

    if (fromStation) {
      results = results.filter(train => train.from === fromStation);
    }
    if (toStation) {
      results = results.filter(train => train.to === toStation);
    }

    return results;
  }, [allTrains, fromStation, toStation]);
  
  const TrainCard = ({ train }: { train: TrainType }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
      className="bg-card rounded-lg border shadow-sm transition-all"
    >
      <CardHeader className="p-4 border-b">
        <CardTitle className="flex items-center gap-3">
          <Train className="w-6 h-6 text-primary" />
          <div className="flex-1">
            <p className="text-lg font-semibold">{train.name}</p>
            <p className="text-sm text-muted-foreground">#{train.number}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between text-sm mb-4">
          <div className="flex items-center gap-2">
            <Route className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{train.from} &rarr; {train.to}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>{train.duration}</span>
          </div>
        </div>
        <div className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
            <div>
              <p className="text-xs text-muted-foreground">Departure</p>
              <p className="font-semibold text-base">{train.departureTime}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground text-right">Arrival</p>
              <p className="font-semibold text-base text-right">{train.arrivalTime}</p>
            </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
              {train.classes.map(c => c.availability > 0 && (
                <Badge key={c.name} variant="outline">{c.name}</Badge>
              ))}
          </div>
          <span className="text-xs font-semibold text-primary hover:underline cursor-pointer">
            View Details
          </span>
        </div>
      </CardContent>
    </motion.div>
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Filtering is already handled by the useMemo hook based on state changes.
    // This function just prevents the page from reloading.
  };

  return (
    <div className="bg-slate-50/50 min-h-full">
      <header className="bg-primary/5">
        <div className="container mx-auto py-8">
          <h1 className="text-4xl font-bold font-headline text-center text-primary-foreground">
            All Train Schedules
          </h1>
          <p className="text-lg text-muted-foreground text-center mt-2">
            Browse and search for trains across all our routes.
          </p>
        </div>
      </header>
      
      <div className="container mx-auto py-8 -mt-12">
        <Card className="shadow-lg mb-8">
          <form onSubmit={handleSubmit}>
            <CardContent className="p-4 flex flex-col md:flex-row items-center gap-4">
              <div className="w-full flex-1 grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Select value={fromStation} onValueChange={(value) => setFromStation(value === 'all' ? undefined : value)}>
                    <SelectTrigger className="pl-10 h-12 text-base">
                      <SelectValue placeholder="From station..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stations</SelectItem>
                      {stations.map(station => (
                        <SelectItem key={`from-${station}`} value={station}>{station}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Select value={toStation} onValueChange={(value) => setToStation(value === 'all' ? undefined : value)}>
                    <SelectTrigger className="pl-10 h-12 text-base">
                      <SelectValue placeholder="To station..." />
                    </Trigger>
                    <SelectContent>
                       <SelectItem value="all">All Stations</SelectItem>
                      {stations.map(station => (
                        <SelectItem key={`to-${station}`} value={station}>{station}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" size="lg" className="w-full md:w-auto h-12 bg-accent text-accent-foreground hover:bg-accent/90 text-base shadow-md">
                <Search className="mr-2 h-5 w-5" />
                Find Trains
              </Button>
            </CardContent>
          </form>
        </Card>

        {filteredTrains.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrains.map((train) => (
              <TrainCard key={train.id} train={train} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold">No Trains Found</h3>
            <p className="text-muted-foreground mt-2">
              No schedules match your search criteria. Try a different route.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
