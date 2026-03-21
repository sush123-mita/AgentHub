import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import AgentCard from '../components/AgentCard';
import { getAgents } from '../api';

const CATEGORIES = ['All', 'Coding', 'Writing', 'Productivity', 'Study', 'Career'];

export default function Marketplace() {
  const [searchParams, setSearchParams] = useSearchParams(); // eslint-disable-line no-unused-vars
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category && category !== 'All') params.category = category;
    if (sort) params.sort = sort;

    getAgents(params)
      .then(r => setAgents(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, category, sort]);

  // Sync URL params
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (searchParams.get('search')) setSearch(searchParams.get('search'));
    if (searchParams.get('category')) setCategory(searchParams.get('category'));
    if (searchParams.get('sort')) setSort(searchParams.get('sort'));
  }, [searchParams]);

  return (
    <div>
      <div className="marketplace-header">
        <div className="marketplace-header-inner">
          <h1>🛍️ Agent Marketplace</h1>
          <p>Browse and discover AI agents for every use case</p>
          <SearchBar value={search} onChange={setSearch} placeholder="Search agents..." light />
          <div className="filters" style={{ marginTop: '1rem' }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${category === cat ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
            <select
              className="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      <section className="section">
        {loading ? (
          <div className="loading"><div className="spinner" /></div>
        ) : agents.length === 0 ? (
          <div className="empty-state">
            <div className="icon">🔍</div>
            <h3>No agents found</h3>
            <p>Try a different search or category</p>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Showing {agents.length} agent{agents.length !== 1 ? 's' : ''}
            </p>
            <div className="agents-grid">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
