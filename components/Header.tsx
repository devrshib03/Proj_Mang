import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between px-8 py-4 border-b bg-white dark:bg-[#181f2a] dark:border-gray-800">
      <div className="flex items-center gap-2">
        <span className="font-bold text-xl text-indigo-600 dark:text-indigo-400">DailyTM</span>
      </div>
      <nav className="flex gap-8">
        <Link href="/" className="text-black dark:text-white">Home</Link>
        <Link href="#features" className="text-black dark:text-white">Features</Link>
        <Link href="#pricing" className="text-black dark:text-white">Pricing</Link>
        <Link href="#contact" className="text-black dark:text-white">Contact</Link>
      </nav>
      <div className="flex items-center gap-4 relative">
        <Link href="/login" className="text-lg text-gray-700 dark:text-white">Sign In</Link>
        <div className="relative">
          <Link href="/signup" className="px-6 py-2 rounded-lg text-lg font-medium shadow bg-indigo-700 hover:bg-indigo-800 text-white dark:bg-blue-700 dark:hover:bg-blue-800">Get Started</Link>
        </div>
      </div>
    </header>
  );
}
