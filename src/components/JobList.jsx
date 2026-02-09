import JobCard from "./JobCard";

export default function JobList({ jobs, onDelete, onUpdate }) {
  if (jobs.length === 0) {
    return <div className="empty">No applications yet. Add your first one 👆</div>;
  }

  return (
    <div className="list">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </div>
  );
}
