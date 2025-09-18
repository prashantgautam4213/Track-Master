"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { stations, trains } from '@/lib/data';
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./ui/card";
import { fareInformationLookup, FareInformationLookupOutput } from "@/ai/flows/fare-information-lookup";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Skeleton } from "./ui/skeleton";

const FormSchema = z.object({
  departureStation: z.string({ required_error: "Please select a departure station." }),
  arrivalStation: z.string({ required_error: "Please select an arrival station." }),
  trainClass: z.string({ required_error: "Please select a travel class." }),
  date: z.date({ required_error: "A date of travel is required." }),
});

export function FareEnquiryForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FareInformationLookupOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: new Date(),
    }
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const formattedData = {
        ...data,
        date: format(data.date, "yyyy-MM-dd"),
      };
      const response = await fareInformationLookup(formattedData);
      setResult(response);
    } catch (e) {
      setError("An error occurred while fetching fare information. Please try again.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const travelClasses = [...new Set(trains.flatMap(t => t.classes.map(c => c.name)))];

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="departureStation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Departure Station</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select departure" /></SelectTrigger></FormControl>
                      <SelectContent>{stations.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="arrivalStation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arrival Station</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select arrival" /></SelectTrigger></FormControl>
                      <SelectContent>{stations.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trainClass"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Travel Class</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger></FormControl>
                      <SelectContent>{travelClasses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date of Travel</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full" size="lg">
              {loading ? "Analyzing..." : "Get Fare Information"}
              {!loading && <Sparkles className="ml-2 h-4 w-4" />}
            </Button>
          </form>
        </Form>
        
        {(loading || result || error) && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Fare Analysis</h3>
            {loading && (
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            )}
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {result && (
              <Alert>
                <Sparkles className="h-4 w-4" />
                <AlertTitle>AI Generated Fare Information</AlertTitle>
                <AlertDescription>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {result.fareInformation.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
