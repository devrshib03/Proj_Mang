"use client";
import Image from 'next/image';
import { useState, useMemo, useCallback, useEffect } from 'react';

const demoImages = [
  {
    src: '/demo/dashboard.png',
    alt: 'Dashboard Screenshot',
    label: 'Dashboard',
  },
  {
    src: '/demo/kanban.png',
    alt: 'Kanban Board Screenshot',
    label: 'Kanban Board',
  },
  {
    src: '/demo/table.png',
    alt: 'Table View Screenshot',
    label: 'Table View',
  },
];

export default function DemoSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const total = demoImages.length;
  const activeImage = useMemo(() => demoImages[activeIndex], [activeIndex]);

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % total);
  }, [total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goNext, goPrev]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const id = window.setInterval(() => {
      goNext();
    }, 5000);
    return () => window.clearInterval(id);
  }, [goNext]);

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50 dark:from-[#181f2a] dark:to-[#121725]">
      <div className="max-w-4xl mx-auto text-center mb-10">
        <span className="inline-block px-3 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 mb-3">Live Preview</span>
        <h2 className="text-2xl md:text-3xl font-bold mb-3 text-black dark:text-white">Screenshots & Demo</h2>
        <p className="text-gray-600 dark:text-gray-300">See how your workspace looks in action.</p>
      </div>

      <div className="w-full max-w-6xl mx-auto">
        <div className="relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-[#111624]/60 backdrop-blur overflow-hidden shadow-lg">
          <div className="absolute inset-x-0 top-0 h-8 bg-gray-100 dark:bg-gray-900/60 border-b border-gray-200 dark:border-gray-800 flex items-center gap-1 px-4">
            <span className="w-3 h-3 rounded-full bg-red-400"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span className="w-3 h-3 rounded-full bg-green-400"></span>
            <div className="ml-3 text-xs text-gray-500 dark:text-gray-400 truncate">{activeImage.label}</div>
          </div>

          <div className="pt-8">
            <button aria-label="Previous screenshot" onClick={goPrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 p-2 hover:scale-105 transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button aria-label="Next screenshot" onClick={goNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 p-2 hover:scale-105 transition">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>

            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {demoImages.map((img, idx) => (
                  <button
                    key={idx}
                    className="group relative cursor-zoom-in w-full shrink-0"
                    style={{ minWidth: '100%' }}
                    onClick={() => setLightboxOpen(true)}
                    aria-label={`Open ${img.label} in lightbox`}
                  >
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={1600}
                      height={900}
                      className="w-full max-h-[520px] object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                      priority={idx === 0}
                    />
                  </button>
                ))}
              </div>
              <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full backdrop-blur bg-black/40 text-white text-xs">
                Click to enlarge
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          {demoImages.map((img, idx) => (
            <button
              key={idx}
              aria-label={`Show ${img.label}`}
              onClick={() => setActiveIndex(idx)}
              className={`h-2 w-8 rounded-full transition ${idx === activeIndex ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-gray-700'}`}
            />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          {demoImages.map((img, idx) => (
            <button key={idx} onClick={() => setActiveIndex(idx)} className={`relative rounded-lg overflow-hidden border ${idx === activeIndex ? 'border-indigo-500' : 'border-gray-200 dark:border-gray-800'}`} aria-label={`Thumbnail ${img.label}`}>
              <Image src={img.src} alt={img.alt} width={400} height={240} className="w-full h-24 object-cover" />
              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition" />
            </button>
          ))}
        </div>
      </div>

      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
          <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <button aria-label="Close" onClick={() => setLightboxOpen(false)} className="absolute -top-10 right-0 text-white/80 hover:text-white">✕</button>
            <Image src={activeImage.src} alt={activeImage.alt} width={1920} height={1080} className="w-full h-auto rounded-lg" />
          </div>
        </div>
      )}
    </section>
  );
}
