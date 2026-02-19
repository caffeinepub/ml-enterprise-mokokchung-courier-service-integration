import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateBooking } from '../hooks/useQueries';
import { toast } from 'sonner';
import { ShippingOption } from '../backend';
import BookingConfirmationDialog from './BookingConfirmationDialog';
import type { BookingConfirmation } from '../backend';

export default function BookingSection() {
  const createBooking = useCreateBooking();
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);

  const [formData, setFormData] = useState({
    senderName: '',
    senderAddress: '',
    senderPhone: '',
    senderPincode: '',
    receiverName: '',
    receiverAddress: '',
    receiverPhone: '',
    receiverPincode: '',
    weight: '',
    dimensions: '',
    description: '',
    destination: '',
    shippingOption: '' as ShippingOption | '',
  });

  const validatePincode = (pincode: string): boolean => {
    return /^\d{6}$/.test(pincode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.shippingOption) {
      toast.error('Please select a shipping option');
      return;
    }

    if (!validatePincode(formData.senderPincode)) {
      toast.error('Sender pincode must be exactly 6 digits');
      return;
    }

    if (!validatePincode(formData.receiverPincode)) {
      toast.error('Receiver pincode must be exactly 6 digits');
      return;
    }

    try {
      const result = await createBooking.mutateAsync({
        sender: {
          name: formData.senderName,
          address: formData.senderAddress,
          phone: formData.senderPhone,
          pincode: formData.senderPincode,
        },
        receiver: {
          name: formData.receiverName,
          address: formData.receiverAddress,
          phone: formData.receiverPhone,
          pincode: formData.receiverPincode,
        },
        package: {
          weight: parseFloat(formData.weight),
          dimensions: formData.dimensions,
          description: formData.description,
        },
        destination: formData.destination,
        shippingOption: formData.shippingOption,
      });

      setConfirmation(result);
      
      // Reset form
      setFormData({
        senderName: '',
        senderAddress: '',
        senderPhone: '',
        senderPincode: '',
        receiverName: '',
        receiverAddress: '',
        receiverPhone: '',
        receiverPincode: '',
        weight: '',
        dimensions: '',
        description: '',
        destination: '',
        shippingOption: '',
      });
    } catch (error) {
      toast.error('Failed to create booking. Please try again.');
    }
  };

  return (
    <section id="booking" className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Book a Shipment</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Fill in the details below to book your courier service
          </p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Booking Form</CardTitle>
            <CardDescription>Please provide accurate information for smooth delivery</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Sender Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Sender Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="senderName">Full Name *</Label>
                    <Input
                      id="senderName"
                      value={formData.senderName}
                      onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="senderPhone">Phone Number *</Label>
                    <Input
                      id="senderPhone"
                      type="tel"
                      value={formData.senderPhone}
                      onChange={(e) => setFormData({ ...formData, senderPhone: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senderAddress">Address *</Label>
                  <Textarea
                    id="senderAddress"
                    value={formData.senderAddress}
                    onChange={(e) => setFormData({ ...formData, senderAddress: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senderPincode">Sender Pincode *</Label>
                  <Input
                    id="senderPincode"
                    type="text"
                    maxLength={6}
                    pattern="\d{6}"
                    placeholder="e.g., 798601"
                    value={formData.senderPincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setFormData({ ...formData, senderPincode: value });
                    }}
                    required
                  />
                </div>
              </div>

              {/* Receiver Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Receiver Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="receiverName">Full Name *</Label>
                    <Input
                      id="receiverName"
                      value={formData.receiverName}
                      onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="receiverPhone">Phone Number *</Label>
                    <Input
                      id="receiverPhone"
                      type="tel"
                      value={formData.receiverPhone}
                      onChange={(e) => setFormData({ ...formData, receiverPhone: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiverAddress">Address *</Label>
                  <Textarea
                    id="receiverAddress"
                    value={formData.receiverAddress}
                    onChange={(e) => setFormData({ ...formData, receiverAddress: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="receiverPincode">Receiver Pincode *</Label>
                  <Input
                    id="receiverPincode"
                    type="text"
                    maxLength={6}
                    pattern="\d{6}"
                    placeholder="e.g., 110001"
                    value={formData.receiverPincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setFormData({ ...formData, receiverPincode: value });
                    }}
                    required
                  />
                </div>
              </div>

              {/* Package Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Package Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg) *</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensions (L x W x H cm) *</Label>
                    <Input
                      id="dimensions"
                      placeholder="e.g., 30 x 20 x 15"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Package Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the contents of your package"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Shipping Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Shipping Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination *</Label>
                    <Input
                      id="destination"
                      placeholder="City, State"
                      value={formData.destination}
                      onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shippingOption">Shipping Option *</Label>
                    <Select
                      value={formData.shippingOption}
                      onValueChange={(value) => setFormData({ ...formData, shippingOption: value as ShippingOption })}
                    >
                      <SelectTrigger id="shippingOption">
                        <SelectValue placeholder="Select shipping option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={ShippingOption.standard}>Standard (4-6 days)</SelectItem>
                        <SelectItem value={ShippingOption.express}>Express (2-3 days)</SelectItem>
                        <SelectItem value={ShippingOption.overnight}>Overnight (24 hours)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={createBooking.isPending}>
                {createBooking.isPending ? 'Creating Booking...' : 'Book Now'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {confirmation && (
        <BookingConfirmationDialog
          confirmation={confirmation}
          onClose={() => setConfirmation(null)}
        />
      )}
    </section>
  );
}
