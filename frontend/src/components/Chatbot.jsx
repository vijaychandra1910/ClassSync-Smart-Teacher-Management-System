import React, { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User } from "lucide-react";

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "You are a helpful assistant for ClassSync. Only answer questions related to dashboards, schedules, teachers, substitutions, and user roles.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => scrollToBottom(), [messages]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const url = `${apiUrl}${apiUrl.endsWith("/") ? "" : "/"}api/chatbot/ask`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${res.status}`);
      }

      const data = await res.json();
      const reply = data.reply || data.error || "Sorry, no response received.";
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content:
            err.message || "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button with 3D Model */}
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="relative w-[70px] h-[70px] rounded-full flex items-center justify-center bg-gradient-to-r from-indigo-500 to-indigo-600 overflow-hidden shadow-lg hover:scale-105 transition-all"
        >
          {open ? (
            <X className="w-8 h-8 text-white" />
          ) : (
            <model-viewer
              src="/bot2.glb"
              alt="Bot model"
              camera-controls
              auto-rotate
              rotation-per-second="20deg"
              disable-zoom
              autoplay
              interaction-prompt="none"
              style={{
                width: "100%",
                height: "100%",
                background: "transparent",
              }}
            ></model-viewer>
          )}

          {!open && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          )}
        </button>
      </div>

      {/* Chat Window */}
      {open && (
        <div
          ref={chatRef}
          className="absolute bottom-16 right-0 w-[90vw] sm:w-96 h-[32rem] bg-white/95 backdrop-blur-md border border-indigo-100 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 animate-in slide-in-from-bottom-4 fade-in"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-600 px-6 py-4 text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shadow-lg border border-white/30">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg tracking-tight">
                  ClassSync Assistant
                </h3>
                <p className="text-indigo-100 text-xs font-medium mt-0.5">
                  Always here to help
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 h-80 scrollbar-thin">
            {messages
              .filter((msg) => msg.role !== "system")
              .map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <Bot className="w-5 h-5" />
                    )}
                  </div>
                  <div
                    className={`max-w-[78%] rounded-2xl shadow-sm ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-tr-sm"
                        : "bg-gray-100 text-gray-800 border border-gray-200 rounded-tl-sm"
                    }`}
                  >
                    <div className="px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center shadow-sm">
                  <Bot className="w-5 h-5 text-gray-600" />
                </div>
                <div className="bg-gray-100 border border-gray-200 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.15s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.3s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  rows="1"
                  className="w-full resize-none border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm placeholder-gray-400 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 bg-white text-gray-800"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Ask about dashboards, schedules..."
                  disabled={isTyping}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 bottom-2 w-9 h-9 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg flex items-center justify-center transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
