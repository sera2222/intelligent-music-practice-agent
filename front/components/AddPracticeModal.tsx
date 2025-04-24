import { useSongListRecord } from '@/hooks/useSongListRecord'
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
  import { useState } from 'react'
  
  interface Props {
    open: boolean
    onClose: () => void
  }
  
  export default function PracticeInputModal({ open, onClose }: Props) {
    const [song, setSong] = useState('')
    const [duration, setDuration] = useState('')
    const [tempo, setTempo] = useState('')
    const [difficultPart, setDifficultPart] = useState('')
    const [memo, setMemo] = useState('')
    const [songs, setSongs] = useState<string[]>([
        '멘델스존 바이올린 협주곡 제1악장',
        '바흐 무반주 파르티타 2번',
        '비발디 사계 중 봄',
        '모차르트 협주곡 3번',
      ])

  
    const handleSave = () => {
        const record = { song, duration, tempo, difficultPart, memo }
        console.log('✅ 저장된 기록:', record)
    
        const trimmed = song.trim()
        if (trimmed && !songs.includes(trimmed)) {
            setSongs((prev) => [...prev, trimmed])
        }
        onClose()
        setSong('') // 입력 초기화
        onClose()
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
            options={songs}
            value={song}
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
  