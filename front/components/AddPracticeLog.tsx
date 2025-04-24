import { Box, Typography, Stack, Button, IconButton } from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import PracticeInputModal from './AddPracticeModal'
import { useState } from 'react'
import { TRecord } from '@/hooks/usePracticeRecord'
import PracticeChat from './Chat/PracticeChat'
import EditNoteIcon from '@mui/icons-material/EditNote';

export default function AddPracticeLog() {
    const [modalOpen, setModalOpen] = useState(false)

    const [practiceRecord, setPracticeRecord] = useState<TRecord | null>(null)
    
    return (
        <Box sx={{ mt: 2, width: '100%', marginTop: 3 }}>
            <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', gap: 1, width: '100%' }}>
                    <Typography variant="h6" fontWeight="medium" sx={{ fontSize: '18px',  }}>
                        오늘의 연습 {!practiceRecord ? '총평' : '기록'}
                    </Typography>
                    {!practiceRecord && 
                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
                            <Typography sx={{fontSize: '12px', display: 'flex', alignItems: 'center'}}>연습 기록 수정하기</Typography>
                            <IconButton size="small"><EditNoteIcon fontSize="small" /></IconButton>
                        </Box>
                    }
                </Box>
                {!practiceRecord ? (<PracticeChat />): (
                    <Button
                        variant="text"
                        startIcon={<AddCircleIcon sx={{ fontSize: 28 }} />}
                        sx={{
                        color: 'text.secondary',
                        fontSize: '18px',
                        textTransform: 'none',
                        }}
                        onClick={() => setModalOpen(true)}
                    >
                        기록추가하기
                    </Button>
                )}
            </Box>
            <PracticeInputModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
            />
        </Box>
    )
  }