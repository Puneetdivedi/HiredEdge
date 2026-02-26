import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const features = [
  {
    icon: '🎯',
    title: 'Match Score',
    desc: 'See exactly how well your resume matches the job description with a detailed breakdown.',
  },
  {
    icon: '🔍',
    title: 'Gap Analysis',
    desc: 'Find every missing skill, keyword, and experience the recruiter is looking for.',
  },
  {
    icon: '✍️',
    title: 'Bullet Rewriter',
    desc: 'AI rewrites your resume bullets to match the job description language and ATS keywords.',
  },
  {
    icon: '🗺️',
    title: 'Learning Roadmap',
    desc: 'Get a personalized step-by-step plan to close your skill gaps before applying.',
  },
]

const stats = [
  { value: '2x', label: 'More interview callbacks' },
  { value: '< 30s', label: 'Analysis time' },
  { value: '94%', label: 'ATS keyword accuracy' },
]

export default function LandingPage() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      {/* Hero */}
      <section className="pt-24 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-accent mb-8 border border-accent/20">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse-slow" />
            AI-Powered Career Intelligence
          </div>

          <h1 className="font-display font-bold text-6xl md:text-7xl tracking-tight mb-6 leading-none">
            Know your edge
            <br />
            <span className="text-accent">before you apply.</span>
          </h1>

          <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload your resume and paste any job description.
            HiredEdge tells you <strong className="text-white">exactly what's missing</strong>,
            rewrites your bullets, and builds your roadmap to getting hired.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link to="/analyze" className="btn-primary text-base px-8 py-4">
              Analyze My Resume →
            </Link>
            <a href="#how-it-works" className="btn-secondary text-base">
              See How It Works
            </a>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex items-center justify-center gap-12 mt-16 pt-12 border-t border-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display font-bold text-3xl text-accent">{s.value}</div>
              <div className="text-gray-500 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="text-center mb-14">
          <h2 className="font-display font-bold text-4xl mb-3">How HiredEdge works</h2>
          <p className="text-gray-400">Three steps. Thirty seconds. Real results.</p>
        </div>

        <div className="grid grid-cols-3 gap-6 relative">
          {/* Connector line */}
          <div className="absolute top-8 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

          {[
            { step: '01', title: 'Upload Resume', desc: 'Drop your PDF resume. We extract and parse it instantly.' },
            { step: '02', title: 'Paste Job Description', desc: 'Copy the full JD from LinkedIn, Indeed, or any job board.' },
            { step: '03', title: 'Get Your Analysis', desc: 'AI analyzes the gap and gives you a full action plan in seconds.' },
          ].map((item, i) => (
            <motion.div
              key={item.step}
              className="section-card text-center relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              <div className="font-mono text-accent/50 text-xs mb-3">{item.step}</div>
              <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="text-center mb-14">
          <h2 className="font-display font-bold text-4xl mb-3">Everything you need to get shortlisted</h2>
          <p className="text-gray-400">Not just keywords — real, actionable intelligence.</p>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="section-card flex gap-5 hover:border-accent/20 transition-all duration-300 group"
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 rounded-xl bg-dark-600 flex items-center justify-center flex-shrink-0
                              group-hover:bg-accent/10 transition-colors duration-300 text-2xl">
                {f.icon}
              </div>
              <div>
                <h3 className="font-display font-semibold text-lg mb-1">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <motion.div
          className="gradient-border rounded-3xl p-12 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display font-bold text-4xl mb-4">
            Ready to get your edge?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Stop guessing. Start knowing exactly where you stand.
          </p>
          <Link to="/analyze" className="btn-primary text-lg px-10 py-4">
            Analyze My Resume — It's Free →
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
