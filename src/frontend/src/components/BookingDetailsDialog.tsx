import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText } from 'lucide-react';
import { useUpdateParcelStatus } from '../hooks/useQueries';
import { toast } from 'sonner';
import ShippingLabel from './ShippingLabel';
import type { Booking } from '../backend';
import { ParcelStatus } from '../backend';

interface BookingDetailsDialogProps {
  booking: Booking;
  onClose: () => void;
}

export default function BookingDetailsDialog({ booking, onClose }: BookingDetailsDialogProps) {
  const updateStatus = useUpdateParcelStatus();
  const [newStatus, setNewStatus] = useState<ParcelStatus>(booking.currentStatus);
  const [location, setLocation] = useState('');
  const [note, setNote] = useState('');
  const [showLabel, setShowLabel] = useState(false);

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

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const handleUpdateStatus = async () => {
    if (!location.trim()) {
      toast.error('Please enter a location');
      return;
    }

    try {
      await updateStatus.mutateAsync({
        trackingNumber: booking.trackingNumber,
        update: {
          status: newStatus,
          location: location.trim(),
          note: note.trim(),
        },
      });
      toast.success('Status updated successfully!');
      onClose();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (showLabel) {
    return (
      <Dialog open={true} onOpenChange={() => setShowLabel(false)}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Shipping Label</DialogTitle>
          </DialogHeader>
          <ShippingLabel booking={booking} />
          <div className="flex justify-end gap-2 print:hidden">
            <Button variant="outline" onClick={() => setShowLabel(false)}>
              Back to Details
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Booking Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Booking ID</p>
              <p className="font-semibold">#{booking.bookingId.toString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tracking Number</p>
              <p className="font-semibold font-mono text-sm">{booking.trackingNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Status</p>
              <Badge className={getStatusColor(booking.currentStatus)}>
                {getStatusLabel(booking.currentStatus)}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Booked On</p>
              <p className="font-semibold">{formatDate(booking.createdAt)}</p>
            </div>
          </div>

          {/* Print Label Button */}
          <Button onClick={() => setShowLabel(true)} variant="outline" className="w-full">
            <FileText className="h-4 w-4 mr-2" />
            View & Print Shipping Label
          </Button>

          <Separator />

          {/* Sender & Receiver */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Sender Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p>{booking.sender.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p>{booking.sender.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Address</p>
                  <p>{booking.sender.address}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Pincode</p>
                  <p>{booking.sender.pincode}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Receiver Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Name</p>
                  <p>{booking.receiver.name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p>{booking.receiver.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Address</p>
                  <p>{booking.receiver.address}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Pincode</p>
                  <p>{booking.receiver.pincode}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Package Details */}
          <div>
            <h3 className="font-semibold mb-3">Package Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Weight</p>
                <p>{booking.package.weight} kg</p>
              </div>
              <div>
                <p className="text-muted-foreground">Dimensions</p>
                <p>{booking.package.dimensions}</p>
              </div>
              <div className="col-span-2">
                <p className="text-muted-foreground">Description</p>
                <p>{booking.package.description}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Destination</p>
                <p>{booking.destination}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Update Status */}
          <div>
            <h3 className="font-semibold mb-3">Update Status</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">New Status</Label>
                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as ParcelStatus)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ParcelStatus.queued}>Queued</SelectItem>
                    <SelectItem value={ParcelStatus.inTransit}>In Transit</SelectItem>
                    <SelectItem value={ParcelStatus.outForDelivery}>Out for Delivery</SelectItem>
                    <SelectItem value={ParcelStatus.delivered}>Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., Mokokchung Hub"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Note (Optional)</Label>
                <Textarea
                  id="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add any additional notes..."
                />
              </div>

              <Button
                onClick={handleUpdateStatus}
                disabled={updateStatus.isPending}
                className="w-full"
              >
                {updateStatus.isPending ? 'Updating...' : 'Update Status'}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Tracking History */}
          <div>
            <h3 className="font-semibold mb-3">Tracking History</h3>
            <div className="space-y-3">
              {booking.trackingUpdates.map((update, index) => (
                <div key={index} className="flex gap-3 text-sm">
                  <Badge className={getStatusColor(update.status)} variant="outline">
                    {getStatusLabel(update.status)}
                  </Badge>
                  <div className="flex-1">
                    <p className="font-medium">{update.location}</p>
                    {update.note && <p className="text-muted-foreground">{update.note}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(update.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
