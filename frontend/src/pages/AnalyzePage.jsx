import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import DropZone from '../components/DropZone'
import { analyzeResume } from '../utils/api'

export default function AnalyzePage() {
  const [resumeFile, setResumeFile] = useState(null)
  const [jdText, setJdText] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleAnalyze = async () => {
    if (!resumeFile) {
      toast.error('Please upload your resume PDF.')
      return
    }
    if (jdText.trim().length < 100) {
      toast.error('Please paste the full job description (at least 100 characters).')
      return
    }

    setLoading(true)
    const toastId = toast.loading('Analyzing your resume… this takes ~20 seconds ⚡')

    try {
      const result = await analyzeResume(resumeFile, jdText)
      toast.dismiss(toastId)
      toast.success('Analysis complete!')

      // Store in sessionStorage and navigate to results
      sessionStorage.setItem(
        'hiredge_result',
        JSON.stringify({ ...result, jobTitle, company, jdText })
      )
      navigate('/results')
    } catch (err) {
      toast.dismiss(toastId)
      const msg = err?.response?.data?.detail || 'Analysis failed. Please try again.'
      toast.error(msg)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="font-display font-bold text-4xl mb-2">
          Analyze your resume
        </h1>
        <p className="text-gray-400">
          Upload your resume and paste the job description. We'll do the rest.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8">
        {/* Step 1: Job info */}
        <motion.div
          className="section-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="w-7 h-7 rounded-lg bg-accent/20 text-accent text-xs font-mono font-bold flex items-center justify-center">1</span>
            <h2 className="font-display font-semibold text-lg">Job Details <span className="text-gray-500 text-sm font-body font-normal">(optional)</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 font-medium mb-2 block">Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Software Engineer"
                className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-3 text-sm
                           focus:outline-none focus:border-accent/40 transition-colors placeholder-gray-600"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium mb-2 block">Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google"
                className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-3 text-sm
                           focus:outline-none focus:border-accent/40 transition-colors placeholder-gray-600"
              />
            </div>
          </div>
        </motion.div>

        {/* Step 2: Resume */}
        <motion.div
          className="section-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="w-7 h-7 rounded-lg bg-accent/20 text-accent text-xs font-mono font-bold flex items-center justify-center">2</span>
            <h2 className="font-display font-semibold text-lg">Upload Resume</h2>
          </div>

          <DropZone file={resumeFile} onFile={setResumeFile} />
        </motion.div>

        {/* Step 3: JD */}
        <motion.div
          className="section-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="w-7 h-7 rounded-lg bg-accent/20 text-accent text-xs font-mono font-bold flex items-center justify-center">3</span>
            <h2 className="font-display font-semibold text-lg">Paste Job Description</h2>
          </div>

          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the full job description here — the more complete, the better the analysis..."
            rows={10}
            className="w-full bg-dark-700 border border-white/10 rounded-xl px-4 py-3 text-sm
                       focus:outline-none focus:border-accent/40 transition-colors 
                       placeholder-gray-600 resize-none leading-relaxed"
          />
          <div className="flex justify-between mt-2">
            <p className="text-xs text-gray-600">Pro tip: Include the full JD including "nice to haves"</p>
            <p className={`text-xs ${jdText.length < 100 ? 'text-gray-600' : 'text-success'}`}>
              {jdText.length} chars
            </p>
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4"
        >
          <button
            onClick={handleAnalyze}
            disabled={loading || !resumeFile || jdText.length < 100}
            className="btn-primary w-full py-5 text-lg flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-[0_0_30px_rgba(0,212,255,0.2)]"
          >
            {loading ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing with AI...
              </>
            ) : (
              <>⚡ Get My Edge Analysis</>
            )}
          </button>
          <p className="text-center text-xs text-gray-500 mt-4 tracking-wide uppercase font-semibold">
            Takes ~20–30 seconds · Your data is never stored or shared
          </p>
        </motion.div>
      </div>
    </div>
  )
}
