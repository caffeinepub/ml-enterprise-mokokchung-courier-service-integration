import { SiWhatsapp } from 'react-icons/si';

export default function WhatsAppButton() {
  const phoneNumber = '919366012115';
  const message = encodeURIComponent('Hello ML Enterprise Mokokchung, I have an inquiry');
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl flex items-center justify-center group"
      aria-label="Chat on WhatsApp"
    >
      <SiWhatsapp className="h-7 w-7" />
      <span className="absolute right-full mr-3 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-2 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
        Chat with us
      </span>
    </a>
  );
}
