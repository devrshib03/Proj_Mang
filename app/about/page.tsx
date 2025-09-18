import Header from "components/Header";
import Footer from "components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <section className="py-16 px-4 bg-white dark:bg-[#181f2a]">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4 text-black dark:text-white">About DailyTM</h1>
          <p className="text-gray-600 dark:text-gray-300">
            DailyTM helps teams plan, track, and deliver projects efficiently with a modern,
            streamlined interface and powerful collaboration features.
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}


