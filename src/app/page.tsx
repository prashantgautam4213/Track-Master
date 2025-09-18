import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CircleDollarSign } from 'lucide-react';

import { TrainSearchForm } from '@/components/train-search-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'home-hero');

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[50vh] md:h-[60vh] text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative h-full flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">Your Journey Begins Here</h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-primary-foreground/90">
            Find and book your train tickets with ease. Explore schedules, check seat availability, and get the best fares.
          </p>
        </div>
      </section>

      <div className="w-full flex justify-center -mt-24 md:-mt-16 z-10 px-4">
        <TrainSearchForm />
      </div>

      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-primary/5 border-primary/20 shadow-lg">
            <div className="grid md:grid-cols-2 items-center">
                <div className="p-8 md:p-12">
                    <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground border border-accent/30 rounded-full px-4 py-1 text-sm font-medium">
                        <CircleDollarSign className="w-4 h-4" />
                        <span>AI-Powered Feature</span>
                    </div>
                    <h2 className="text-3xl font-bold font-headline mt-4 text-primary-foreground">
                        Intelligent Fare Enquiry
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        Use our generative AI tool to get detailed fare information for any route. It analyzes various factors to provide you with comprehensive price estimates and potential discounts.
                    </p>
                    <Button asChild size="lg" className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90">
                        <Link href="/fare-enquiry">
                            Try Fare Enquiry <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
                <div className="hidden md:flex justify-center items-center p-8">
                  <CircleDollarSign className="w-48 h-48 text-accent/50" />
                </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
