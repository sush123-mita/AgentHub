export default function CategoryCard({ icon, label, count, onClick }) {
  return (
    <div className="category-card" onClick={onClick}>
      <span className="icon">{icon}</span>
      <span className="label">{label}</span>
      {count !== undefined && <span className="count">{count} agents</span>}
    </div>
  );
}
