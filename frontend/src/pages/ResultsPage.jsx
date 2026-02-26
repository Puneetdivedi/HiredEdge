import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts'
import ScoreRing from '../components/ScoreRing'
import toast from 'react-hot-toast'
import { saveAnalysis, generateResume } from '../utils/api'

function ImportanceBadge({ level }) {
  const map = {
    critical: 'tag-missing-critical',
    important: 'tag-missing-important',
    'nice-to-have': 'tag-missing-nice',
  }
  return <span className={map[level] || 'tag-missing-nice'}>{level}</span>
}

function SectionHeader({ icon, title, count }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="text-xl">{icon}</span>
      <h2 className="font-display font-semibold text-lg">{title}</h2>
      {count !== undefined && (
        <span className="ml-auto font-mono text-xs bg-dark-600 px-2 py-1 rounded-md text-gray-400">
          {count}
        </span>
      )}
    </div>
  )
}

export default function ResultsPage() {
  const [result, setResult] = useState(null)
  const [saved, setSaved] = useState(false)
  const [generatingResume, setGeneratingResume] = useState(false)
  const [generatedResume, setGeneratedResume] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const raw = sessionStorage.getItem('hiredge_result')
    if (!raw) {
      navigate('/analyze')
      return
    }
    setResult(JSON.parse(raw))
  }, [navigate])

  if (!result) return null

  const radarData = result.score_breakdown
    ? Object.entries(result.score_breakdown).map(([key, val]) => ({
      subject: key.charAt(0).toUpperCase() + key.slice(1),
      score: val,
    }))
    : []

  const handleSave = async () => {
    try {
      await saveAnalysis({
        job_title: result.jobTitle || 'Unknown Role',
        company: result.company || 'Unknown Company',
        match_score: result.match_score,
        analysis_data: result,
      })
      setSaved(true)
      toast.success('Analysis saved to history!')
    } catch {
      toast.error('Failed to save. Is Supabase configured?')
    }
  }

  const handleGenerateResume = async () => {
    try {
      setGeneratingResume(true)
      const toastId = toast.loading('Generating ATS-friendly resume...')
      const response = await generateResume(result.resume_text, result.jdText)
      setGeneratedResume(response.generated_resume)
      toast.dismiss(toastId)
      toast.success('Resume generated!')
    } catch (err) {
      toast.error('Failed to generate resume.')
      console.error(err)
    } finally {
      setGeneratingResume(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <motion.div
        className="flex items-start justify-between mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="font-display font-bold text-4xl mb-1">
            {result.jobTitle || 'Your Analysis'}
          </h1>
          {result.company && (
            <p className="text-gray-400">{result.company}</p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSave}
            disabled={saved}
            className="btn-secondary py-2 text-sm"
          >
            {saved ? '✓ Saved' : '💾 Save'}
          </button>
          <Link to="/analyze" className="btn-primary py-2 text-sm">
            New Analysis
          </Link>
        </div>
      </motion.div>

      {/* Summary banner */}
      <motion.div
        className="glass-bright rounded-2xl p-5 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-gray-300 leading-relaxed">{result.summary}</p>
      </motion.div>

      {/* Top row: Score + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Score ring */}
        <motion.div
          className="section-card flex flex-col items-center justify-center py-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <ScoreRing score={result.match_score} />
          <div className="mt-6 w-full space-y-2">
            {result.score_breakdown && Object.entries(result.score_breakdown).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between text-xs">
                <span className="text-gray-400 capitalize">{k}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-1.5 bg-dark-600 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${v}%`,
                        background: v >= 70 ? '#10b981' : v >= 50 ? '#f59e0b' : '#ef4444',
                      }}
                    />
                  </div>
                  <span className="text-gray-400 w-8 text-right">{v}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Radar chart */}
        <motion.div
          className="section-card col-span-1 lg:col-span-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <SectionHeader icon="📡" title="Score Breakdown" />
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fill: '#6b7280', fontSize: 12, fontFamily: 'DM Sans' }}
              />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#00d4ff"
                fill="#00d4ff"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Matched skills */}
      {result.matched_skills?.length > 0 && (
        <motion.div
          className="section-card mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <SectionHeader icon="✅" title="Matched Skills" count={result.matched_skills.length} />
          <div className="flex flex-wrap gap-2">
            {result.matched_skills.map((skill) => (
              <span key={skill} className="tag-matched">{skill}</span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Missing skills */}
      {result.missing_skills?.length > 0 && (
        <motion.div
          className="section-card mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <SectionHeader icon="❌" title="Missing Skills" count={result.missing_skills.length} />
          <div className="space-y-3">
            {result.missing_skills.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-3 bg-dark-700/60 rounded-xl">
                <ImportanceBadge level={item.importance} />
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm font-medium text-white">{item.skill}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{item.context}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ATS Keywords */}
      {result.ats_keywords_missing?.length > 0 && (
        <motion.div
          className="section-card mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
        >
          <SectionHeader icon="🤖" title="Missing ATS Keywords" count={result.ats_keywords_missing.length} />
          <p className="text-gray-400 text-sm mb-4">Add these exact terms to your resume to pass automated screening.</p>
          <div className="flex flex-wrap gap-2">
            {result.ats_keywords_missing.map((kw) => (
              <span key={kw} className="font-mono text-xs bg-dark-600 border border-white/10 px-2 py-1 rounded-md text-gray-300">
                {kw}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Rewritten bullets */}
      {result.rewritten_bullets?.length > 0 && (
        <motion.div
          className="section-card mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <SectionHeader icon="✍️" title="Rewritten Resume Bullets" count={result.rewritten_bullets.length} />
          <p className="text-gray-400 text-sm mb-4">AI-improved versions that better match this job description.</p>
          <div className="space-y-4">
            {result.rewritten_bullets.map((item, i) => (
              <div key={i} className="rounded-xl overflow-hidden border border-white/5">
                <div className="bg-danger/5 border-b border-white/5 p-3">
                  <div className="flex items-start gap-2">
                    <span className="text-danger text-xs font-mono mt-0.5 flex-shrink-0">BEFORE</span>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.original}</p>
                  </div>
                </div>
                <div className="bg-success/5 p-3">
                  <div className="flex items-start gap-2">
                    <span className="text-success text-xs font-mono mt-0.5 flex-shrink-0">AFTER</span>
                    <div className="flex-1">
                      <p className="text-white text-sm leading-relaxed">{item.rewritten}</p>
                      <p className="text-success/60 text-xs mt-1">{item.improvement}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(item.rewritten)
                        toast.success('Copied!')
                      }}
                      className="text-gray-500 hover:text-accent transition-colors text-xs ml-2 flex-shrink-0"
                    >
                      copy
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Resume Generator */}
      <motion.div
        className="section-card mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38 }}
      >
        <SectionHeader icon="📄" title="ATS-Friendly Resume Generator" />
        <p className="text-gray-400 text-sm mb-4">
          Generate a 1-page ATS-optimized resume tailored to this exact job description, using your actual experience.
        </p>

        {!generatedResume ? (
          <button
            onClick={handleGenerateResume}
            disabled={generatingResume}
            className="btn-primary py-3 px-6 text-sm flex items-center gap-2"
          >
            {generatingResume ? 'Generating...' : '✨ Generate Resume'}
          </button>
        ) : (
          <div className="space-y-4">
            <div className="bg-dark-700/60 border border-white/10 rounded-xl p-6 font-mono text-sm text-gray-300 whitespace-pre-wrap leading-relaxed h-96 overflow-y-auto w-full max-w-full break-normal overflow-x-auto">
              {generatedResume}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedResume)
                toast.success('Resume copied to clipboard!')
              }}
              className="btn-secondary py-2 px-4 text-sm"
            >
              📋 Copy Markdown
            </button>
          </div>
        )}
      </motion.div>

      {/* Learning roadmap */}
      {result.learning_roadmap?.length > 0 && (
        <motion.div
          className="section-card mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SectionHeader icon="🗺️" title="Your Learning Roadmap" />
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-accent/20" />
            <div className="space-y-4 ml-8">
              {result.learning_roadmap.map((item, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-10 w-6 h-6 rounded-full bg-dark-800 border-2 border-accent
                                  flex items-center justify-center text-accent text-xs font-mono font-bold">
                    {item.step}
                  </div>
                  <div className="p-4 bg-dark-700/60 rounded-xl">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <p className="text-white text-sm font-medium">{item.action}</p>
                      <span className="text-accent text-xs font-mono bg-accent/10 px-2 py-0.5 rounded flex-shrink-0">
                        {item.timeframe}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs">{item.resource}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Experience gaps */}
      {result.experience_gaps?.length > 0 && (
        <motion.div
          className="section-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42 }}
        >
          <SectionHeader icon="📋" title="Experience Gaps" count={result.experience_gaps.length} />
          <div className="space-y-3">
            {result.experience_gaps.map((gap, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-dark-700/60 rounded-xl">
                <span className={`text-xs font-mono px-2 py-0.5 rounded mt-0.5 flex-shrink-0
                  ${gap.severity === 'high' ? 'bg-danger/10 text-danger' :
                    gap.severity === 'medium' ? 'bg-warning/10 text-warning' :
                      'bg-brand-500/10 text-brand-400'}`}>
                  {gap.severity}
                </span>
                <p className="text-gray-300 text-sm">{gap.gap}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
