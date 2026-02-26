import { motion } from 'framer-motion'

export default function ScoreRing({ score, size = 160, strokeWidth = 12 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  const getColor = (s) => {
    if (s >= 80) return '#10b981'
    if (s >= 60) return '#f59e0b'
    if (s >= 40) return '#00d4ff'
    return '#ef4444'
  }

  const color = getColor(score)

  const getLabel = (s) => {
    if (s >= 80) return 'Strong Match'
    if (s >= 60) return 'Good Fit'
    if (s >= 40) return 'Partial Match'
    return 'Needs Work'
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative score-ring" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Background ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
          />
          {/* Score ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="font-display font-bold"
            style={{ color, fontSize: size * 0.22 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            {score}%
          </motion.span>
          <span className="text-gray-400 text-xs">match</span>
        </div>
      </div>

      <motion.span
        className="font-display font-semibold text-sm"
        style={{ color }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {getLabel(score)}
      </motion.span>
    </div>
  )
}
