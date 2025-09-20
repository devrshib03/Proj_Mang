const features = [
  {
    title: 'Task Management',
    description: 'Kanban, Table, and Calendar views for flexible task tracking.',
    icon: '🗂️',
  },
  {
    title: 'Team Collaboration',
    description: 'Chat, comments, and notifications for seamless teamwork.',
    icon: '💬',
  },
  {
    title: 'Smart Reminders & Deadlines',
    description: 'Never miss a deadline with automated reminders.',
    icon: '⏰',
  },
  {
    title: 'Reports & Analytics',
    description: 'Track progress and productivity with insightful analytics.',
    icon: '📊',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-16 bg-gray-50 dark:bg-[#232a38] px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2 text-black dark:text-white">Key Features</h2>
        <p className="text-gray-600 dark:text-gray-300">Everything you need to simplify your projects and boost productivity</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {features.map((feature, idx) => (
          <div key={idx} className="shadow rounded-lg p-8 flex flex-col items-center bg-white dark:bg-[#181f2a] dark:text-white">
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="font-semibold text-xl mb-2 text-center">{feature.title}</h3>
            <p className="text-center text-gray-600 dark:text-gray-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
