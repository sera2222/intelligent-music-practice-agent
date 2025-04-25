// hooks/usePracticeLog.ts
import { useState } from 'react'
import { API } from '@/constants/api'
import { formatDate } from '@/constants/format'
import { TRecord, TRecordResponse } from './record'

export function usePracticeLog() {
  const [loading, setLoading] = useState(false)

  const createPracticeLog = async (log: TRecord) => {
    setLoading(true)
    //console.log('log', log)
    try {
      const res = await fetch(API.CREATE_PRACTICE_LOG, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(log),
      })

      if (!res.ok) throw new Error('연습 기록 생성 실패')

      const data = await res.json()
      return data
    } catch (err) {
      console.error(err)
      alert('에러가 발생했어요')
    } finally {
      setLoading(false)
    }
  }

  const fetchLogByDate = async (date: string) => {
    setLoading(true)
    
    try {
      const formattedDate = formatDate(date) // "YYYY-MM-DD" 형식으로 변환
      const res = await fetch(`${API.PRACTICE_LOG_BY_DATE}/${formattedDate}`, {
        method: 'GET',
        credentials: 'include',
      })

      if (!res.ok) throw new Error('데이터 조회 실패')

      const data: TRecord[] = await res.json()
      return data
    } catch (err) {
      console.error(err)
      alert('연습 기록을 불러오는 데 실패했어요')
    } finally {
      setLoading(false)
    }
  }

  return { createPracticeLog, fetchLogByDate, loading }
}
