// Filter button bar component
// Receives the active filter and a callback to change it
function Filters({ current, onChange }) {
  const filters = ['all', 'active', 'done'];

  return (
    <div className="filters">
      {filters.map(f => (
        <button
          key={f}
          className={`filter-btn ${current === f ? 'active' : ''}`}
          onClick={() => onChange(f)}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  );
}
