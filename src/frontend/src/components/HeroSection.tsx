export default function HeroSection() {
  return (
    <section className="relative">
      <div className="relative h-[400px] overflow-hidden">
        <img 
          src="/assets/generated/hero-banner.dim_1200x400.jpg" 
          alt="ML Enterprise Courier Service" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Fast & Reliable Courier Service
              </h1>
              <p className="text-lg md:text-xl mb-6 text-white/90">
                ML Enterprise Mokokchung - Your trusted partner for secure and timely deliveries across the region
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#booking" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Book Now
                </a>
                <a href="#tracking" className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-white/90 transition-colors">
                  Track Parcel
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
