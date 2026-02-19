import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Zap, Clock } from 'lucide-react';

export default function ServicesSection() {
  const services = [
    {
      icon: Truck,
      title: 'Standard Delivery',
      description: '4-6 days delivery time',
      features: ['Cost-effective', 'Reliable tracking', 'Secure handling'],
    },
    {
      icon: Zap,
      title: 'Express Delivery',
      description: '2-3 days delivery time',
      features: ['Priority handling', 'Real-time updates', 'Insurance included'],
    },
    {
      icon: Clock,
      title: 'Overnight Delivery',
      description: '24 hours delivery time',
      features: ['Same-day pickup', 'Next-day delivery', 'Premium service'],
    },
  ];

  return (
    <section id="services" className="py-16 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose from our range of delivery options tailored to meet your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
