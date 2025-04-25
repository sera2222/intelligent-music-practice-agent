import { useState } from 'react'
import { API } from '@/constants/api'

export function useRecentTitles() {
  const [titles, setTitles] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const fetchRecentTitles = async () => {
    setLoading(true)
    try {
      const res = await fetch(API.RECENT_TITLES, {
        method: 'GET',
        credentials: 'include',
      })

      if (!res.ok) throw new Error('제목 목록 불러오기 실패')

      const data: string[] = await res.json()
      setTitles(data)
      return data
    } catch (err) {
      console.error(err)
      alert('최근 제목을 불러오는 데 실패했어요')
      return []
    } finally {
      setLoading(false)
    }
  }

  return { titles, fetchRecentTitles, loading }
}
