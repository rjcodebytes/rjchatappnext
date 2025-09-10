"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaUserAlt, FaLock, FaHome, FaUserPlus } from "react-icons/fa";

export default function SignUpPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Password rules
  const passwordCriteria =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleRegister = async () => {
    if (!username || !password) {
      setError("⚠️ Please fill all fields");
      return;
    }

    // 🔒 Validate password before sending
    if (!passwordCriteria.test(password)) {
      setError(
        "Password must be at least 8 characters, include uppercase, lowercase, number, and special character."
      );
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (data.success) {
        alert("✅ Registered successfully!");
        router.push("/pages/login");
      } else {
        setError(data.error || "❌ Registration failed");
      }
    } catch (err) {
      console.error(err);
      setError("⚠️ Server error, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-200 via-green-300 to-green-400">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-green-600 mb-6 flex items-center justify-center gap-2">
          <FaUserPlus /> Create Account
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {/* Username Input */}
        <div className="flex items-center border border-gray-300 rounded-lg mb-4 px-3">
          <FaUserAlt className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Enter your username"
            className="w-full p-3 outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Password Input */}
        <div className="flex items-center border border-gray-300 rounded-lg mb-6 px-3">
          <FaLock className="text-gray-500 mr-2" />
          <input
            type="password"
            placeholder="Enter password"
            className="w-full p-3 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 px-5 py-2 bg-gray-300 text-black rounded-lg hover:bg-gray-400 transition"
          >
            <FaHome /> Home
          </button>

          <button
            onClick={handleRegister}
            disabled={loading}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg shadow text-white font-semibold transition 
              ${loading ? "bg-green-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-600"}`}
          >
            {loading ? "Registering..." : <><FaUserPlus /> Register</>}
          </button>
        </div>
      </div>
    </div>
  );
}
