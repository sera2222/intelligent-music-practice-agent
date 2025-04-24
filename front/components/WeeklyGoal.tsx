import { Box, Typography, Stack, Button } from '@mui/material'
import TrackChangesIcon from '@mui/icons-material/TrackChanges'

export default function WeeklyGoal() {
  return (
    <Box sx={{ mt: 4, width: '100%' }}>
      <Box
        sx={{
          bgcolor: '#f3f6d1',
          borderRadius: 2,
          p: 1.5,
          paddingTop: 2,
          paddingBottom: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          width: '100%'
        }}
      >
        <TrackChangesIcon sx={{ fontSize: 32 }} />
        <Typography sx={{ color: 'black', fontSize: '14px', fontWeight: 'medium' }}>
          이번 주는 <strong>‘멘델스존 바이올린 협주곡 제 1악장’</strong>의 음정을 안정시키는 데 집중해보아요.
        </Typography>
      </Box>
    </Box>
  )
}
