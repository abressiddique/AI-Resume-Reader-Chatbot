import React, { useState, useRef, useEffect } from "react";
import "./App.css";

export default function App() {
  const [messages, setMessages] = useState([
    { id: 1, role: "bot", text: "Hi! Upload a resume (PDF / PNG / JPG) and I'll extract the key fields." },
  ]);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef(null);
  const chatEndRef = useRef(null);

  const appendMessage = (msg) => setMessages((m) => [...m, { id: Date.now(), ...msg }]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    appendMessage({ role: "user", text: `Uploaded file: ${file.name}` });

    const form = new FormData();
    form.append("file", file);

    setLoading(true);
    appendMessage({ role: "bot", text: "Processing your resume..." });

    try {
      const res = await fetch("http://127.0.0.1:8000/upload_resume/", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.detail || `Server responded with ${res.status}`);
      }

      const data = await res.json();
      let parsed = data.resume_data;

      if (typeof parsed === "string") {
        try {
          parsed = JSON.parse(parsed);
        } catch (e) {
          const start = parsed.indexOf("{");
          const end = parsed.lastIndexOf("}");
          if (start !== -1 && end !== -1) parsed = JSON.parse(parsed.substring(start, end + 1));
        }
      }

      setMessages((prev) => prev.filter((m) => !(m.role === "bot" && m.text === "Processing your resume...")));
      appendMessage({ role: "bot", text: "Here are the extracted fields:", table: parsed });
    } catch (err) {
      setMessages((prev) => prev.filter((m) => !(m.role === "bot" && m.text === "Processing your resume...")));
      appendMessage({ role: "bot", text: `Error: ${err.message}` });
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = null;
    }
  };

  const renderBubble = (msg) => {
    const isUser = msg.role === "user";
    return (
      <div
        key={msg.id}
        style={{
          display: "flex",
          justifyContent: isUser ? "flex-end" : "flex-start",
          width: "100%",
          margin: "10px 0",
        }}
      >
        <div
          style={{
            maxWidth: "70%",
            padding: "14px 18px",
            borderRadius: 12,
            color: "#333",
            background: isUser ? "#DCF8C6" : "#F1F0F0",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            whiteSpace: "pre-wrap",
            textAlign: "left",
          }}
        >
          <div style={{ fontSize: 14 }}>{msg.text}</div>
          {msg.table && renderTable(msg.table)}
        </div>
      </div>
    );
  };

  const renderTable = (data) => {
    if (!data || typeof data !== "object") return null;

    const fieldOrder = [
      "Name", "Email", "Phone Number", "Skills", "Years of Experience",
      "Education", "Current/Last Job", "Companies Worked At", "LinkedIn",
      "Certifications", "Location",
    ];

    return (
      <div style={{ marginTop: 10, overflowX: "auto" }}>
        <table style={{ borderCollapse: "collapse", minWidth: 500 }}>
          <tbody>
            {fieldOrder.map((key, i) => {
              if (!(key in data)) return null;
              const value = data[key];
              return (
                <tr key={key} style={{ background: i % 2 === 0 ? "#fafafa" : "#fff" }}>
                  <td style={{ border: "1px solid #e0e0e0", padding: 10, fontWeight: 600, width: "35%", verticalAlign: "top" }}>{key}</td>
                  <td style={{ border: "1px solid #e0e0e0", padding: 10 }}>
                    {Array.isArray(value) ? <ul style={{ margin: 0, paddingLeft: 18 }}>{value.map((v, i) => <li key={i}>{v}</li>)}</ul> : <span>{value || "—"}</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        padding: 16,
        background: "#f5f5f5",
      }}
    >
      <h1 style={{ textAlign: "center" , color:"black", marginBottom: 16 }}>AI Resume Reader Chatbot</h1>

      <div
        style={{
          flex: 1,
          width: "100%",
          maxWidth: 800,
          overflowY: "auto",
          padding: 16,
          border: "1px solid #eee",
          borderRadius: 8,
          background: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {messages.map(renderBubble)}
        <div ref={chatEndRef} />
      </div>

      <div style={{ marginTop: 12, display: "flex", gap: 8, justifyContent: "center", alignItems: "center" }}>
        <input ref={fileRef} type="file" accept=".pdf,image/png,image/jpeg" onChange={handleFileChange} style={{ display: "none" }} />
        <button
          onClick={() => fileRef.current && fileRef.current.click()}
          style={{ padding: "10px 16px", borderRadius: 6, background: "#4CAF50", color: "#fff", border: "none", cursor: "pointer" }}
        >
          Choose File
        </button>
        <div style={{ fontSize: 13, color: "#666" }}>{loading ? "Processing..." : "Ready"}</div>
      </div>

      <footer style={{ marginTop: 16, textAlign: "center", fontSize: 12, color: "#888" }}>
        Backend: http://127.0.0.1:8000/upload_resume/
      </footer>
    </div>
  );
}
