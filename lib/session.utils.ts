import { v4 as uuidv4 } from 'uuid'

const SESSION_KEY = 'shopify-widget-session'

export const getSessionId = (): string => {
  if (typeof window === 'undefined') return uuidv4()

  let sessionId = localStorage.getItem(SESSION_KEY)
  if (!sessionId) {
    sessionId = uuidv4()
    localStorage.setItem(SESSION_KEY, sessionId)
  }
  return sessionId
}

export const clearSession = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY)
  }
}