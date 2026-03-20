import { useNavigate } from 'react-router-dom';
import { Star, BarChart3 } from 'lucide-react';

export default function AgentCard({ agent }) {
  const navigate = useNavigate();

  return (
    <div
      className="agent-card"
      style={{ '--card-accent': agent.color }}
      onClick={() => navigate(`/agent/${agent.id}`)}
    >
      <div className="agent-card-header">
        <div
          className="agent-card-icon"
          style={{ background: `${agent.color}15`, color: agent.color }}
        >
          {agent.icon}
        </div>
        <div className="agent-card-info">
          <h3>{agent.name}</h3>
          <span className="category-badge">{agent.category}</span>
        </div>
      </div>

      <p className="agent-card-desc">{agent.description}</p>

      <div className="agent-card-tags">
        {agent.tags?.slice(0, 3).map((tag) => (
          <span className="tag" key={tag}>{tag}</span>
        ))}
      </div>

      <div className="agent-card-footer">
        <span className="rating">
          <Star size={14} fill="currentColor" />
          {agent.avgRating > 0 ? agent.avgRating : '–'}
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
            ({agent.totalRatings})
          </span>
        </span>
        <span className="usage">
          <BarChart3 size={14} />
          {agent.usageCount?.toLocaleString()} uses
        </span>
      </div>
    </div>
  );
}
