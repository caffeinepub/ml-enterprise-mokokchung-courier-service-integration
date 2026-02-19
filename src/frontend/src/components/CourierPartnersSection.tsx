import { Card, CardContent } from '@/components/ui/card';

export default function CourierPartnersSection() {
  const partners = [
    {
      name: 'Delhivery',
      logo: '/assets/images.png',
      alt: 'Delhivery Logo',
    },
    {
      name: 'Blue Dart DHL',
      logo: '/assets/Untitled.png',
      alt: 'Blue Dart DHL Logo',
    },
    {
      name: 'Everyday Express',
      logo: '/assets/logo1.png',
      alt: 'Everyday Express Logo',
    },
  ];

  return (
    <section id="partners" className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Courier Partners</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Trusted logistics partners working with ML Enterprise Mokokchung
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {partners.map((partner, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white"
            >
              <CardContent className="p-8 flex flex-col items-center justify-center">
                <div className="h-32 w-full flex items-center justify-center mb-4">
                  <img
                    src={partner.logo}
                    alt={partner.alt}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
                <p className="text-center font-semibold text-foreground">
                  {partner.name}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
