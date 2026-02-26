import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Navbar() {
  const location = useLocation()

  return (
    <nav className="glass border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center
                          group-hover:bg-accent/30 transition-all duration-200">
            <span className="text-accent font-mono font-bold text-sm">H</span>
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            Hired<span className="text-accent">Edge</span>
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-2">
          {[
            { href: '/analyze', label: 'Analyze' },
            { href: '/history', label: 'History' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              to={href}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${location.pathname === href
                  ? 'bg-accent/10 text-accent border border-accent/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              {label}
            </Link>
          ))}

          <Link to="/analyze" className="btn-primary ml-4 py-2 text-sm">
            Get Your Edge →
          </Link>
        </div>
      </div>
    </nav>
  )
}
