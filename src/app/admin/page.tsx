'use client';

import { useState } from 'react';
import { useFirebase } from '@/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { trains as mockTrains } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Database } from 'lucide-react';

export default function AdminPage() {
  const { firestore } = useFirebase();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleSeedDatabase = async () => {
    setIsLoading(true);
    try {
      if (!firestore) {
        toast({
          variant: 'destructive',
          title: 'Firestore not available',
          description: 'Please try again later.',
        });
        setIsLoading(false);
        return;
      }
      const trainsCollection = collection(firestore, 'trains');
      const batch = writeBatch(firestore);

      // Firestore batches are limited to 500 operations.
      // We can add logic to handle more if needed.
      if (mockTrains.length > 499) {
        throw new Error('Too many trains to seed in one batch.');
      }

      mockTrains.forEach(train => {
        // In Firestore, we use the train ID from the mock data
        // as the document ID for consistency.
        const docRef = doc(trainsCollection.firestore, trainsCollection.path, train.id);
        batch.set(docRef, train);
      });

      await batch.commit();

      toast({
        title: 'Database Seeded!',
        description: `${mockTrains.length} train documents have been added to Firestore.`,
      });
      setIsDone(true);
    } catch (error: any) {
      console.error('Error seeding database:', error);
      toast({
        variant: 'destructive',
        title: 'Error Seeding Database',
        description: error.message || 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-6 h-6" />
            Database Management
          </CardTitle>
          <CardDescription>
            Use this page to perform administrative database operations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold">Seed Train Data</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Click the button below to populate the Firestore 'trains' collection with the initial data from `src/lib/data.ts`. This is a one-time operation.
            </p>
          </div>
          <Button
            onClick={handleSeedDatabase}
            disabled={isLoading || isDone}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Seeding...' : isDone ? 'Data Seeded Successfully' : 'Seed Train Data to Firestore'}
          </Button>
          {isDone && (
             <Alert>
                <AlertTitle>Next Steps</AlertTitle>
                <AlertDescription>
                    You can now go to your Firebase Console to view and edit the train data in the 'trains' collection. Any changes you make there will be reflected in the application.
                </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
