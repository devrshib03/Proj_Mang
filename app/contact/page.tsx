import Header from "components/Header";
import Footer from "components/Footer";

export default function ContactPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <section className="py-16 px-4 bg-white dark:bg-[#181f2a]">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4 text-black dark:text-white">Contact Us</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Have questions or feedback? We’d love to hear from you.
          </p>
          <a className="inline-block px-6 py-3 rounded bg-indigo-700 text-white font-semibold" href="mailto:support@dailytm.app">Email support@dailytm.app</a>
        </div>
      </section>
      <Footer />
    </main>
  );
}


