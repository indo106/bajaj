import { useState } from "react";

export default function Export() {
  const [password, setPassword] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("");

  const handleExport = async () => {
    if (!password || !date) {
      setStatus("❌ Password and date required");
      return;
    }

    setStatus("⏳ Downloading...");

    try {
      const res = await fetch(
        "/api/export",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, date })
        }
      );

      if (!res.ok) {
        const data = await res.json();
        setStatus("❌ " + data.message);
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `loan-${date}.xlsx`;
      a.click();

      setStatus("✅ Excel downloaded");
    } catch (err) {
      console.error(err);
      setStatus("❌ Server error");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Admin Export</h2>

      <input
        type="password"
        placeholder="Admin password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <br /><br />

      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
      />

      <br /><br />

      <button onClick={handleExport}>
        Download Excel
      </button>

      <p>{status}</p>
    </div>
  );
}
