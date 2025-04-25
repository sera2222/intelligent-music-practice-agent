// hooks/usePracticeChat.ts
import { API } from '@/constants/api'
import { useState } from 'react'

export interface ChatMessage {
  sender: string
  message: string
  timestamp: string // ISO 형식
}

export function usePracticeChat(practiceLogId: number) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)

  const fetchChatThread = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API.CHAT_TREAD}/${practiceLogId}`, {
        method: 'GET',
        credentials: 'include',
      })
      if (!res.ok) throw new Error('스레드 조회 실패')
      const data = await res.json()
      setMessages(data.messages)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const saveChatThread = async (msgs: ChatMessage[]) => {
    try {
      const res = await fetch(`http://localhost:8000/chat-thread`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          practice_log_id: practiceLogId,
          messages: msgs,
        }),
      })
      if (!res.ok) throw new Error('채팅 저장 실패')
    } catch (err) {
      console.error(err)
    }
  }

  return { messages, setMessages, fetchChatThread, saveChatThread, loading }
}
