import Link from 'next/link';
import { Ticket } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto py-6 px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2">
            <Ticket className="h-6 w-6 text-primary" />
            <p className="text-lg font-bold font-headline">Track Master</p>
          </div>
          <p className="text-sm text-muted-foreground mt-4 md:mt-0">
            © {new Date().getFullYear()} Track Master. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
