import FloatingShape from "components/FloatingShape";


export default function Home() {
  return (
    <div>
      <div className="mt-6 flex gap-4">
        <a
          href="/login"
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition"
        >
          Login
        </a>
        <a
          href="/signup"
          className="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-600 transition"
        >
          Sign Up
        </a>
      </div>
    </div>
  );
}