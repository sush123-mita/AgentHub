import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import AgentCard from '../components/AgentCard';
import CategoryCard from '../components/CategoryCard';
import { getFeatured, getTrending } from '../api';

const CATEGORIES = [
  { icon: '💻', label: 'Coding' },
  { icon: '✍️', label: 'Writing' },
  { icon: '⚡', label: 'Productivity' },
  { icon: '📚', label: 'Study' },
  { icon: '🎯', label: 'Career' },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getFeatured().then(r => setFeatured(r.data)).catch(() => {});
    getTrending().then(r => setTrending(r.data)).catch(() => {});
  }, []);

  const handleSearch = (val) => {
    setSearch(val);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && search.trim().length > 0) {
      navigate(`/marketplace?search=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>
            Discover the Best <span className="highlight">AI Agents</span> for Any Task
          </h1>
          <p>
            Explore, try, and integrate powerful AI agents built by developers worldwide.
            Your one-stop marketplace for intelligent automation.
          </p>
          <SearchBar value={search} onChange={handleSearch} onKeyDown={handleKeyDown} placeholder="Search for AI agents — resume, code, writing..." />
          <div className="hero-stats">
            <div className="stat">
              <div className="stat-value">50+</div>
              <div className="stat-label">AI Agents</div>
            </div>
            <div className="stat">
              <div className="stat-value">10K+</div>
              <div className="stat-label">Uses Today</div>
            </div>
            <div className="stat">
              <div className="stat-value">4.7</div>
              <div className="stat-label">Avg Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section">
        <div className="section-header">
          <h2>🗂️ Browse by Category</h2>
          <a href="/marketplace">View all <ArrowRight size={16} /></a>
        </div>
        <div className="categories-grid">
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.label}
              icon={cat.icon}
              label={cat.label}
              onClick={() => navigate(`/marketplace?category=${cat.label}`)}
            />
          ))}
        </div>
      </section>

      {/* Trending */}
      {trending.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-header">
            <h2>🔥 Trending Now</h2>
            <a href="/marketplace?sort=popular">View all <ArrowRight size={16} /></a>
          </div>
          <div className="agents-grid">
            {trending.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="section-header">
            <h2>⭐ Featured Agents</h2>
            <a href="/marketplace">View all <ArrowRight size={16} /></a>
          </div>
          <div className="agents-grid">
            {featured.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section" style={{ textAlign: 'center', paddingBottom: '5rem' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>
          Built an AI Agent? 🚀
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: 480, margin: '0 auto 1.5rem' }}>
          Publish your agent on AgentHub and reach thousands of users instantly.
        </p>
        <button
          className="btn btn-primary-solid"
          onClick={() => navigate('/add-agent')}
          style={{ fontSize: '1rem', padding: '14px 32px' }}
        >
          <Zap size={18} /> Publish Your Agent
        </button>
      </section>
    </div>
  );
}
