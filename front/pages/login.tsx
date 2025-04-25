import { useAuth } from '@/hooks/useAuth'
import { TextField, Button, Stack } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const { user, checkLogin, login, loading } = useAuth()
    const router = useRouter()
  
    useEffect(() => {
      const verify = async () => {
        const ok = await checkLogin()
        if (ok) router.replace('/')
      }
      verify()
    }, [])

  return (
    <Stack spacing={2} marginTop={40}>
      <TextField label="ID" onChange={(e) => setUsername(e.target.value)} />
      <TextField label="PW" type="password" onChange={(e) => setPassword(e.target.value)} />
      <Button onClick={() => login(username, password)} disabled={loading}>
        로그인
      </Button>
    </Stack>
  )
}
