"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react"; // chat bubble icon

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

 const handleLogin = async () => {
  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("authToken", data.token || "dummy-token"); // 🔑 save token
      router.push("/pages/chatpage"); // adjust path depending on your folder
    } else {
      setError(data.message || "Login failed");
    }
  } catch (err) {
    setError("Server error, try again");
  }
};


  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-96 flex flex-col items-center">
        {/* App Title */}
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className="w-8 h-8 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800">ChatApp Login</h2>
        </div>

        {/* Username */}
        <input
          type="text"
          placeholder="Enter username"
          className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none p-2 rounded-md mb-3 w-full"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Enter password"
          className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 outline-none p-2 rounded-md mb-3 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Error */}
        {error && (
          <p className="text-red-500 text-sm mb-3 w-full text-center">{error}</p>
        )}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 w-full transition"
        >
          Login
        </button>

        {/* Home Button */}
        <button
          onClick={() => router.push("/")}
          className="mt-3 px-4 py-2 bg-gray-400 text-white font-medium rounded-md hover:bg-gray-500 w-full transition"
        >
          ⬅ Back to Home
        </button>
      </div>
    </div>
  );
}
