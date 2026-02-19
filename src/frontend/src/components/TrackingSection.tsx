import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTrackParcel } from '../hooks/useQueries';
import TrackingResult from './TrackingResult';
import { Search } from 'lucide-react';

export default function TrackingSection() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [searchedNumber, setSearchedNumber] = useState<string | null>(null);
  const { data: parcel, isLoading } = useTrackParcel(searchedNumber);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNumber.trim()) {
      setSearchedNumber(trackingNumber.trim());
    }
  };

  return (
    <section id="tracking" className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Track Your Parcel</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter your tracking number to get real-time updates on your shipment
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Parcel Tracking</CardTitle>
            <CardDescription>Enter your tracking number below</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="trackingNumber">Tracking Number</Label>
                <div className="flex gap-2">
                  <Input
                    id="trackingNumber"
                    placeholder="e.g., ML1234567890"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    required
                  />
                  <Button type="submit" disabled={isLoading}>
                    <Search className="h-4 w-4 mr-2" />
                    Track
                  </Button>
                </div>
              </div>
            </form>

            {isLoading && (
              <div className="mt-6 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="mt-2 text-sm text-muted-foreground">Searching for your parcel...</p>
              </div>
            )}

            {!isLoading && searchedNumber && (
              <TrackingResult parcel={parcel ?? null} trackingNumber={searchedNumber} />
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
