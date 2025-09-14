

export default function Home() {
  return (
    <div className="flex justify-center items-center text-center min-h-screen p-4">
      <div className="mt-6 flex gap-4 flex-wrap ">
        <a
          href="/login"
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Login
        </a>
        <a
          href="/signup"
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Sign Up
        </a>

        <a
          href="/app/dashboard"
          className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 transition"
        >
          dashboard
        </a>
      </div>
    </div>
  );
}
