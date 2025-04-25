import { formatDate } from '@/constants/format'
import { usePracticeLog } from '@/hooks/usePracticeLog'
import { useRecentTitles } from '@/hooks/useRecentTitles'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Stack,
} from '@mui/material'
import { useEffect, useState } from 'react'

interface Props {
  open: boolean
  onClose: () => void
  onSave: () => void
  onSave2: () => void
  practiceDate: string
}
  
export default function PracticeInputModal({ open, onClose, practiceDate, onSave, onSave2 }: Props) {
  const [title, setSong] = useState('')
  const [duration, setDuration] = useState<string>('')
  const [tempo, setTempo] = useState('')
  const [difficultPart, setDifficultPart] = useState('')
  const [memo, setMemo] = useState('')
  const {titles, fetchRecentTitles, loading: recentTitlesLoading} = useRecentTitles()
  
  const { createPracticeLog, loading: practiceLogLoading } = usePracticeLog()

  useEffect(() => {
    if (open) {
      fetchRecentTitles()
    }

  }, [open])

  const handleSave = async () => {
      const durationNum = parseInt(duration)
      const tempoNum = parseInt(tempo)
      const record = { title, duration: durationNum, tempo: tempoNum, difficult_part: difficultPart, memo, practice_date: formatDate(practiceDate) }
      await createPracticeLog(record)

      console.log('기록:', record)
      alert('기록 완료!')
      onClose()
      setSong('') // 입력 초기화
      onClose()
      onSave()
      onSave2()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>연습 기록 추가</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
        {/* 곡명 (검색 가능한 자동완성 필드) */}
        <Autocomplete
          freeSolo
          options={titles}
          value={title}
          onInputChange={(_, val) => setSong(val)}
          renderInput={(params) => <TextField {...params} label="곡명" />}
          sx={{ mt: 1 }}
      />

        {/* 연습 시간 (분 단위) */}
        <TextField
          label="연습 시간 (분)"
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          InputProps={{ inputProps: { min: 0 } }}
        />

        {/* 평균 템포 (bpm) */}
        <TextField
          label="평균 템포 (BPM)"
          type="number"
          value={tempo}
          onChange={(e) => setTempo(e.target.value)}
          InputProps={{ inputProps: { min: 0 } }}
        />

        {/* 어려웠던 부분 */}
        <TextField
          label="어려웠던 부분"
          multiline
          rows={2}
          value={difficultPart}
          onChange={(e) => setDifficultPart(e.target.value)}
        />

        {/* 기타 메모 */}
        <TextField
          label="기타 메모"
          multiline
          rows={2}
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>취소</Button>
        <Button onClick={handleSave} variant="contained">저장</Button>
      </DialogActions>
    </Dialog>
  )
}
