const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export const API = {
  LOGIN: `${BASE_URL}/login`,
  ME: `${BASE_URL}/me`,

  CREATE_PRACTICE_LOG: `${BASE_URL}/practice/logs`,
  PRACTICE_LOG_BY_DATE: `${BASE_URL}/practice/logs/date`, // GET /practice/logs
  PRACTICE_LOGS_EXIST: `${BASE_URL}/practice/logs/exists`, // GET /practice/logs/exists
  RECENT_TITLES: `${BASE_URL}/practice/logs/titles`, // GET /practice/logs/recent-titles

  CHAT_TREAD: `${BASE_URL}/chat-thread`, // GET /chat-thread/:practice_log_id

  WEEKLY_GOAL: `${BASE_URL}/practice/goals/week`,
}
