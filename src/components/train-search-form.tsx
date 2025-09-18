"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from 'next/navigation';
import { format } from "date-fns";
import { CalendarIcon, Search } from "lucide-react";

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
import { stations } from '@/lib/data';
import { cn } from "@/lib/utils";
import { Card } from "./ui/card";

const FormSchema = z.object({
  from: z.string({
    required_error: "Please select a departure station.",
  }),
  to: z.string({
    required_error: "Please select an arrival station.",
  }),
  date: z.date({
    required_error: "A date of travel is required.",
  }),
});

export function TrainSearchForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: new Date(),
    }
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const params = new URLSearchParams({
        from: data.from,
        to: data.to,
        date: format(data.date, 'yyyy-MM-dd'),
    });
    router.push(`/search?${params.toString()}`);
  }

  return (
    <Card className="w-full max-w-4xl shadow-2xl">
        <div className="p-6">
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <FormField
                control={form.control}
                name="from"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>From</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select departure" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {stations.map(station => (
                            <SelectItem key={station} value={station}>{station}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="to"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>To</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select arrival" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {stations.map(station => (
                            <SelectItem key={station} value={station}>{station}</SelectItem>
                        ))}
                        </SelectContent>
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
                    <FormLabel>Date</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={"outline"}
                            className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                            )}
                            >
                            {field.value ? (
                                format(field.value, "PPP")
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" size="lg" className="h-10">
                    <Search className="mr-2 h-4 w-4" /> Search Trains
                </Button>
            </form>
            </Form>
        </div>
    </Card>
  );
}
