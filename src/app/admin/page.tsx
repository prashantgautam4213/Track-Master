'use client';

import { useState, useEffect } from 'react';
import { useFirebase } from '@/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import { trains as mockTrains } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Database, AlertTriangle } from 'lucide-react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminPage() {
  const { firestore } = useFirebase();
  const { isAuthenticated, isUserLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !isAuthenticated) {
      router.push('/login?redirect=/admin');
    }
  }, [isAuthenticated, isUserLoading, router]);


  const handleSeedDatabase = () => {
    setIsLoading(true);
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

    if (mockTrains.length > 499) {
        toast({
            variant: 'destructive',
            title: 'Error Seeding Database',
            description: 'Too many trains to seed in one batch (max 500).',
        });
        setIsLoading(false);
        return;
    }

    mockTrains.forEach(train => {
      const docRef = doc(trainsCollection, train.id);
      batch.set(docRef, train);
    });

    batch.commit()
      .then(() => {
        toast({
          title: 'Database Seeded!',
          description: `${mockTrains.length} train documents have been added to Firestore.`,
        });
        setIsDone(true);
      })
      .catch((serverError) => {
        const contextualError = new FirestorePermissionError({
          path: 'trains',
          operation: 'write',
          requestResourceData: { note: `Batch write for ${mockTrains.length} documents.` },
        });
        errorEmitter.emit('permission-error', contextualError);
        
        toast({
          variant: 'destructive',
          title: 'Error Seeding Database',
          description: 'Permission denied. Check security rules and ensure you are authenticated.',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isUserLoading || !isAuthenticated) {
    return (
      <div className="container mx-auto py-10 max-w-2xl">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-80 mt-2" />
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

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
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>One-Time Operation</AlertTitle>
            <AlertDescription>
              This tool populates the database with the initial set of train data. It should only be run once.
            </AlertDescription>
          </Alert>
          
          <Button
            onClick={handleSeedDatabase}
            disabled={isLoading || isDone}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Seeding...' : isDone ? 'Data Seeded Successfully' : 'Seed Train Data to Firestore'}
          </Button>
          
          {isDone && (
             <Alert variant="default" className="bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200 [&>svg]:text-green-600">
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                    You can now view the 'trains' collection in your Firebase Console. This data will now be used across the application.
                </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
