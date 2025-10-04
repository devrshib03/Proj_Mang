export default function HowItWorks() {
  return (
    <section className="py-16 px-4 bg-white dark:bg-[#181f2a]">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black dark:text-white">How It Works</h2>
        <p className="text-gray-600 dark:text-gray-300">Get started in just three steps and boost your productivity.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-blue-900">
            <span className="text-3xl">📁</span>
          </div>
          <h3 className="font-semibold text-lg mb-2">Create a Project</h3>
          <p className="text-gray-600 dark:text-gray-300 text-center">Start by setting up your project workspace.</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-blue-900">
            <span className="text-3xl">🤝</span>
          </div>
          <h3 className="font-semibold text-lg mb-2">Add Tasks & Collaborate</h3>
          <p className="text-gray-600 dark:text-gray-300 text-center">Assign tasks, invite teammates, and work together.</p>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-blue-900">
            <span className="text-3xl">📈</span>
          </div>
          <h3 className="font-semibold text-lg mb-2">Track Progress & Results</h3>
          <p className="text-gray-600 dark:text-gray-300 text-center">Monitor your progress and celebrate achievements.</p>
        </div>
      </div>
    </section>
  );
}
