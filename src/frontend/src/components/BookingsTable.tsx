import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import type { Booking } from '../backend';
import { ParcelStatus } from '../backend';
import BookingDetailsDialog from './BookingDetailsDialog';

interface BookingsTableProps {
  bookings: Booking[];
  isLoading: boolean;
}

export default function BookingsTable({ bookings, isLoading }: BookingsTableProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const getStatusColor = (status: ParcelStatus) => {
    switch (status) {
      case ParcelStatus.queued:
        return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400';
      case ParcelStatus.inTransit:
        return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
      case ParcelStatus.outForDelivery:
        return 'bg-purple-500/10 text-purple-700 dark:text-purple-400';
      case ParcelStatus.delivered:
        return 'bg-green-500/10 text-green-700 dark:text-green-400';
    }
  };

  const getStatusLabel = (status: ParcelStatus) => {
    switch (status) {
      case ParcelStatus.queued:
        return 'Queued';
      case ParcelStatus.inTransit:
        return 'In Transit';
      case ParcelStatus.outForDelivery:
        return 'Out for Delivery';
      case ParcelStatus.delivered:
        return 'Delivered';
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading bookings...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            <p>No bookings found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
          <CardDescription>Manage and track all bookings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Booking ID</TableHead>
                  <TableHead>Tracking Number</TableHead>
                  <TableHead>Sender</TableHead>
                  <TableHead>Receiver</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.trackingNumber}>
                    <TableCell className="font-medium">#{booking.bookingId.toString()}</TableCell>
                    <TableCell className="font-mono text-sm">{booking.trackingNumber}</TableCell>
                    <TableCell>{booking.sender.name}</TableCell>
                    <TableCell>{booking.receiver.name}</TableCell>
                    <TableCell>{booking.destination}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(booking.currentStatus)}>
                        {getStatusLabel(booking.currentStatus)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(booking.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {selectedBooking && (
        <BookingDetailsDialog
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </>
  );
}
