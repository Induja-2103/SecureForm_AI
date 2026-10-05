"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { sendChatMessage } from "@/app/actions/chat";

interface Message {
  role: "user" | "model";
  parts: { text: string }[];
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", parts: [{ text: "Hello! I'm CyberShield AI. How can I assist with your application security and form telemetry today?" }] }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const newMsg: Message = { role: "user", parts: [{ text: input }] };
    const newHistory = [...messages, newMsg];
    
    setMessages(newHistory);
    setInput("");
    setIsTyping(true);

    const response = await sendChatMessage(newHistory);
    
    setMessages([...newHistory, { role: "model", parts: [{ text: response.text }] }]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="animate-float"
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "2rem",
          width: "3.75rem",
          height: "3.75rem",
          borderRadius: "50%",
          background: "var(--cyber-blue-gradient)",
          color: "#FFFFFF",
          border: "1px solid rgba(0, 216, 246, 0.6)",
          boxShadow: "0 8px 25px rgba(47, 128, 237, 0.45), inset 0 1px 2px rgba(255, 255, 255, 0.4)",
          display: isOpen ? "none" : "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 1000,
          transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "scale(1.12)";
          e.currentTarget.style.boxShadow = "0 12px 35px rgba(0, 216, 246, 0.65)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 8px 25px rgba(47, 128, 237, 0.45)";
        }}
        title="CyberShield AI Intelligence Agent"
      >
        <MessageSquare size={24} color="#FFFFFF" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="animate-fade-in"
          style={{
            position: "fixed",
            bottom: "2rem",
            right: "2rem",
            width: "380px",
            height: "530px",
            backgroundColor: "rgba(11, 18, 32, 0.95)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(47, 128, 237, 0.35)",
            borderRadius: "16px",
            boxShadow: "0 20px 50px rgba(0, 0, 0, 0.85), 0 0 30px rgba(47, 128, 237, 0.25)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000,
            overflow: "hidden"
          }}
        >
          {/* Header */}
          <div style={{
            padding: "1.1rem 1.25rem",
            background: "linear-gradient(135deg, rgba(47, 128, 237, 0.25) 0%, rgba(0, 216, 246, 0.1) 100%)",
            borderBottom: "1px solid rgba(47, 128, 237, 0.25)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontWeight: 700, color: "#FFFFFF", fontFamily: "Space Grotesk, sans-serif" }}>
              <div style={{
                width: "28px",
                height: "28px",
                borderRadius: "8px",
                background: "var(--cyber-blue-gradient)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF"
              }}>
                <Bot size={18} />
              </div>
              <div>
                <span style={{ fontSize: "1rem" }}>CyberShield AI</span>
                <span style={{ display: "block", fontSize: "0.65rem", fontFamily: "JetBrains Mono, monospace", color: "var(--safe)" }}>• DEFENSE ASSISTANT</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: "0.3rem", borderRadius: "6px" }}
              onMouseOver={(e) => e.currentTarget.style.color = "var(--accent-cyan)"}
              onMouseOut={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div style={{
            flex: 1,
            padding: "1.25rem",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                display: "flex",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
                gap: "0.6rem",
                alignItems: "flex-end"
              }}>
                <div style={{
                  width: "30px", height: "30px", borderRadius: "50%",
                  backgroundColor: msg.role === "user" ? "rgba(47, 128, 237, 0.2)" : "rgba(0, 229, 160, 0.2)",
                  border: msg.role === "user" ? "1px solid rgba(47, 128, 237, 0.4)" : "1px solid rgba(0, 229, 160, 0.4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: msg.role === "user" ? "var(--accent-cyan)" : "var(--safe)", flexShrink: 0
                }}>
                  {msg.role === "user" ? <User size={15} /> : <Bot size={16} />}
                </div>
                <div style={{
                  maxWidth: "75%",
                  padding: "0.85rem 1.1rem",
                  borderRadius: "14px",
                  borderBottomRightRadius: msg.role === "user" ? "4px" : "14px",
                  borderBottomLeftRadius: msg.role === "model" ? "4px" : "14px",
                  backgroundColor: msg.role === "user" ? "linear-gradient(135deg, rgba(47, 128, 237, 0.2) 0%, rgba(0, 216, 246, 0.1) 100%)" : "rgba(17, 28, 48, 0.9)",
                  border: msg.role === "user" ? "1px solid rgba(47, 128, 237, 0.35)" : "1px solid rgba(47, 128, 237, 0.2)",
                  color: "var(--text-primary)",
                  fontSize: "0.875rem",
                  lineHeight: 1.5,
                  whiteSpace: "pre-wrap",
                  boxShadow: msg.role === "user" ? "0 4px 15px rgba(47, 128, 237, 0.2)" : "0 4px 15px rgba(0, 0, 0, 0.4)"
                }}>
                  {msg.parts[0].text}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div style={{ display: "flex", gap: "0.6rem", alignItems: "flex-end" }}>
                <div style={{ width: "30px", height: "30px", borderRadius: "50%", backgroundColor: "rgba(0, 229, 160, 0.2)", border: "1px solid rgba(0, 229, 160, 0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--safe)" }}>
                  <Bot size={16} />
                </div>
                <div style={{ padding: "0.75rem 1rem", borderRadius: "14px", backgroundColor: "rgba(17, 28, 48, 0.9)", border: "1px solid rgba(47, 128, 237, 0.25)", color: "var(--accent-cyan)", fontSize: "0.85rem", fontFamily: "JetBrains Mono, monospace" }}>
                  Analyzing security telemetry...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} style={{
            padding: "1rem",
            borderTop: "1px solid rgba(47, 128, 237, 0.2)",
            display: "flex",
            gap: "0.6rem",
            backgroundColor: "rgba(7, 13, 24, 0.95)"
          }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask CyberShield Assistant..."
              style={{
                flex: 1,
                padding: "0.75rem 1.1rem",
                borderRadius: "20px",
                border: "1px solid rgba(47, 128, 237, 0.25)",
                backgroundColor: "rgba(17, 28, 48, 0.95)",
                color: "var(--text-primary)",
                outline: "none",
                fontSize: "0.875rem"
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "var(--accent-cyan)"}
              onBlur={(e) => e.currentTarget.style.borderColor = "rgba(47, 128, 237, 0.25)"}
            />
            <button
              type="submit"
              disabled={isTyping || !input.trim()}
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: input.trim() && !isTyping ? "var(--cyber-blue-gradient)" : "rgba(47, 128, 237, 0.15)",
                color: input.trim() && !isTyping ? "#FFFFFF" : "var(--text-muted)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: input.trim() && !isTyping ? "pointer" : "not-allowed",
                transition: "all 0.25s ease",
                boxShadow: input.trim() && !isTyping ? "0 0 15px rgba(0, 216, 246, 0.5)" : "none"
              }}
            >
              <Send size={18} style={{ marginLeft: "-2px" }} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
