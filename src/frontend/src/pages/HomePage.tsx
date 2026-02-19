import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import CourierPartnersSection from '../components/CourierPartnersSection';
import TrackingSection from '../components/TrackingSection';
import ContactSection from '../components/ContactSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <CourierPartnersSection />
      <TrackingSection />
      <ContactSection />
    </>
  );
}
