// components/TodayBadge.tsx
import { Box, Typography } from '@mui/material'

export default function TodayBadge() {
  return (
    <Box
      sx={{
        width: 50,
        height: 28,
        bgcolor: 'primary.main',
        color: 'white',
        borderRadius: '10px', // height의 절반 → pill shape
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="caption" fontWeight="bold">
        Today
      </Typography>
    </Box>
  )
}
