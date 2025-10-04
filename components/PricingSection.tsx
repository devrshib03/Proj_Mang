export default function PricingSection() {
  return (
    <section className="py-16 px-4 bg-white dark:bg-[#181f2a]">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black dark:text-white">Pricing</h2>
        <p className="text-gray-600 dark:text-gray-300">Choose a plan that fits your needs. Start free, upgrade anytime.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow text-center">
          <h3 className="font-semibold text-lg mb-2">Starter</h3>
          <p className="text-gray-600 dark:text-gray-300">Free / Trial plan. Basic features for individuals.</p>
          <button className="mt-4 px-6 py-2 rounded bg-indigo-700 text-white font-semibold">Start Free Trial</button>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow text-center">
          <h3 className="font-semibold text-lg mb-2">Pro</h3>
          <p className="text-gray-600 dark:text-gray-300">Advanced features for growing teams.</p>
          <button className="mt-4 px-6 py-2 rounded bg-indigo-700 text-white font-semibold">Start Free Trial</button>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow text-center">
          <h3 className="font-semibold text-lg mb-2">Enterprise</h3>
          <p className="text-gray-600 dark:text-gray-300">Custom solutions for large organizations.</p>
          <button className="mt-4 px-6 py-2 rounded bg-indigo-700 text-white font-semibold">Start Free Trial</button>
        </div>
      </div>
    </section>
  );
}
