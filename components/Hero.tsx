export default function Hero() {
  return (
    <section className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-[#181f2a]">
      <h1 className="text-5xl font-bold mb-4">
        Your personal workspace for <span className="text-indigo-500 dark:text-blue-400">better productivity</span>
      </h1>
      <p className="text-lg mb-8 max-w-xl mx-auto text-gray-600 dark:text-gray-300">
        Organize your projects, tasks, and goals in one place. Stay focused and achieve more with your personal command center.
      </p>
      <div className="flex gap-4 justify-center">
        <button className="px-6 py-3 rounded font-semibold bg-indigo-700 text-white dark:bg-blue-700">Start for Free</button>
        <button className="px-6 py-3 rounded font-semibold border border-indigo-700 text-indigo-700 dark:border-blue-700 dark:text-blue-400">Watch Demo</button>
      </div>
    </section>
  );
}
