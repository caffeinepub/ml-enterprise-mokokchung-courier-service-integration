import { Heart, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex flex-col items-start gap-4 mb-4">
              <img 
                src="/assets/Logo.jpg" 
                alt="ML Enterprise Logo" 
                className="h-16 w-auto object-contain"
              />
              <div>
                <h3 className="font-bold text-lg">ML Enterprise</h3>
                <p className="text-sm text-muted-foreground">Mokokchung</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted courier service partner for fast, reliable, and secure deliveries across the region.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#services" className="hover:text-primary transition-colors">Our Services</a></li>
              <li><a href="#booking" className="hover:text-primary transition-colors">Book a Shipment</a></li>
              <li><a href="#tracking" className="hover:text-primary transition-colors">Track Your Parcel</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  TONGDENTSUYONG WARD, A.M ROAD<br />
                  MOKOKCHUNG, NAGALAND: 798601
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a 
                  href="tel:+919366012115" 
                  className="hover:text-primary transition-colors"
                >
                  +91 9366012115
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a 
                  href="mailto:info@mlenterprise.com" 
                  className="hover:text-primary transition-colors"
                >
                  info@mlenterprise.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © 2025. Built with <Heart className="inline h-4 w-4 text-red-500" /> using{' '}
            <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
