import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, BarChart3, Play, Send, Copy, RefreshCw } from 'lucide-react';
import { marked } from 'marked';
import { getAgent, useAgent, addReview } from '../api';

export default function AgentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inputs, setInputs] = useState({});
  const [result, setResult] = useState('');
  const [running, setRunning] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewUser, setReviewUser] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    setLoading(true);
    getAgent(id)
      .then(r => {
        setAgent(r.data);
        const initial = {};
        r.data.inputFields?.forEach(f => { initial[f.name] = ''; });
        setInputs(initial);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleRun = async () => {
    setRunning(true);
    setResult('');
    try {
      const res = await useAgent(id, inputs);
      setResult(res.data.response || 'No response generated.');
      if (res.data.agent) setAgent(res.data.agent);
    } catch (err) {
      const msg = err.response?.status === 429 
        ? '**Gemini AI Quota Exceeded**. Please wait 1 minute before trying again.' 
        : '**Error running agent**. Please check your connection and try again.';
      setResult(msg);
    }
    setRunning(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    showToast('Copied to clipboard!');
  };

  const handleTryAnother = () => {
    setResult('');
    const emptyInputs = { ...inputs };
    Object.keys(emptyInputs).forEach(k => emptyInputs[k] = '');
    setInputs(emptyInputs);
  };

  const handleReview = async () => {
    if (reviewRating === 0) return showToast('Please select a rating');
    try {
      const res = await addReview(id, {
        user: reviewUser || 'Anonymous',
        rating: reviewRating,
        comment: reviewComment
      });
      setAgent(res.data);
      setReviewRating(0);
      setReviewComment('');
      setReviewUser('');
      showToast('Review submitted!');
    } catch {
      showToast('Failed to submit review');
    }
  };

  if (loading) return <div className="loading" style={{ marginTop: '4rem' }}><div className="spinner" /></div>;
  if (!agent) return <div className="empty-state" style={{ marginTop: '4rem' }}><h3>Agent not found</h3></div>;

  return (
    <div className="detail-page">
      <div className="detail-back" onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Back
      </div>

      {/* Hero */}
      <div className="detail-hero">
        <div className="detail-icon" style={{ background: `${agent.color}15`, color: agent.color }}>
          {agent.icon}
        </div>
        <div className="detail-meta">
          <span className="category-badge">{agent.category}</span>
          <h1>{agent.name}</h1>
          <p>{agent.description}</p>
          <div className="detail-stats">
            <div className="stat">
              <Star size={16} color="var(--accent)" fill="var(--accent)" />
              <strong>{agent.avgRating}</strong> ({agent.totalRatings} reviews)
            </div>
            <div className="stat">
              <BarChart3 size={16} />
              <strong>{agent.usageCount?.toLocaleString()}</strong> uses
            </div>
          </div>
          <div className="agent-card-tags" style={{ marginTop: '0.75rem' }}>
            {agent.tags?.map(tag => <span className="tag" key={tag}>{tag}</span>)}
          </div>
        </div>
      </div>

      {/* Playground */}
      <div className="playground">
        <h2><Play size={20} /> Try this Agent</h2>
        {result ? (
          <div className="playground-result-container" style={{ marginTop: '1.5rem' }}>
            <div 
              className="playground-result" 
              style={{ marginTop: 0 }}
              dangerouslySetInnerHTML={{ __html: marked(result) }} 
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
              <button className="btn" style={{ border: '1px solid var(--border)' }} onClick={handleCopy}>
                <Copy size={16} /> Copy Response
              </button>
              <button className="btn" style={{ border: '1px solid var(--border)' }} onClick={handleTryAnother}>
                <RefreshCw size={16} /> Try Another
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="playground-inputs">
              {agent.inputFields?.length > 0 ? agent.inputFields.map((field) => (
                <div className="input-group" key={field.name}>
                  <label>{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      placeholder={field.placeholder}
                      value={inputs[field.name] || ''}
                      onChange={e => setInputs({ ...inputs, [field.name]: e.target.value })}
                    />
                  ) : (
                    <input
                      type={field.type || 'text'}
                      placeholder={field.placeholder}
                      value={inputs[field.name] || ''}
                      onChange={e => setInputs({ ...inputs, [field.name]: e.target.value })}
                    />
                  )}
                </div>
              )) : (
                <div className="input-group">
                  <label>Your Input</label>
                  <textarea
                    placeholder={agent.inputLabel || "Enter your instructions here..."}
                    value={inputs['default'] || ''}
                    onChange={e => setInputs({ ...inputs, 'default': e.target.value })}
                  />
                </div>
              )}
            </div>
            
            <button className="btn btn-primary-solid" onClick={handleRun} disabled={running}>
              {running ? (
                <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> AI is thinking...</>
              ) : (
                <><Send size={16} /> Run Agent</>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Reviews */}
      <div className="reviews-section">
        <h2>💬 Reviews ({agent.reviews?.length || 0})</h2>
        {agent.reviews?.map((review, i) => (
          <div className="review-card" key={i}>
            <div className="review-card-header">
              <span className="user">{review.user}</span>
              <span className="stars">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
            </div>
            <p>{review.comment}</p>
          </div>
        ))}

        {/* Add review form */}
        <div className="review-form" style={{ marginTop: '1rem' }}>
          <h3>Leave a Review</h3>
          <div className="input-group">
            <label>Your Name (optional)</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={reviewUser}
              onChange={e => setReviewUser(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>Rating</label>
            <div className="star-input">
              {[1,2,3,4,5].map(n => (
                <button
                  key={n}
                  className={n <= reviewRating ? 'active' : ''}
                  onClick={() => setReviewRating(n)}
                >★</button>
              ))}
            </div>
          </div>
          <div className="input-group">
            <label>Comment</label>
            <textarea
              placeholder="Write your review..."
              value={reviewComment}
              onChange={e => setReviewComment(e.target.value)}
            />
          </div>
          <button className="btn btn-primary-solid" onClick={handleReview} style={{ alignSelf: 'flex-start' }}>
            Submit Review
          </button>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
