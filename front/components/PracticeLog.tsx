import { Box, Typography, Stack, Button, IconButton } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import PracticeInputModal from './AddPracticeModal'
import { useEffect, useState } from 'react'
import { TRecord } from '@/hooks/record'
import PracticeChat from './Chat/PracticeChat'
import EditNoteIcon from '@mui/icons-material/EditNote';
import { usePracticeLog } from '@/hooks/usePracticeLog'

interface Props {
    selectedDate: string
    handleOnSave: () => void
}

export default function PracticeLog({selectedDate, handleOnSave}: Props) {
    const [modalOpen, setModalOpen] = useState(false)

    const [practiceRecord, setPracticeRecord] = useState<TRecord | null>(null)
    const { fetchLogByDate } = usePracticeLog()

    const [saveTrigger, setSaveTrigger] = useState(0)

    const handleOnSave2 = () => {
        setSaveTrigger(prev => prev + 1) // 상태가 바뀌도록
    }

    useEffect(() => {
        console.log("selectedDate", selectedDate)
        fetchLogByDate(selectedDate)
            .then((data) => {
                console.log('data', data)
                if (data && data.length > 0) {
                    setPracticeRecord(data[0])
                } else {
                    setPracticeRecord(null)
                }
            })
    }, [selectedDate])
    
    return (
        <Box sx={{ mt: 2, width: '100%', marginTop: 3 }}>
            <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 1, width: '100%' }}>
                    <Typography variant="h6" fontWeight="medium" sx={{ fontSize: '18px',  }}>
                        오늘의 연습 {practiceRecord ? '총평' : '기록'}
                    </Typography>
                    {practiceRecord && 
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <Typography sx={{fontSize: '12px', display: 'flex', alignItems: 'center'}}>연습 기록 수정하기</Typography>
                            <IconButton size="small"><EditNoteIcon fontSize="small" /></IconButton>
                        </Box>
                    }
                </Box>
                {practiceRecord && practiceRecord.id ? (<PracticeChat practiceLogId={practiceRecord.id} refreshTrigger={saveTrigger}/>): (
                    <Button
                        variant="text"
                        startIcon={<AddCircleIcon sx={{ fontSize: 30 }} />}
                        sx={{
                            color: 'text.secondary',
                            fontSize: '18px',
                            textTransform: 'none',
                            marginTop: 2,
                        }}
                        onClick={() => setModalOpen(true)}
                    >
                        기록 추가하기
                    </Button>
                )}
            </Box>
            <PracticeInputModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                practiceDate={selectedDate}
                onSave={handleOnSave}
                onSave2={handleOnSave2}
            />
        </Box>
    )
  }