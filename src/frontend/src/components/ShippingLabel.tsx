import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';
import type { Booking } from '../backend';
import { ParcelStatus, ShippingOption } from '../backend';

interface ShippingLabelProps {
  booking: Booking;
}

// Simple barcode generator using SVG
function SimpleBarcode({ value }: { value: string }) {
  // Create a simple barcode pattern from the string
  const generateBars = (text: string) => {
    const bars: number[] = [];
    // Convert each character to a pattern of bars
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      // Create alternating pattern based on character code
      bars.push(1, 1, (charCode % 3) + 1, (charCode % 2) + 1);
    }
    return bars;
  };

  const bars = generateBars(value);
  const barWidth = 2;
  const totalWidth = bars.reduce((sum, width) => sum + width * barWidth, 0);
  const height = 50;

  return (
    <div className="flex flex-col items-center">
      <svg width={totalWidth} height={height} className="bg-white">
        {bars.map((width, index) => {
          const x = bars.slice(0, index).reduce((sum, w) => sum + w * barWidth, 0);
          const isBar = index % 2 === 0;
          return isBar ? (
            <rect
              key={index}
              x={x}
              y={0}
              width={width * barWidth}
              height={height}
              fill="black"
            />
          ) : null;
        })}
      </svg>
      <p className="text-xs font-mono mt-1">{value}</p>
    </div>
  );
}

export default function ShippingLabel({ booking }: ShippingLabelProps) {
  const labelRef = useRef<HTMLDivElement>(null);

  const getShippingOptionLabel = (option: ShippingOption) => {
    switch (option) {
      case ShippingOption.standard:
        return 'Standard';
      case ShippingOption.express:
        return 'Express';
      case ShippingOption.overnight:
        return 'Overnight';
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getEstimatedDelivery = () => {
    const createdDate = new Date(Number(booking.createdAt) / 1000000);
    let daysToAdd = 0;
    
    switch (booking.shippingOption) {
      case ShippingOption.standard:
        daysToAdd = 5;
        break;
      case ShippingOption.express:
        daysToAdd = 2;
        break;
      case ShippingOption.overnight:
        daysToAdd = 1;
        break;
    }
    
    const estimatedDate = new Date(createdDate);
    estimatedDate.setDate(estimatedDate.getDate() + daysToAdd);
    
    return estimatedDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const handlePrint = () => {
    if (labelRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Shipping Label - ${booking.trackingNumber}</title>
              <style>
                @page {
                  size: A6;
                  margin: 0;
                }
                body {
                  margin: 0;
                  padding: 0;
                  font-family: Arial, sans-serif;
                }
                @media print {
                  body {
                    width: 105mm;
                    height: 148mm;
                  }
                }
              </style>
            </head>
            <body>
              ${labelRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 250);
      }
    }
  };

  const handleDownloadPDF = () => {
    handlePrint();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-end print:hidden">
        <Button onClick={handleDownloadPDF} variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button onClick={handlePrint} size="sm">
          <Printer className="h-4 w-4 mr-2" />
          Print Label
        </Button>
      </div>

      <div
        ref={labelRef}
        className="bg-white text-black p-6 border-2 border-black"
        style={{
          width: '105mm',
          minHeight: '148mm',
          margin: '0 auto',
        }}
      >
        {/* Header with Logo and Company Info */}
        <div className="border-b-2 border-black pb-3 mb-3">
          <div className="flex items-start gap-3">
            <img
              src="/assets/Logo.jpg"
              alt="ML Enterprise"
              className="h-12 w-12 object-contain"
            />
            <div className="flex-1">
              <h1 className="text-lg font-bold">ML ENTERPRISE</h1>
              <p className="text-xs leading-tight">
                TONGDENTSUYONG WARD, A.M ROAD<br />
                MOKOKCHUNG NAGALAND: 798601<br />
                Phone: 9366012115
              </p>
            </div>
          </div>
        </div>

        {/* Tracking Number and Barcode */}
        <div className="border-b-2 border-black pb-3 mb-3 text-center">
          <p className="text-xs font-semibold mb-1">TRACKING NUMBER</p>
          <div className="flex justify-center my-2">
            <SimpleBarcode value={booking.trackingNumber} />
          </div>
        </div>

        {/* Sender Information */}
        <div className="border-b-2 border-black pb-3 mb-3">
          <p className="text-xs font-bold mb-1">FROM:</p>
          <p className="text-sm font-semibold">{booking.sender.name}</p>
          <p className="text-xs leading-tight">{booking.sender.address}</p>
          <p className="text-xs">Phone: {booking.sender.phone}</p>
          <p className="text-xs">Pincode: {booking.sender.pincode}</p>
        </div>

        {/* Receiver Information */}
        <div className="border-b-2 border-black pb-3 mb-3">
          <p className="text-xs font-bold mb-1">TO:</p>
          <p className="text-sm font-semibold">{booking.receiver.name}</p>
          <p className="text-xs leading-tight">{booking.receiver.address}</p>
          <p className="text-xs">Phone: {booking.receiver.phone}</p>
          <p className="text-xs">Pincode: {booking.receiver.pincode}</p>
          <p className="text-xs mt-1">
            <span className="font-semibold">Destination:</span> {booking.destination}
          </p>
        </div>

        {/* Package Details */}
        <div className="border-b-2 border-black pb-3 mb-3">
          <p className="text-xs font-bold mb-1">PACKAGE DETAILS:</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div>
              <span className="font-semibold">Weight:</span> {booking.package.weight} kg
            </div>
            <div>
              <span className="font-semibold">Dimensions:</span> {booking.package.dimensions}
            </div>
            <div className="col-span-2">
              <span className="font-semibold">Description:</span> {booking.package.description}
            </div>
            <div className="col-span-2">
              <span className="font-semibold">Service:</span> {getShippingOptionLabel(booking.shippingOption)}
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="text-xs">
          <div className="flex justify-between mb-1">
            <span className="font-semibold">Booking Date:</span>
            <span>{formatDate(booking.createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Est. Delivery:</span>
            <span>{getEstimatedDelivery()}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t-2 border-black text-center">
          <p className="text-xs font-semibold">
            Handle with care • Keep dry • This side up
          </p>
        </div>
      </div>
    </div>
  );
}
