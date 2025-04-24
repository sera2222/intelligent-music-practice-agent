import {
    Box, Typography, TextField, IconButton, Stack, Paper, Link
  } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import EditIcon from '@mui/icons-material/Edit'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import { useState, useRef, useEffect } from 'react'

  
  export default function PracticeChat() {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState<string[]>([
      '오늘 남겨주신 연습 일지를 봤어요!\n\n멘델스존 협주곡 1악장에서 "음정을 맞추기 어려웠다"고 적어주셨는데요, 조금 더 구체적으로 알려주시면 연습 방법 추천에 도움이 될 것 같아요.\n\n어떤 부분에서 어떻게 어려웠는지 알려주시면, 해당 구간을 위한 연습 방법이나 자료를 바로 추천해드릴게요!',
      '38마디에서 3포지션에서 7포지션으로 올라가는 부분에서 음정을 정확히 짚는게 어려웠어.',
      '말씀해주신 부분을 보완하기 위한 학습 자료를 찾았어요.\n제공해드린 유튜브 영상을 시청하고, 내일은 영상에서의 방법을 적용해서 연습을 해보세요!\n\n🎻 violin position: sliding vs. stepping',
    ])

    const messagesEndRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])
    const [isComposing, setIsComposing] = useState(false)

    const [isLoading, setIsLoading] = useState(false)
  
    const handleSend = () => {
      if (!input.trim()) return
      setMessages(prev => [...prev, input.trim()])
      setInput('')
      setIsLoading(true)
      setTimeout(() => {
        /**
         * TODO: 여기에 API 호출 로직을 추가하세요.
         * 예시:
         * const response = await fetch('/api/chat', {
         *    method: 'POST',
         *    headers: { 'Content-Type': 'application/json' },
         *    body: JSON.stringify({ message: input }),
         * })
         */
      })
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        if (!isComposing) {
          e.preventDefault()
          // composition이 끝난 후 input 반영될 수 있게 약간 딜레이
          setTimeout(() => {
            const trimmed = input.trim()
            if (trimmed) {
              setMessages(prev => [...prev, trimmed])
              setInput('')
            }
          }, 0)
        } else {
          // 조합 중이면 아무것도 안함
          e.preventDefault()
        }
      }
    }
  
    return (
      <Paper sx={{ p: 2, mt: 2, width: '100%', maxWidth: 600 }}>
  
        {/* Messages */}
        <Stack spacing={2} sx={{ maxHeight: 400, overflowY: 'auto', mb: 2 }}>
          {messages.map((msg, idx) => (
            <Stack key={idx} direction="row" spacing={1} alignItems="flex-start">
              {idx % 2 === 0 ? (
                <>
                  <SmartToyIcon />
                  <Box
                    sx={{
                      bgcolor: '#f4f4f4',
                      p: 1.5,
                      borderRadius: 2,
                      whiteSpace: 'pre-line',
                      flex: 1,
                    }}
                  >
                    <Typography variant="body2">{msg}</Typography>
                    {msg.includes('violin position') && (
                      <Link href="#" underline="hover" sx={{ display: 'block', mt: 1 }}>
                        🎻 violin position: sliding vs. stepping
                      </Link>
                    )}
                  </Box>
                </>
              ) : (
                <Box sx={{ ml: 5 }}>
                  <Typography variant="body2">{msg}</Typography>
                </Box>
              )}
            </Stack>
          ))}
          <div ref={messagesEndRef} />
        </Stack>
  
        {/* Input field */}
        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            size="small"
            placeholder="메시지를 입력하세요"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposing(true)}
            onCompositionEnd={() => setIsComposing(false)}
            multiline
            minRows={3}
            maxRows={3}  // 높이 고정
          />
          <IconButton onClick={handleSend} color="primary">
            <SendIcon />
          </IconButton>
        </Stack>
      </Paper>
    )
  }
  