import { Link } from 'react-router-dom';
import { Cpu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <Cpu size={24} />
        <span>AgentHub</span>
      </Link>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/marketplace">Marketplace</Link>
        <Link to="/add-agent" className="btn-primary">+ Publish Agent</Link>
      </div>
    </nav>
  );
}
