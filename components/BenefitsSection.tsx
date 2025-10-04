export default function BenefitsSection() {
  return (
    <section className="py-16 px-4 bg-white dark:bg-[#181f2a]">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black dark:text-white">Why Choose Us?</h2>
        <p className="text-gray-600 dark:text-gray-300">Boost productivity, collaborate easily, and see real results. Trusted by teams for ease of use and success stories.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow text-center">
          <h3 className="font-semibold text-lg mb-2">Productivity Boost</h3>
          <p className="text-gray-600 dark:text-gray-300">Automated reminders, smart deadlines, and analytics help you get more done.</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow text-center">
          <h3 className="font-semibold text-lg mb-2">Ease of Use</h3>
          <p className="text-gray-600 dark:text-gray-300">Intuitive UI and simple onboarding for fast team adoption.</p>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow text-center">
          <h3 className="font-semibold text-lg mb-2">Team Success Stories</h3>
          <p className="text-gray-600 dark:text-gray-300">See how real teams improved collaboration and results with our app.</p>
        </div>
      </div>
    </section>
  );
}
