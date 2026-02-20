import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateBooking } from '../hooks/useQueries';
import { toast } from 'sonner';
import { ShippingOption } from '../backend';
import BookingConfirmationDialog from './BookingConfirmationDialog';
import type { BookingConfirmation } from '../backend';
import { Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';

export default function BookingSection() {
  const createBooking = useCreateBooking();
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const [mode, setMode] = useState<'ground' | 'air'>('ground');
  const [pickupDate, setPickupDate] = useState<Date>();
  const [pickupTime, setPickupTime] = useState<string>('13:34');
  const [pickupPeriod, setPickupPeriod] = useState<'AM' | 'PM'>('PM');

  const [formData, setFormData] = useState({
    customerName: '',
    mobileNumber: '',
    numberOfPackages: '',
    approximateWeight: '',
    originPincode: '',
    destinationPincode: '',
    email: '',
    address1: '',
    address2: '',
    address3: '',
  });

  const validatePincode = (pincode: string): boolean => {
    return /^\d{6}$/.test(pincode);
  };

  const formatPickupDateTime = (): string => {
    if (!pickupDate) return '';
    const dateStr = format(pickupDate, 'dd-MM-yyyy');
    return `${dateStr} ${pickupTime} ${pickupPeriod}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePincode(formData.originPincode)) {
      toast.error('Origin pincode must be exactly 6 digits');
      return;
    }

    if (!validatePincode(formData.destinationPincode)) {
      toast.error('Destination pincode must be exactly 6 digits');
      return;
    }

    if (!pickupDate) {
      toast.error('Please select a preferred pickup date');
      return;
    }

    try {
      // Map mode to shipping option
      const shippingOption = mode === 'air' ? ShippingOption.express : ShippingOption.standard;

      const result = await createBooking.mutateAsync({
        sender: {
          name: formData.customerName,
          address: [formData.address1, formData.address2, formData.address3].filter(Boolean).join(', '),
          phone: formData.mobileNumber,
          pincode: formData.originPincode,
        },
        receiver: {
          name: 'Receiver', // Using placeholder as design doesn't show receiver fields
          address: 'Destination Address',
          phone: formData.mobileNumber,
          pincode: formData.destinationPincode,
        },
        package: {
          weight: parseFloat(formData.approximateWeight),
          dimensions: `${formData.numberOfPackages} packages`,
          description: `${formData.numberOfPackages} packages, ${formData.approximateWeight}kg`,
        },
        destination: formData.destinationPincode,
        shippingOption,
      });

      setConfirmation(result);
      
      // Reset form
      setFormData({
        customerName: '',
        mobileNumber: '',
        numberOfPackages: '',
        approximateWeight: '',
        originPincode: '',
        destinationPincode: '',
        email: '',
        address1: '',
        address2: '',
        address3: '',
      });
      setPickupDate(undefined);
      setMode('ground');
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

        <Card className="max-w-5xl mx-auto relative overflow-hidden">
          <CardContent className="pt-8 pb-12">
            {/* General Heading */}
            <h3 className="text-2xl font-semibold text-green-600 text-center mb-6">General</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mode Selector */}
              <div className="flex justify-center mb-8">
                <div className="inline-flex items-center gap-4 px-6 py-3 border-2 border-green-600 rounded-full bg-white">
                  <span className="font-medium text-gray-700">Mode</span>
                  
                  {/* Ground/Truck Option */}
                  <button
                    type="button"
                    onClick={() => setMode('ground')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      mode === 'ground' 
                        ? 'bg-green-100 ring-2 ring-green-600' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      mode === 'ground' ? 'border-green-600' : 'border-gray-400'
                    }`}>
                      {mode === 'ground' && (
                        <div className="w-2 h-2 rounded-full bg-green-600" />
                      )}
                    </div>
                    <img 
                      src="/assets/generated/truck-icon.dim_32x32.png" 
                      alt="Ground shipping" 
                      className="w-8 h-8"
                    />
                  </button>

                  {/* Air/Airplane Option */}
                  <button
                    type="button"
                    onClick={() => setMode('air')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      mode === 'air' 
                        ? 'bg-green-100 ring-2 ring-green-600' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      mode === 'air' ? 'border-green-600' : 'border-gray-400'
                    }`}>
                      {mode === 'air' && (
                        <div className="w-2 h-2 rounded-full bg-green-600" />
                      )}
                    </div>
                    <img 
                      src="/assets/generated/airplane-icon.dim_32x32.png" 
                      alt="Air shipping" 
                      className="w-8 h-8"
                    />
                  </button>
                </div>
              </div>

              {/* Two-column grid for main fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer/Consignor Name */}
                <div className="space-y-2">
                  <Label htmlFor="customerName">
                    <span className="text-red-500">*</span> Customer/Consignor Name
                  </Label>
                  <Input
                    id="customerName"
                    placeholder="Customer/Consignor Name"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    required
                    className="border-gray-300"
                  />
                </div>

                {/* Mobile Number with Verify button */}
                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">
                    <span className="text-red-500">*</span> Mobile Number
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="mobileNumber"
                      type="tel"
                      placeholder="Mobile Number"
                      value={formData.mobileNumber}
                      onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                      required
                      className="border-gray-300 flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="secondary"
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6"
                    >
                      Verify
                    </Button>
                  </div>
                </div>

                {/* No. of Packages */}
                <div className="space-y-2">
                  <Label htmlFor="numberOfPackages">
                    <span className="text-red-500">*</span> No. of Packages
                  </Label>
                  <Input
                    id="numberOfPackages"
                    type="number"
                    placeholder="Enter No. Of packages"
                    value={formData.numberOfPackages}
                    onChange={(e) => setFormData({ ...formData, numberOfPackages: e.target.value })}
                    required
                    className="border-gray-300"
                  />
                </div>

                {/* Approximate Weight(Kg) */}
                <div className="space-y-2">
                  <Label htmlFor="approximateWeight">Approximate Weight(Kg)</Label>
                  <Input
                    id="approximateWeight"
                    type="number"
                    step="0.1"
                    placeholder="Enter Weight"
                    value={formData.approximateWeight}
                    onChange={(e) => setFormData({ ...formData, approximateWeight: e.target.value })}
                    className="border-gray-300"
                  />
                </div>

                {/* Origin Pincode */}
                <div className="space-y-2">
                  <Label htmlFor="originPincode">
                    <span className="text-red-500">*</span> Origin Pincode
                  </Label>
                  <Input
                    id="originPincode"
                    type="text"
                    maxLength={6}
                    pattern="\d{6}"
                    placeholder="Origin Pincode"
                    value={formData.originPincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setFormData({ ...formData, originPincode: value });
                    }}
                    required
                    className="border-gray-300"
                  />
                </div>

                {/* Destination Pincode */}
                <div className="space-y-2">
                  <Label htmlFor="destinationPincode">
                    <span className="text-red-500">*</span> Destination Pincode
                  </Label>
                  <Input
                    id="destinationPincode"
                    type="text"
                    maxLength={6}
                    pattern="\d{6}"
                    placeholder="Destination Pincode"
                    value={formData.destinationPincode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '');
                      setFormData({ ...formData, destinationPincode: value });
                    }}
                    required
                    className="border-gray-300"
                  />
                </div>

                {/* Preferred Pickup Date */}
                <div className="space-y-2">
                  <Label htmlFor="pickupDate">
                    <span className="text-red-500">*</span> Preferred Pickup Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="relative">
                        <Input
                          id="pickupDate"
                          value={formatPickupDateTime()}
                          placeholder="19-02-2026 13:34 PM"
                          readOnly
                          required
                          className="border-gray-300 pr-10 cursor-pointer"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4" align="start">
                      <div className="space-y-4">
                        <CalendarComponent
                          mode="single"
                          selected={pickupDate}
                          onSelect={setPickupDate}
                          initialFocus
                        />
                        <div className="flex gap-2 items-center">
                          <Input
                            type="time"
                            value={pickupTime}
                            onChange={(e) => setPickupTime(e.target.value)}
                            className="flex-1"
                          />
                          <select
                            value={pickupPeriod}
                            onChange={(e) => setPickupPeriod(e.target.value as 'AM' | 'PM')}
                            className="px-3 py-2 border rounded-md"
                          >
                            <option value="AM">AM</option>
                            <option value="PM">PM</option>
                          </select>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">
                    <span className="text-red-500">*</span> Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="border-gray-300"
                  />
                </div>
              </div>

              {/* Address 1 - Full width */}
              <div className="space-y-2">
                <Label htmlFor="address1">
                  <span className="text-red-500">*</span> Address 1
                </Label>
                <Input
                  id="address1"
                  placeholder="Address 1"
                  value={formData.address1}
                  onChange={(e) => setFormData({ ...formData, address1: e.target.value })}
                  required
                  className="border-gray-300"
                />
              </div>

              {/* Address 2 and Address 3 - Two columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="address2">Address 2</Label>
                  <Input
                    id="address2"
                    placeholder="Address 2"
                    value={formData.address2}
                    onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address3">Address 3</Label>
                  <Input
                    id="address3"
                    placeholder="Address 3"
                    value={formData.address3}
                    onChange={(e) => setFormData({ ...formData, address3: e.target.value })}
                    className="border-gray-300"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <Button 
                  type="submit" 
                  className="px-12 py-6 text-lg bg-gray-600 hover:bg-gray-700"
                  disabled={createBooking.isPending}
                >
                  {createBooking.isPending ? 'SUBMITTING...' : 'SUBMIT'}
                </Button>
              </div>
            </form>

            {/* Decorative package boxes illustration */}
            <div className="absolute bottom-0 right-0 pointer-events-none">
              <img 
                src="/assets/generated/package-boxes.dim_400x200.png" 
                alt="Package boxes" 
                className="w-80 h-auto opacity-90"
              />
            </div>
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
