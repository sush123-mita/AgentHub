import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Rocket } from 'lucide-react';
import { createAgent } from '../api';

const CATEGORIES = ['Coding', 'Writing', 'Productivity', 'Study', 'Career'];
const ICONS = ['🤖', '💻', '✍️', '📄', '📚', '📧', '🎯', '🐍', '🚀', '📋', '📱', '🧠', '⚡'];

export default function AddAgent() {
  const navigate = useNavigate();
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'Coding',
    tags: '',
    icon: '🤖',
    color: '#6366f1',
    promptTemplate: '',
    inputFields: [{ label: '', name: '', type: 'text', placeholder: '' }]
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const updateField = (key, val) => setForm({ ...form, [key]: val });

  const updateInputField = (index, key, val) => {
    const fields = [...form.inputFields];
    fields[index] = { ...fields[index], [key]: val };
    setForm({ ...form, inputFields: fields });
  };

  const addInputField = () => {
    setForm({ ...form, inputFields: [...form.inputFields, { label: '', name: '', type: 'text', placeholder: '' }] });
  };

  const removeInputField = (index) => {
    const fields = form.inputFields.filter((_, i) => i !== index);
    setForm({ ...form, inputFields: fields });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.category) {
      return showToast('Please fill required fields');
    }

    const data = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      inputFields: form.inputFields.filter(f => f.label && f.name)
    };

    try {
      const res = await createAgent(data);
      showToast('Agent published successfully! 🎉');
      setTimeout(() => navigate(`/agent/${res.data.id}`), 1500);
    } catch {
      showToast('Error publishing agent. Please try again.');
    }
  };

  return (
    <div className="form-page">
      <h1>🚀 Publish Your AI Agent</h1>
      <p className="subtitle">Share your agent with the community and let the world use it.</p>

      <form className="form-card" onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className="form-section">
          <h3>Basic Information</h3>
          <div className="form-row" style={{ marginBottom: '1rem' }}>
            <div className="input-group">
              <label>Agent Name *</label>
              <input
                type="text"
                placeholder="e.g., Resume Generator"
                value={form.name}
                onChange={e => updateField('name', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Category *</label>
              <select
                value={form.category}
                onChange={e => updateField('category', e.target.value)}
                style={{
                  width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)',
                  borderRadius: 10, fontSize: '0.95rem', fontFamily: 'inherit', background: 'var(--bg)', outline: 'none'
                }}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="input-group" style={{ marginBottom: '1rem' }}>
            <label>Description *</label>
            <textarea
              placeholder="Describe what your agent does..."
              value={form.description}
              onChange={e => updateField('description', e.target.value)}
              style={{ minHeight: 80 }}
            />
          </div>
          <div className="form-row">
            <div className="input-group">
              <label>Tags (comma-separated)</label>
              <input
                type="text"
                placeholder="e.g., resume, career, AI"
                value={form.tags}
                onChange={e => updateField('tags', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Accent Color</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <input
                  type="color"
                  value={form.color}
                  onChange={e => updateField('color', e.target.value)}
                  style={{ width: 42, height: 42, border: 'none', borderRadius: 8, cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{form.color}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Icon */}
        <div className="form-section">
          <h3>Choose an Icon</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {ICONS.map(icon => (
              <button
                key={icon}
                type="button"
                onClick={() => updateField('icon', icon)}
                style={{
                  fontSize: '1.5rem',
                  width: 48, height: 48,
                  border: form.icon === icon ? '2px solid var(--primary)' : '2px solid var(--border)',
                  borderRadius: 10,
                  background: form.icon === icon ? 'rgba(99,102,241,0.08)' : 'var(--bg)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Template */}
        <div className="form-section">
          <h3>Prompt Template</h3>
          <div className="input-group">
            <label>Template (use {'{{fieldName}}'} for placeholders)</label>
            <textarea
              placeholder="e.g., Generate a resume for {{fullName}} with skills: {{skills}}"
              value={form.promptTemplate}
              onChange={e => updateField('promptTemplate', e.target.value)}
            />
          </div>
        </div>

        {/* Input Fields */}
        <div className="form-section">
          <h3>User Input Fields</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Define the fields users will fill when using your agent.
          </p>
          {form.inputFields.map((field, i) => (
            <div className="input-field-builder" key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Field {i + 1}</span>
                {form.inputFields.length > 1 && (
                  <button type="button" className="btn-remove" onClick={() => removeInputField(i)}>
                    <X size={14} /> Remove
                  </button>
                )}
              </div>
              <div className="row">
                <div className="input-group">
                  <label>Label</label>
                  <input
                    type="text"
                    placeholder="e.g., Full Name"
                    value={field.label}
                    onChange={e => updateInputField(i, 'label', e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>Field Name</label>
                  <input
                    type="text"
                    placeholder="e.g., fullName"
                    value={field.name}
                    onChange={e => updateInputField(i, 'name', e.target.value)}
                  />
                </div>
              </div>
              <div className="row">
                <div className="input-group">
                  <label>Type</label>
                  <select
                    value={field.type}
                    onChange={e => updateInputField(i, 'type', e.target.value)}
                    style={{
                      width: '100%', padding: '12px 14px', border: '1.5px solid var(--border)',
                      borderRadius: 10, fontSize: '0.95rem', fontFamily: 'inherit', background: 'var(--bg)', outline: 'none'
                    }}
                  >
                    <option value="text">Text</option>
                    <option value="textarea">Textarea</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Placeholder</label>
                  <input
                    type="text"
                    placeholder="e.g., Enter your name..."
                    value={field.placeholder}
                    onChange={e => updateInputField(i, 'placeholder', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
          <button type="button" className="btn-outline" onClick={addInputField}>
            <Plus size={16} style={{ display: 'inline', verticalAlign: 'middle' }} /> Add Another Field
          </button>
        </div>

        <button type="submit" className="btn btn-primary-solid" style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
          <Rocket size={18} /> Publish Agent
        </button>
      </form>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
