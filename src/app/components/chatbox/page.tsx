"use client";

import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

const socket = io(process.env.CLIENT_URL as string, {
  transports: ["websocket"], // optional, improves reliability
});

type Message = {
  sender: string;
  recipient: string;
  text: string;
  time: string;
};

export default function ChatBox({ recipient }: { recipient: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState<string>("");
  const [isTyping, setIsTyping] = useState(false);
  const [recipientTyping, setRecipientTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch username and setup socket listeners
  useEffect(() => {
    fetch("/api/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.loggedIn) {
          setUsername(data.username);
          socket.emit("register", data.username);
        }
      });

    socket.on("private_message", (msg: Message) => {
      // Only add incoming messages, avoid duplicating sender's messages
      if (msg.sender !== username) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on("typing", ({ from }) => {
      if (from === recipient) {
        setRecipientTyping(true);
        setTimeout(() => setRecipientTyping(false), 2000);
      }
    });

    return () => {
      socket.off("private_message");
      socket.off("typing");
    };
  }, [recipient, username]);

  const sendMessage = () => {
    if (!input.trim() || !username) return;

    const msg: Message = {
      sender: username,
      recipient,
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Emit to server
    socket.emit("private_message", msg);

    // Add message locally immediately
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (!isTyping) {
      setIsTyping(true);
      socket.emit("typing", { to: recipient, from: username });
      setTimeout(() => setIsTyping(false), 1500);
    }
  };

  return (
    <div className="flex flex-col flex-1 h-full bg-[#ECE5DD]">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages
          .filter(
            (m) =>
              (m.sender === username && m.recipient === recipient) ||
              (m.sender === recipient && m.recipient === username)
          )
          .map((m, i) => (
            <div
              key={i}
              className={`flex ${m.sender === username ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 max-w-xs rounded-2xl ${m.sender === username
                    ? "bg-[#25D366] text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none border border-gray-300"
                  }`}
              >
                <p>{m.text}</p>
                <span className="text-xs text-gray-200 block mt-1 text-right">
                  {m.time}
                </span>
              </div>
            </div>
          ))}

        {recipientTyping && (
          <div className="text-sm text-gray-600 italic">{recipient} is typing...</div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-3 flex bg-white border-t">
        <input
          className="flex-1 border rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-green-400"
          placeholder={`Message @${recipient}`}
          value={input}
          onChange={handleTyping}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="ml-2 bg-[#25D366] text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
          onClick={sendMessage}
        >
          ➤
        </button>
      </div>
    </div>
  );
}
