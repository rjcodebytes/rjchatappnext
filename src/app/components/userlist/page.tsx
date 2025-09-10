"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = process.env.CLIENT_URL as string;

const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"],
  path: "/socket.io",
  autoConnect: true,
  withCredentials: true,
});

type User = {
  username: string;
};

export default function UserList({ onSelect }: { onSelect: (user: string) => void }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  // ✅ Fetch logged-in user and register as online
  useEffect(() => {
    const fetchSession = async () => {
      const res = await fetch("/api/session");
      const data = await res.json();
      if (data.loggedIn) {
        setCurrentUser(data.username);
        socket.emit("userOnline", data.username);
      }
    };
    fetchSession();
  }, []);

  // ✅ Fetch all users from DB
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.success) setUsers(data.users);
    };
    fetchUsers();
  }, []);

  // ✅ Listen for online user updates
  useEffect(() => {
    socket.on("updateUsers", (onlineList: string[]) => {
      setOnlineUsers(onlineList);
    });

    return () => {
      socket.off("updateUsers");
    };
  }, []);

  return (
    <div className="w-72 h-full overflow-y-auto bg-gradient-to-b from-green-500 via-green-600 to-green-800 text-white shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-green-400 bg-green-700/60 backdrop-blur-md">
        <h2 className="text-lg font-bold tracking-wide">Chats</h2>
      </div>

      {/* User List */}
      <ul className="divide-y divide-green-400/30">
        {users
          .filter((u) => u.username !== currentUser)
          .map((user, idx) => (
            <li
              key={idx}
              className="flex items-center gap-3 p-3 cursor-pointer bg-white/10 hover:bg-white/20 rounded-xl m-2 transition transform hover:scale-105"
              onClick={() => onSelect(user.username)}
            >
              {/* Avatar with online dot */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-green-900 text-white flex items-center justify-center font-bold shadow-md">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-green-700 ${
                    onlineUsers.includes(user.username) ? "bg-green-400" : "bg-gray-400"
                  }`}
                ></span>
              </div>

              {/* User Info */}
              <div className="flex flex-col flex-1">
                <span className="font-semibold">{user.username}</span>
                <span className="text-xs text-gray-200">
                  {onlineUsers.includes(user.username) ? "Online" : "Offline"}
                </span>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
