// hooks/usePracticeLogExists.ts
import { useState } from 'react'
import { API } from '@/constants/api'

export function usePracticeLogExists() {
  const [result, setResult] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(false)

  const checkLogsExist = async (dates: string[]) => {
    setLoading(true)
    try {
      const res = await fetch(`${API.PRACTICE_LOGS_EXIST}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ dates }),
      })

      if (!res.ok) throw new Error('기록 여부 조회 실패')

      const data: Record<string, boolean> = await res.json()
      setResult(data)
      return data
    } catch (err) {
      console.error(err)
      alert('기록 여부 조회 중 에러가 발생했어요')
      return null
    } finally {
      setLoading(false)
    }
  }

  return { result, checkLogsExist, loading }
}
