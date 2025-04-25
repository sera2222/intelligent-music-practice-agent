import '@/styles/globals.css'
import type { AppProps } from 'next/app'

import { CssBaseline, ThemeProvider } from '@mui/material'
import theme from '../theme'
import Layout from '@/components/Layout'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }: AppProps) {
  const { user, checkLogin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const verify = async () => {
      const ok = await checkLogin()
      if (!ok) {
        router.replace('/login')
      }
    }
    verify()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  )
}