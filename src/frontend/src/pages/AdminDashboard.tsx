import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetAllBookings, useIsAdmin } from '../hooks/useQueries';
import BookingsTable from '../components/BookingsTable';
import DashboardStats from '../components/DashboardStats';
import { Package, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { ParcelStatus } from '../backend';

export default function AdminDashboard() {
  const { data: bookings = [], isLoading } = useGetAllBookings();
  const { data: isAdmin = false } = useIsAdmin();

  if (!isAdmin) {
    return (
      <div className="container py-12">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access the admin dashboard.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const stats = {
    total: bookings.length,
    queued: bookings.filter(b => b.currentStatus === ParcelStatus.queued).length,
    inTransit: bookings.filter(b => b.currentStatus === ParcelStatus.inTransit).length,
    delivered: bookings.filter(b => b.currentStatus === ParcelStatus.delivered).length,
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage bookings and track parcel statuses</p>
      </div>

      <DashboardStats stats={stats} />

      <Tabs defaultValue="all" className="mt-8">
        <TabsList>
          <TabsTrigger value="all">All Bookings ({stats.total})</TabsTrigger>
          <TabsTrigger value="queued">Queued ({stats.queued})</TabsTrigger>
          <TabsTrigger value="inTransit">In Transit ({stats.inTransit})</TabsTrigger>
          <TabsTrigger value="delivered">Delivered ({stats.delivered})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <BookingsTable bookings={bookings} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="queued" className="mt-6">
          <BookingsTable 
            bookings={bookings.filter(b => b.currentStatus === ParcelStatus.queued)} 
            isLoading={isLoading} 
          />
        </TabsContent>

        <TabsContent value="inTransit" className="mt-6">
          <BookingsTable 
            bookings={bookings.filter(b => b.currentStatus === ParcelStatus.inTransit)} 
            isLoading={isLoading} 
          />
        </TabsContent>

        <TabsContent value="delivered" className="mt-6">
          <BookingsTable 
            bookings={bookings.filter(b => b.currentStatus === ParcelStatus.delivered)} 
            isLoading={isLoading} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
