import { Box, Typography, Stack, Button } from '@mui/material'
import TrackChangesIcon from '@mui/icons-material/TrackChanges'
import { useEffect } from 'react'
import { useWeeklyGoal } from '@/hooks/useWeeklyGoal'
import { formatDate } from '@/constants/format'
import { getWeekDates } from '@/utils/getDates'

interface Props {
  selectedDate: string
}

export default function WeeklyGoal({  selectedDate }: Props) {
  const { goal, fetchWeeklyGoal, loading } = useWeeklyGoal()
  const weekDates = getWeekDates(new Date(selectedDate))

  useEffect(() => {
    console.log('first date', weekDates[0].date)
    const startOfWeek = formatDate(weekDates[0].date)
    fetchWeeklyGoal(startOfWeek)
  }, [])
  
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
          {goal ? goal.summary : '주간 목표가 아직 설정되지 않았어요.'}
        </Typography>
      </Box>
    </Box>
  )
}
