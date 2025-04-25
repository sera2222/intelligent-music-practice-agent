// hooks/useAuth.ts
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { API } from '@/constants/api'

interface User {
  id: number
  email: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchMe = async () => {
    try {
      const res = await fetch(API.ME, {
        method: 'GET',
        credentials: 'include', // ✅ 쿠키 인증 필수
      })
      if (!res.ok) return null
      const data = await res.json()
      return data as User
    } catch {
      return null
    }
  }

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const res = await fetch(API.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })
      if (!res.ok) throw new Error('로그인 실패')

      const me = await fetchMe()
      setUser(me)
      router.push('/')
    } catch (e) {
      alert(e instanceof Error ? e.message : '알 수 없는 에러 발생')
    } finally {
      setLoading(false)
    }
  }

  const checkLogin = async () => {
    const me = await fetchMe()
    if (me) {
      setUser(me)
      return true
    } else {
      setUser(null)
      return false
    }
  }

  // 초기 로그인 체크 (원할 경우 _app.tsx에서 호출)
  useEffect(() => {
    checkLogin().finally(() => setLoading(false))
  }, [])

  return { user, login, checkLogin, loading }
}
