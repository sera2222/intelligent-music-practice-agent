import styles from './styles.module.css'
import Stack from '@mui/material/Stack'
import CalendarWeeklyWrapper from '@/components/CalendarWeeklyWrapper'
import WeeklyGoal from '@/components/WeeklyGoal';
import PracticeLog from '@/components/PracticeLog';
import { useState } from 'react';

const date = new Date().toLocaleDateString();

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<string>(date)
  const [saveTrigger, setSaveTrigger] = useState(0)

  const handleOnSave = () => {
    setSaveTrigger(prev => prev + 1) // 상태가 바뀌도록
  }
  
  return (
    <Stack alignItems="flex-start">
      <CalendarWeeklyWrapper 
        selectedDate={selectedDate} setSelectedDate={setSelectedDate} saveTrigger={saveTrigger}
      />
      <WeeklyGoal selectedDate={selectedDate}/>
      <PracticeLog selectedDate={selectedDate} handleOnSave={handleOnSave}/>
    </Stack>
  )
}
