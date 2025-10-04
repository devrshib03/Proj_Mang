import Image from 'next/image';

const demoImages = [
  {
    src: '/dashboard.png',
    alt: 'Dashboard Screenshot',
    label: 'Dashboard',
  },
  {
    src: '/kanban.png',
    alt: 'Kanban Board Screenshot',
    label: 'Kanban Board',
  },
];

export default function DemoSection() {
  return (
    <section className="py-16 px-4 bg-white dark:bg-[#181f2a]">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black dark:text-white">Screenshots & Demo</h2>
        <p className="text-gray-600 dark:text-gray-300">See how your workspace looks in action.</p>
      </div>
      <div className="flex flex-col items-center gap-8 md:flex-row md:justify-center md:gap-12 w-full max-w-6xl mx-auto">
        {demoImages.map((img, idx) => (
          <div key={idx} className="w-full rounded-lg overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-800 flex flex-col items-center">
            <Image src={img.src} alt={img.alt} width={1200} height={400} className="w-full h-[400px] object-cover" />
            <div className="p-4 text-center text-lg font-semibold text-gray-700 dark:text-gray-300">{img.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
