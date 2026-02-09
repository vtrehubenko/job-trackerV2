const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

function formatDate(iso) {
  if (!iso) return "";
  return iso;
}

export default function JobCard({ job, onDelete, onUpdate }) {
  const { id, company, position, status, link, notes, date } = job;

  return (
    <div className="job">
      <div className="jobTop">
        <div className="jobTitle">
          <div className="company">{company}</div>
          <div className="position">{position}</div>
        </div>

        <button className="btn ghost danger" onClick={() => onDelete(id)}>
          Delete
        </button>
      </div>

      <div className="jobMid">
        <div className="pill">
          <span className="label">Status</span>
          <select
            className="select small"
            value={status}
            onChange={(e) => onUpdate(id, { status: e.target.value })}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="pill">
          <span className="label">Date</span>
          <span className="value">{formatDate(date)}</span>
        </div>

        {link ? (
          <a className="pill link" href={link} target="_blank" rel="noreferrer">
            Open vacancy
          </a>
        ) : (
          <div className="pill muted">No link</div>
        )}
      </div>

      {notes ? <div className="notes">{notes}</div> : null}
    </div>
  );
}
