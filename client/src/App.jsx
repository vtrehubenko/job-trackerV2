import { useEffect, useMemo, useState } from "react";
import JobForm from "./components/JobForm";
import JobList from "./components/JobList";
import "./App.css";
import { jobsApi } from "./api/vacancies";

const STORAGE_KEY = "job-tracker.jobs.v1";

<option value="all">All</option>;

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        const data = await jobsApi.list();
        setJobs(Array.isArray(data) ? data : (data.items ?? []));
      } catch (e) {
        console.log("Failed to load jobs", e);
      }
    })();
  }, []);

  async function addJob(newJob) {
    const created = await jobsApi.create(newJob);
    setJobs((prev) => [created, ...prev]);
  }

  async function deleteJob(id) {
    await jobsApi.remove(id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
  }

  async function updateJob(id, patch) {
    const updated = await jobsApi.update(id, patch);
    setJobs((prev) => prev.map((j) => (j.id === id ? updated : j)));
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
          <option value="APPLIED">Applied</option>
          <option value="INTERVIEW">Interview</option>
          <option value="OFFER">Offer</option>
          <option value="REJECTED">Rejected</option>
          <option value="WISHLIST">Wishlist</option>
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
