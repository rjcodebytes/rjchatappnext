"use client";
import { useRouter } from "next/navigation";
import { FaComments, FaUserPlus, FaSignInAlt } from "react-icons/fa";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-green-200 overflow-hidden">
      {/* Floating circles animation */}
      <div className="absolute w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse bottom-10 right-10"></div>

      {/* Main content card */}
      <div className="relative z-10 text-center bg-white p-10 rounded-2xl shadow-2xl max-w-lg w-full">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-3 flex items-center justify-center gap-2">
          🚀 Welcome
        </h1>
        <p className="text-gray-600 mb-8">
          Chat instantly with friends in real time. <br />
          <span className="text-blue-600 font-medium">Fast</span>,{" "}
          <span className="text-green-600 font-medium">secure</span>, and{" "}
          <span className="text-purple-600 font-medium">simple</span>.
        </p>

        {/* Action buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => router.push("/pages/login")}
            className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
          >
            <FaSignInAlt /> Login
          </button>

          <button
            onClick={() => router.push("/pages/signup")}
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
          >
            <FaUserPlus /> Sign Up
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-gray-700 text-sm">
        Made with 💙 by <span className="font-semibold">YourChatApp</span>
      </footer>
    </div>
  );
}
