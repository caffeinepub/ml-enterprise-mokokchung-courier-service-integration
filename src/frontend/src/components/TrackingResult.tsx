import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, Clock, Truck, Package, AlertCircle } from 'lucide-react';
import type { Booking } from '../backend';
import { ParcelStatus } from '../backend';

interface TrackingResultProps {
  parcel: Booking | null;
  trackingNumber: string;
}

export default function TrackingResult({ parcel, trackingNumber }: TrackingResultProps) {
  if (!parcel) {
    return (
      <Alert variant="destructive" className="mt-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No parcel found with tracking number: <strong>{trackingNumber}</strong>
        </AlertDescription>
      </Alert>
    );
  }

  const getStatusIcon = (status: ParcelStatus) => {
    switch (status) {
      case ParcelStatus.queued:
        return <Clock className="h-5 w-5" />;
      case ParcelStatus.inTransit:
        return <Truck className="h-5 w-5" />;
      case ParcelStatus.outForDelivery:
        return <Package className="h-5 w-5" />;
      case ParcelStatus.delivered:
        return <CheckCircle className="h-5 w-5" />;
    }
  };

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
    return date.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <div className="mt-6 space-y-6">
      {/* Current Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Status</CardTitle>
            <Badge className={getStatusColor(parcel.currentStatus)}>
              <span className="flex items-center gap-2">
                {getStatusIcon(parcel.currentStatus)}
                {getStatusLabel(parcel.currentStatus)}
              </span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Tracking Number</p>
              <p className="font-medium">{parcel.trackingNumber}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Booking ID</p>
              <p className="font-medium">#{parcel.bookingId.toString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Destination</p>
              <p className="font-medium">{parcel.destination}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Booked On</p>
              <p className="font-medium">{formatDate(parcel.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tracking History */}
      <Card>
        <CardHeader>
          <CardTitle>Tracking History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {parcel.trackingUpdates.map((update, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getStatusColor(update.status)}`}>
                    {getStatusIcon(update.status)}
                  </div>
                  {index < parcel.trackingUpdates.length - 1 && (
                    <div className="w-0.5 h-full bg-border mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{getStatusLabel(update.status)}</span>
                    <Badge variant="outline" className="text-xs">
                      {formatDate(update.timestamp)}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{update.location}</p>
                  {update.note && (
                    <p className="text-sm text-muted-foreground mt-1">{update.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shipment Details */}
      <Card>
        <CardHeader>
          <CardTitle>Shipment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Sender</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{parcel.sender.name}</p>
              <p>{parcel.sender.address}</p>
              <p>Pincode: {parcel.sender.pincode}</p>
              <p>Phone: {parcel.sender.phone}</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Receiver</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>{parcel.receiver.name}</p>
              <p>{parcel.receiver.address}</p>
              <p>Pincode: {parcel.receiver.pincode}</p>
              <p>Phone: {parcel.receiver.phone}</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Package</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Weight: {parcel.package.weight} kg</p>
              <p>Dimensions: {parcel.package.dimensions}</p>
              <p>Description: {parcel.package.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
