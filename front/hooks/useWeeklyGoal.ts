import { useState } from 'react'
import { API } from '@/constants/api'

export interface TSongGoal {
    song_name: string,
    target_tempo?: number,
    focus_skills?: string[]
    additional_notes?: string
}

export interface WeeklyGoal {
  week_start: string // ISO format ("2025-04-21")
  songs_to_practice: TSongGoal[]
  summary: string
  full: string
  total_practice_time: number
}

export function useWeeklyGoal() {
    const [goal, setGoal] = useState<WeeklyGoal | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
  
    const fetchWeeklyGoal = async (weekStart: string) => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(API.WEEKLY_GOAL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ week_start: weekStart }),
        })
  
        if (!res.ok) {
          if (res.status === 404) {
            setGoal(null)
            return null
          }
          throw new Error('주간 목표 조회 실패')
        }
  
        const data: WeeklyGoal = await res.json()
        setGoal(data)
        return data
      } catch (err) {
        console.error(err)
        setError('오류가 발생했어요')
        return null
      } finally {
        setLoading(false)
      }
    }
  
    return { goal, fetchWeeklyGoal, loading, error }
  }
