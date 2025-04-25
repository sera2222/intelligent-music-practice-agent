import { Box, IconButton, Typography } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { usePracticeLogExists } from '@/hooks/usePracticeLogsExists';
import { useEffect, useState } from 'react';

interface Props {
    dates: { date: string; day: string; dayNumber: number }[]
    selectedDate: string
    onDateClick: (date: string) => void
    onPrevClick: () => void
    onNextClick: () => void
    saveTrigger: number
}

export default function CalendarWeeklyView({ dates, selectedDate, onDateClick, onPrevClick, onNextClick, saveTrigger }: Props) {
  const { result, checkLogsExist, loading } = usePracticeLogExists()
  const [logsExist, setLogsExist] = useState<any>({})

  useEffect(() => {
    const formattedDates = dates.map((d) => d.date)
    //console.log('formattedDates', formattedDates)
    if (dates.length > 0) {
      checkLogsExist(formattedDates)
        .then((data) => {
          //console.log('data', data)
          setLogsExist(data)
        })
        .catch((error) => {
          console.error('Error checking logs existence:', error)
        })
    }
  }, [dates, saveTrigger])
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 1 }}>
      <IconButton onClick={onPrevClick}><ArrowBackIosNewIcon fontSize="small" /></IconButton>
      
      <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
        {dates.map((d) => {
          const isSelected = new Date(d.date).toLocaleDateString() === new Date(selectedDate).toLocaleDateString()
          return (
            <Box
              key={d.date}
              sx={{
                textAlign: 'center',
                p: 1,
                borderRadius: 2,
                backgroundColor: isSelected ? '#eee' : 'transparent',
                cursor: 'pointer',
              }}
              onClick={() => onDateClick(d.date)}
            >
              <Typography variant="body2">{d.day}</Typography>
              <Typography variant="body1" fontWeight="bold">{d.dayNumber}</Typography>
              {
                logsExist && logsExist[d.date] ? (
                    <Box sx={{
                    border: '2px solid',
                    borderColor: 'primary.main',
                    backgroundColor: 'primary.main',
                    borderRadius: '50%',
                    width: 24, height: 24,
                    mx: 'auto',
                    mt: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '20px',
                    }}>
                    ✓
                    </Box>
                  ) : (
                    <Box sx={{
                      border: '2px solid #B8B8B8',
                      borderRadius: '50%',
                      width: 24, height: 24,
                      mx: 'auto',
                      mt: 0.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#B8B8B8',
                      fontSize: '20px',
                    }}>
                      ✓
                  </Box>
                  )
              }
              
            </Box>
          )
        })}
      </Box>

      <IconButton onClick={onNextClick}><ArrowForwardIosIcon fontSize="small" /></IconButton>
    </Box>
  )
}
