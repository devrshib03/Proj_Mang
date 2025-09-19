import user1 from '../public/user/user1.png';
import user2 from '../public/user/user2.png';

export default function TestimonialsSection() {
  return (
    <section className="py-16 px-4 bg-white dark:bg-[#181f2a]">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black dark:text-white">Testimonials</h2>
        <p className="text-gray-600 dark:text-gray-300">Hear from our users and partners.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow flex flex-col items-center">
            <img src="/user/user1.png" alt="User 1" className="w-16 h-16 rounded-full mb-4" />
          <blockquote className="italic text-gray-700 dark:text-gray-300 mb-2">"This app made our team so much more productive!"</blockquote>
          <span className="font-semibold text-gray-800 dark:text-gray-200">- Alex, Team Lead</span>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow flex flex-col items-center">
            <img src="/user/user2.png" alt="User 2" className="w-16 h-16 rounded-full mb-4" />
          <blockquote className="italic text-gray-700 dark:text-gray-300 mb-2">"Easy to use and great for collaboration."</blockquote>
          <span className="font-semibold text-gray-800 dark:text-gray-200">- Kevin, Project Manager</span>
        </div>
      </div>
      {/* Partners/Logos - normalized sizes with continuous left-to-right marquee */}
      <div className="mt-12 overflow-hidden marquee">
        <div className="flex items-center gap-10 animate-marquee will-change-transform">
          {["/company/google.svg","/company/microsoft.svg","/company/meta.png","/company/amazon.png","/company/apple.png","/company/nvidia.png","/company/tesla.png",
            "/company/google.svg","/company/microsoft.svg","/company/meta.png","/company/amazon.png","/company/apple.png","/company/nvidia.png","/company/tesla.png"].map((src, idx) => (
            <div key={idx} className="h-14 w-40 md:h-16 md:w-48 flex items-center justify-center opacity-90">
              <img src={src} alt={`Company ${idx % 7}`} className="max-h-12 md:max-h-14 w-auto object-contain" />
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-marquee { animation: marquee 30s linear infinite; }
        .marquee:hover .animate-marquee { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .animate-marquee { animation-duration: 120s; }
        }
      `}</style>
    </section>
  );
}
