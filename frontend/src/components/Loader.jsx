export function Loader({ show, label = 'Loading...' }) {
  if (!show) return null;
  return (
    <div className="loader-overlay">
      <div className="spinner" />
      <div className="loader-label">{label}</div>
    </div>
  );
}
