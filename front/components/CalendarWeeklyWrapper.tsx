import { useState } from 'react'
import { addDays, startOfWeek, format } from 'date-fns'
import { getWeekDates } from '@/utils/getDates'
import CalendarWeekView from '@/components/CalendarWeeklyView'
import { Stack, Box, Typography, IconButton } from '@mui/material';
import TodayBadge from './TodayBadge';
import SettingsIcon from '@mui/icons-material/Settings'

const date = new Date().toLocaleDateString();

interface Props {
  selectedDate: string
  setSelectedDate: (date: string) => void
}

export default function CalendarWrapper({selectedDate, setSelectedDate}: Props) {

  const handleDateClick = (date: string) => {
    setSelectedDate(date)
  }

  const handlePrevClick = () => {
    const prevWeekDate = addDays(new Date(selectedDate), -7)
    const monday = startOfWeek(prevWeekDate, { weekStartsOn: 1 }) // 월요일 기준
    setSelectedDate(monday.toLocaleDateString())
  }
  
  const handleNextClick = () => {
    const nextWeekDate = addDays(new Date(selectedDate), 7)
    const monday = startOfWeek(nextWeekDate, { weekStartsOn: 1 })
    setSelectedDate(monday.toLocaleDateString())
  }

  const weekDates = getWeekDates(new Date(selectedDate))

  return (
    <Stack alignItems="flex-start" sx={{width: '100%'}}>
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 1, width: '100%' }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center', marginBottom: 2, height: '100%' }}>
            <Typography sx={{ color: 'black', fontSize: '20px', fontWeight: 'bold' }}>{new Date(selectedDate).toLocaleDateString()}</Typography>
            {new Date(date).toLocaleDateString() == new Date(selectedDate).toLocaleDateString() && <TodayBadge />}
          </Box>
          <IconButton>
            <SettingsIcon fontSize="medium"/>
          </IconButton>
        </Box>
        <CalendarWeekView
            dates={weekDates}
            selectedDate={selectedDate}
            onDateClick={handleDateClick}
            onPrevClick={handlePrevClick}
            onNextClick={handleNextClick}
        />
    </Stack>
  )
}
