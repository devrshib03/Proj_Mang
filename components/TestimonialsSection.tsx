export default function TestimonialsSection() {
  return (
    <section className="py-16 px-4 bg-white dark:bg-[#181f2a]">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black dark:text-white">Testimonials</h2>
        <p className="text-gray-600 dark:text-gray-300">Hear from our users and partners.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow flex flex-col items-center">
          <img src="/avtar1.png" alt="User 1" className="w-16 h-16 rounded-full mb-4" />
          <blockquote className="italic text-gray-700 dark:text-gray-300 mb-2">"This app made our team so much more productive!"</blockquote>
          <span className="font-semibold text-gray-800 dark:text-gray-200">- Alex, Team Lead</span>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 shadow flex flex-col items-center">
          <img src="/avtar2.png" alt="User 2" className="w-16 h-16 rounded-full mb-4" />
          <blockquote className="italic text-gray-700 dark:text-gray-300 mb-2">"Easy to use and great for collaboration."</blockquote>
          <span className="font-semibold text-gray-800 dark:text-gray-200">- Priya, Project Manager</span>
        </div>
      </div>
      <div className="flex justify-center gap-8 mt-10">
        <img src="/company1.svg" alt="Company 1" className="h-8" />
        <img src="/company2.svg" alt="Company 2" className="h-8" />
      </div>
    </section>
  );
}
