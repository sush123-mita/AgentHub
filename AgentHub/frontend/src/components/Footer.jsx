import { Cpu } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">⚡ AgentHub</div>
        <div className="footer-links">
          <a href="#">About</a>
          <a href="#">Docs</a>
          <a href="#">GitHub</a>
          <a href="#">Contact</a>
        </div>
        <div style={{ fontSize: '0.8rem' }}>© 2025 AgentHub. All rights reserved.</div>
      </div>
    </footer>
  );
}
