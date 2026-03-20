import { useState, useRef, useEffect } from 'react';
import { Search, Sparkles, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAiRecommendations } from '../api';

export default function SearchBar({ value, onChange, onKeyDown, placeholder, light }) {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleAiSearch = async () => {
    if (!value || value.trim().length === 0) return;
    setIsAiLoading(true);
    setShowDropdown(true);
    setAiResults([]); // Clear previous
    try {
      const res = await getAiRecommendations(value);
      setAiResults(res.data);
    } catch (err) {
      console.error('AI Suggestion error', err);
      const msg = err.response?.data?.error || 'Gemini AI is currently busy or quota exceeded. Please try again in a few moments.';
      setAiResults([{ id: 'error', name: 'AI Search currently unavailable', aiReason: msg }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectAgent = (id) => {
    if (id === 'error') return;
    setShowDropdown(false);
    navigate(`/agent/${id}`);
  };

  return (
    <div className={`search-bar-wrapper ${light ? 'search-light' : ''}`} ref={dropdownRef}>
      <Search className="search-bar-icon" size={20} />
      <input
        className="search-bar"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (onKeyDown) onKeyDown(e);
          if (e.key === 'Enter') setShowDropdown(false); // Close dropdown on normal search route
        }}
        placeholder={placeholder || 'Search AI agents...'}
      />
      
      {/* AI Suggestion Button inside the Search Bar */}
      <button 
        className="ai-btn" 
        onClick={handleAiSearch} 
        disabled={isAiLoading || !value || value.trim().length === 0}
        title="Ask AgentHub AI to recommend an agent"
      >
        {isAiLoading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
        {isAiLoading ? 'Thinking...' : 'AI Search'}
      </button>

      {/* AI Results Dropdown */}
      {showDropdown && (isAiLoading || aiResults.length > 0) && (
        <div className="ai-dropdown">
          <div className="ai-dropdown-header">
            <Sparkles size={16} /> 
            AI Recommendations
          </div>
          
          <div className="ai-dropdown-list">
            {isAiLoading && (
              <div className="ai-dropdown-item" style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                Analyzing query with Gemini AI...
              </div>
            )}
            
            {!isAiLoading && aiResults.map((agent) => (
              <div 
                key={agent.id} 
                className="ai-dropdown-item" 
                onClick={() => handleSelectAgent(agent.id)}
              >
                <div className="ai-dropdown-item-title">{agent.icon || '🤖'} {agent.name}</div>
                <div className="ai-dropdown-item-reason">{agent.aiReason}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
