import styles from './styles.module.css'
import Stack from '@mui/material/Stack'
import CalendarWeeklyWrapper from '@/components/CalendarWeeklyWrapper'
import WeeklyGoal from '@/components/WeeklyGoal';
import AddPracticeLog from '@/components/AddPracticeLog';
import { useState } from 'react';

const date = new Date().toLocaleDateString();

export default function Home() {
  const [selectedDate, setSelectedDate] = useState<string>(date)
  
  return (
    <Stack alignItems="flex-start">
      <CalendarWeeklyWrapper selectedDate={selectedDate} setSelectedDate={setSelectedDate}/>
      <WeeklyGoal/>
      <AddPracticeLog/>
    </Stack>
  )
}
