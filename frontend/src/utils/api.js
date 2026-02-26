import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  timeout: 60000, // 60s for AI analysis
})

/**
 * Upload resume PDF + job description text, get back full analysis
 */
export async function analyzeResume(resumeFile, jdText) {
  const formData = new FormData()
  formData.append('resume', resumeFile)
  formData.append('jd_text', jdText)

  const { data } = await api.post('/analyze/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return data
}

/**
 * Rewrite specific bullets against a JD
 */
export async function rewriteBullets(bullets, jdText) {
  const { data } = await api.post('/analyze/rewrite-bullets', {
    bullets,
    jd_text: jdText,
  })
  return data
}

/**
 * History CRUD
 */
export async function getHistory(userId = null) {
  const params = userId ? { user_id: userId } : {}
  const { data } = await api.get('/history/', { params })
  return data.analyses
}

export async function saveAnalysis(payload) {
  const { data } = await api.post('/history/', payload)
  return data
}

export async function deleteAnalysis(id) {
  const { data } = await api.delete(`/history/${id}`)
  return data
}
