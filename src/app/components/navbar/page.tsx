"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ChatHeader() {
  const [username, setUsername] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) setUsername(data.username);
      });
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    router.push("/"); // redirect to home/login
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-green-600 text-white shadow-md">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center text-lg font-bold">
            {username ? username.charAt(0).toUpperCase() : "?"}
          </div>
          {username && (
            <span className="absolute bottom-0 right-0 block w-3 h-3 bg-green-400 border-2 border-green-600 rounded-full"></span>
          )}
        </div>
        <div className="flex flex-col">
          <span className="font-semibold">{username ?? "Guest"}</span>
          <span className="text-sm text-green-100">
            {username ? "Online" : "Not logged in"}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 relative">
       

        {/* Menu Button */}
        <button
          className="hover:bg-green-700 p-2 rounded-full transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ⋮
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute top-12 right-0 bg-white text-gray-800 rounded-lg shadow-lg w-40 z-50">
            <button
              onClick={() => router.push("/profile")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              👤 Profile
            </button>
            <button
              onClick={() => router.push("/settings")}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              ⚙️ Settings
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
