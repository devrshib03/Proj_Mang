const features = [
  {
    title: 'Seamless Collaboration',
    description: 'Effortless and efficient project tracking when working with others.',
    icon: '🤝',
  },
  {
    title: 'All-in-One Solution',
    description: 'Manage everything from tasks to goals in one integrated workspace.',
    icon: '🗂️',
  },
  {
    title: 'Customizable Workflow',
    description: 'Personalize your workspace with flexible tools for your unique style.',
    icon: '⚙️',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 bg-gray-50 dark:bg-[#232a38]">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2 text-black dark:text-white">Essential features for personal success</h2>
        <p className="text-gray-600 dark:text-gray-300">Everything you need to simplify your projects and boost productivity</p>
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        {features.map((feature, idx) => (
          <div key={idx} className="shadow rounded-lg p-8 w-80 flex flex-col items-center bg-white dark:bg-[#181f2a] dark:text-white">
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
            <p className="text-center text-gray-600 dark:text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
