import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'

export default function DropZone({ file, onFile }) {
  const onDrop = useCallback(
    (accepted) => {
      if (accepted.length > 0) onFile(accepted[0])
    },
    [onFile]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  })

  return (
    <div
      {...getRootProps()}
      className={`relative rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer
                  transition-all duration-300 group
                  ${isDragActive
                    ? 'border-accent bg-accent/10 scale-[1.02]'
                    : file
                    ? 'border-success/50 bg-success/5'
                    : 'border-white/10 bg-dark-800/50 hover:border-accent/40 hover:bg-dark-700/50'
                  }`}
    >
      <input {...getInputProps()} />

      <AnimatePresence mode="wait">
        {file ? (
          <motion.div
            key="file"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📄</span>
            </div>
            <p className="font-display font-semibold text-success">{file.name}</p>
            <p className="text-gray-500 text-sm">{(file.size / 1024).toFixed(0)} KB — click to change</p>
          </motion.div>
        ) : isDragActive ? (
          <motion.div
            key="drag"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="text-4xl animate-bounce">📥</div>
            <p className="font-display text-accent font-semibold">Drop it!</p>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="w-14 h-14 bg-dark-600 rounded-2xl flex items-center justify-center
                            group-hover:bg-accent/10 transition-colors duration-300 border border-white/5">
              <svg className="w-6 h-6 text-gray-400 group-hover:text-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="font-display font-semibold text-white">Drop your resume here</p>
              <p className="text-gray-500 text-sm mt-1">PDF only — drag & drop or click to browse</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
