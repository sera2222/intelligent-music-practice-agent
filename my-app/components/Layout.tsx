// components/Layout.tsx
import { Box } from '@mui/material'
import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden', // 가로/세로 스크롤 제거
        m: 0,
        p: 3, // 공통 padding
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children}
    </Box>
  )
}
