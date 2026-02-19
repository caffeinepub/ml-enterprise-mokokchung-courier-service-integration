import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog';
import { X } from 'lucide-react';

export default function GallerySection() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryImages = [
    {
      src: '/assets/WhatsApp Image 2025-12-30 at 12.21.45 PM.jpeg',
      alt: 'Fast Reliable Movers Services - Delivery Truck',
      caption: 'Fast & Reliable Delivery Services',
    },
    {
      src: '/assets/WhatsApp Image 2025-12-30 at 12.21.47 PM.jpeg',
      alt: 'Transport & Logistics Operations',
      caption: 'Professional Transport & Logistics',
    },
    {
      src: '/assets/WhatsApp Image 2025-12-30 at 12.21.48 PM.jpeg',
      alt: 'ML Enterprise Logistics Services',
      caption: 'Comprehensive Logistics Solutions',
    },
  ];

  return (
    <>
      <section id="gallery" className="py-16 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Operations Gallery</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Snapshots of our courier and logistics services
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {galleryImages.map((image, index) => (
              <Card
                key={index}
                className="overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 group"
                onClick={() => setSelectedImage(image.src)}
              >
                <CardContent className="p-0">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                  <div className="p-4 bg-white">
                    <p className="text-center font-medium text-foreground">
                      {image.caption}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none">
          <DialogClose className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 hover:bg-white/20 transition-colors">
            <X className="h-6 w-6 text-white" />
            <span className="sr-only">Close</span>
          </DialogClose>
          {selectedImage && (
            <div className="flex items-center justify-center w-full h-full p-8">
              <img
                src={selectedImage}
                alt="Gallery preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
