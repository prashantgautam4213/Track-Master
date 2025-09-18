import { CircleDollarSign } from 'lucide-react';
import { FareEnquiryForm } from '@/components/fare-enquiry-form';

export default function FareEnquiryPage() {
  return (
    <div className="container mx-auto py-10 max-w-3xl">
      <div className="flex flex-col items-center text-center mb-8">
        <CircleDollarSign className="w-16 h-16 text-primary mb-4" />
        <h1 className="text-4xl font-bold font-headline">AI-Powered Fare Enquiry</h1>
        <p className="text-muted-foreground mt-2 text-lg max-w-2xl">
          Get detailed fare estimates for your trip. Our AI assistant analyzes various factors to give you a comprehensive overview of potential prices and discounts.
        </p>
      </div>
      <FareEnquiryForm />
    </div>
  );
}
