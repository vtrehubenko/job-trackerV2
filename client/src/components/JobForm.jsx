import { useMemo, useState } from "react";

const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

function uid() {
  // быстрый id (норм для local apps)
  return crypto?.randomUUID?.() ?? String(Date.now()) + Math.random().toString(16).slice(2);
}

export default function JobForm({ onAdd }) {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("Applied");
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [date, setDate] = useState(today);

  function submit(e) {
    e.preventDefault();

    const c = company.trim();
    const p = position.trim();

    if (!c || !p) return;

    function normalizeUrl(input) {
  const value = (input || "").trim();
  if (!value) return "";
  // если человек ввёл "example.com" или "www.example.com"
  if (!/^https?:\/\//i.test(value)) return `https://${value}`;
  return value;
}


    onAdd({
      id: uid(),
      company: c,
      position: p,
      status,
      link: normalizeUrl(link),
      notes: notes.trim(),
      date,
      createdAt: Date.now(),
    });

    // сброс
    setCompany("");
    setPosition("");
    setStatus("Applied");
    setLink("");
    setNotes("");
    setDate(today);
  }

  return (
    <form className="form" onSubmit={submit}>
      <div className="row">
        <div className="field">
          <label>Company *</label>
          <input
            className="input"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="e.g., Google"
            required
          />
        </div>

        <div className="field">
          <label>Position *</label>
          <input
            className="input"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="e.g., Junior Frontend Developer"
            required
          />
        </div>
      </div>

      <div className="row">
        <div className="field">
          <label>Status</label>
          <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="field">
          <label>Date</label>
          <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="field">
          <label>Link</label>
          <input
            className="input"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="field">
        <label>Notes</label>
        <textarea
          className="textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Short notes…"
          rows={3}
        />
      </div>

      <div className="actions">
        <button className="btn" type="submit">
          Add application
        </button>
        <span className="hint">* required</span>
      </div>
    </form>
  );
}
