import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';

export default function ContactSection() {
  const phoneNumber = '919366012115';
  const message = encodeURIComponent('Hello ML Enterprise Mokokchung, I have an inquiry');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <section id="contact" className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get in touch with us for any queries or support
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Address</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                ML Enterprise<br />
                TONGDENTSUYONG WARD<br />
                A.M ROAD<br />
                MOKOKCHUNG<br />
                NAGALAND: 798601
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Phone</CardTitle>
            </CardHeader>
            <CardContent>
              <a 
                href="tel:+919366012115" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                +91 9366012115
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Email</CardTitle>
            </CardHeader>
            <CardContent>
              <a 
                href="mailto:info@mlenterprise.com" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors block"
              >
                info@mlenterprise.com
              </a>
              <a 
                href="mailto:support@mlenterprise.com" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors block"
              >
                support@mlenterprise.com
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Business Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Mon - Sat: 9:00 AM - 6:00 PM<br />
                Sunday: Closed
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 max-w-2xl mx-auto">
          <Card className="border-[#25D366]/20 bg-gradient-to-br from-[#25D366]/5 to-transparent hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-[#25D366]/10 flex items-center justify-center">
                  <SiWhatsapp className="h-6 w-6 text-[#25D366]" />
                </div>
                <CardTitle className="text-lg">Message us on WhatsApp</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Get instant support and quick responses to your courier inquiries via WhatsApp
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-lg hover:bg-[#20BA5A] transition-colors font-medium"
              >
                <SiWhatsapp className="h-5 w-5" />
                Start Chat
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
