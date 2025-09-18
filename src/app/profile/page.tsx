"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";

export default function ProfilePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    // You can add a loader here
    return null;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="text-3xl bg-primary/20 text-primary">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold font-headline">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Manage your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p>{user.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p>{user.email}</p>
              </div>
              <Separator />
              <div className="space-y-2">
                <Button className="w-full">Update Profile</Button>
                <Button variant="outline" className="w-full">Change Password</Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold font-headline mb-4">Booking History</h2>
          {user.bookings.length > 0 ? (
            <div className="space-y-4">
              {user.bookings.map(booking => (
                <Card key={booking.id}>
                  <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex gap-4 items-center">
                        <div className="bg-primary/10 p-3 rounded-lg">
                            <Ticket className="w-6 h-6 text-primary"/>
                        </div>
                        <div>
                            <p className="font-semibold">{booking.trainName}</p>
                            <p className="text-sm text-muted-foreground">{booking.from} to {booking.to}</p>
                            <p className="text-sm text-muted-foreground">Date: {booking.date}</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                          <p className="font-bold text-lg">${booking.totalPrice.toFixed(2)}</p>
                          <p className="text-sm">{booking.class} class</p>
                      </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed rounded-lg">
              <h3 className="text-xl font-semibold">No Bookings Yet</h3>
              <p className="text-muted-foreground mt-2">Start your journey by searching for trains.</p>
              <Button asChild className="mt-4">
                <a href="/search">Search Trains</a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
