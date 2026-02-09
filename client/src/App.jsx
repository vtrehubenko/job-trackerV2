import { useEffect, useMemo, useState } from "react";
import JobForm from "./components/JobForm";
import JobList from "./components/JobList";
import "./App.css";

const STORAGE_KEY = "job-tracker.jobs.v1";

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) setJobs(parsed);
    } catch {
      // ignore
    }
  }, []);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  }, [jobs]);

  function addJob(newJob) {
    setJobs((prev) => [newJob, ...prev]);
  }

  function deleteJob(id) {
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }

  function updateJob(id, patch) {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...patch } : j)));
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs.filter((j) => {
      const matchesQuery =
        !q ||
        j.company.toLowerCase().includes(q) ||
        j.position.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || j.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [jobs, query, statusFilter]);

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Job Tracker</h1>
          <p className="sub">React + Vite • CRUD • localStorage</p>
        </div>
      </header>

      <section className="card">
        <JobForm onAdd={addJob} />
      </section>

      <section className="toolbar">
        <input
          className="input"
          placeholder="Search by company or position…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <select
          className="select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        <div className="meta">
          Total: <b>{jobs.length}</b> • Showing: <b>{filtered.length}</b>
        </div>
      </section>

      <section className="card">
        <JobList jobs={filtered} onDelete={deleteJob} onUpdate={updateJob} />
      </section>
    </div>
  );
}
