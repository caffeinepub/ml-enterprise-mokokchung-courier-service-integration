import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Copy, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useTrackParcel } from '../hooks/useQueries';
import ShippingLabel from './ShippingLabel';
import type { BookingConfirmation } from '../backend';
import { ParcelStatus } from '../backend';

interface BookingConfirmationDialogProps {
  confirmation: BookingConfirmation;
  onClose: () => void;
}

export default function BookingConfirmationDialog({ confirmation, onClose }: BookingConfirmationDialogProps) {
  const [showLabel, setShowLabel] = useState(false);
  const { data: booking } = useTrackParcel(confirmation.trackingNumber);

  const copyTrackingNumber = () => {
    navigator.clipboard.writeText(confirmation.trackingNumber);
    toast.success('Tracking number copied to clipboard!');
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

  if (showLabel && booking) {
    return (
      <Dialog open={true} onOpenChange={() => setShowLabel(false)}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Shipping Label</DialogTitle>
            <DialogDescription>
              Print or download the shipping label for your parcel
            </DialogDescription>
          </DialogHeader>
          <ShippingLabel booking={booking} />
          <div className="flex justify-end gap-2 print:hidden">
            <Button variant="outline" onClick={() => setShowLabel(false)}>
              Back to Confirmation
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <DialogTitle className="text-center">Booking Confirmed!</DialogTitle>
          <DialogDescription className="text-center">
            Your shipment has been successfully booked
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Booking ID</p>
              <p className="font-semibold">#{confirmation.bookingId.toString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tracking Number</p>
              <div className="flex items-center gap-2">
                <p className="font-semibold flex-1">{confirmation.trackingNumber}</p>
                <Button size="sm" variant="ghost" onClick={copyTrackingNumber}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-semibold">{getStatusLabel(confirmation.status)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Estimated Delivery</p>
              <p className="font-semibold">{confirmation.estimatedDelivery}</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            Please save your tracking number to track your parcel
          </p>

          <div className="flex flex-col gap-2">
            <Button onClick={() => setShowLabel(true)} variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Print Shipping Label
            </Button>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
