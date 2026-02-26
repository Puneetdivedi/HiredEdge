import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { getHistory, deleteAnalysis } from '../utils/api'
import toast from 'react-hot-toast'

function ScoreBadge({ score }) {
  const color = score >= 80 ? 'text-success bg-success/10 border-success/20'
    : score >= 60 ? 'text-warning bg-warning/10 border-warning/20'
    : 'text-danger bg-danger/10 border-danger/20'
  return (
    <span className={`font-mono font-bold text-sm px-3 py-1 rounded-lg border ${color}`}>
      {score}%
    </span>
  )
}

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getHistory()
      .then(setAnalyses)
      .catch(() => toast.error('Could not load history. Is Supabase configured?'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    try {
      await deleteAnalysis(id)
      setAnalyses((prev) => prev.filter((a) => a.id !== id))
      toast.success('Deleted.')
    } catch {
      toast.error('Delete failed.')
    }
  }

  const handleView = (analysis) => {
    sessionStorage.setItem('hiredge_result', JSON.stringify({
      ...analysis.analysis_data,
      jobTitle: analysis.job_title,
      company: analysis.company,
    }))
    navigate('/results')
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-4xl mb-2">Analysis History</h1>
        <p className="text-gray-400 mb-10">Your saved resume analyses.</p>
      </motion.div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading history…</p>
        </div>
      ) : analyses.length === 0 ? (
        <div className="section-card text-center py-16">
          <div className="text-4xl mb-4">📭</div>
          <h2 className="font-display font-semibold text-xl mb-2">No saved analyses yet</h2>
          <p className="text-gray-400 mb-6">Run an analysis and hit Save to see it here.</p>
          <button onClick={() => navigate('/analyze')} className="btn-primary">
            Analyze a Resume →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {analyses.map((a, i) => (
            <motion.div
              key={a.id}
              className="section-card flex items-center gap-5 hover:border-accent/20 transition-all"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ScoreBadge score={a.match_score} />

              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold">
                  {a.job_title || 'Unknown Role'}
                </p>
                <p className="text-gray-400 text-sm">{a.company || 'Unknown Company'}</p>
                <p className="text-gray-600 text-xs mt-1">
                  {new Date(a.created_at).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric'
                  })}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleView(a)}
                  className="btn-secondary py-2 text-sm"
                >
                  View
                </button>
                <button
                  onClick={() => handleDelete(a.id)}
                  className="text-gray-500 hover:text-danger text-xs transition-colors px-2"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
