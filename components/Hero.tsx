export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center py-16 md:py-24 text-center bg-white dark:bg-[#181f2a] px-4">
      <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
        Organize Your Projects, <span className="text-indigo-500 dark:text-blue-400">Boost Productivity.</span>
      </h1>
      <p className="text-base md:text-lg mb-8 max-w-xl mx-auto text-gray-600 dark:text-gray-300">
        Manage tasks, collaborate with your team, and track progress—all in one place. Stay focused and achieve more with your personal command center.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <button className="px-6 py-3 rounded font-semibold bg-indigo-700 text-white dark:bg-blue-700 w-full sm:w-auto">Try Free</button>
        <button className="px-6 py-3 rounded font-semibold border border-indigo-700 text-indigo-700 dark:border-blue-700 dark:text-blue-400 w-full sm:w-auto">Learn More</button>
      </div>
      {/* Dashboard illustration/mockup */}
      <div className="w-full max-w-2xl mx-auto rounded-lg overflow-hidden shadow-lg bg-gray-100 dark:bg-gray-800">
        <img src="/dashboard-mockup.jpg" alt="Dashboard Mockup" className="w-full h-auto object-cover" />
      </div>
    </section>
  );
}
