import {
    Box, Typography, TextField, IconButton, Stack, Paper, Link
  } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import EditIcon from '@mui/icons-material/Edit'
import SmartToyIcon from '@mui/icons-material/SmartToy'
import { useState, useRef, useEffect } from 'react'
import { usePracticeChat } from '@/hooks/usePraticeChat'
import { formatDate } from '@/constants/format'


interface ChatMessage {
  sender: 'user' | 'agent'
  message: string
  timestamp: string
}

interface Props {
  practiceLogId: number
  refreshTrigger?: number
}

export default function PracticeChat({practiceLogId, refreshTrigger}: Props) {
  const [input, setInput] = useState('')
  const { messages, setMessages, fetchChatThread, saveChatThread } = usePracticeChat(practiceLogId)
  // const [messages, setMessages] = useState<string[]>([
  //   '오늘 남겨주신 연습 일지를 봤어요!\n\n멘델스존 협주곡 1악장에서 "음정을 맞추기 어려웠다"고 적어주셨는데요, 조금 더 구체적으로 알려주시면 연습 방법 추천에 도움이 될 것 같아요.\n\n어떤 부분에서 어떻게 어려웠는지 알려주시면, 해당 구간을 위한 연습 방법이나 자료를 바로 추천해드릴게요!',
  //   '38마디에서 3포지션에서 7포지션으로 올라가는 부분에서 음정을 정확히 짚는게 어려웠어.',
  //   '말씀해주신 부분을 보완하기 위한 학습 자료를 찾았어요.\n제공해드린 유튜브 영상을 시청하고, 내일은 영상에서의 방법을 적용해서 연습을 해보세요!\n\n🎻 violin position: sliding vs. stepping',
  // ])

  useEffect(() => {
    fetchChatThread()
  }, [])

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])
  const [isComposing, setIsComposing] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed) return
  
    const userMessage = {
      sender: 'user',
      message: trimmed,
      timestamp: formatDate(new Date().toLocaleDateString()),
    }
  
    // 로컬에 사용자 메시지만 임시 추가
    const updated = [...messages, userMessage]
    setMessages(updated)
    setInput('')
    setIsLoading(true)
  
    // 서버에 메시지 전송 (agent 응답까지 저장)
    await saveChatThread([userMessage]).then((data) => {
      console.log('Saving chat thread:', data)
    })
  
    // 서버에서 전체 스레드 다시 fetch
    await fetchChatThread().then((data) => {
      console.log('Fetched chat thread:', data)
    })
  
    setIsLoading(false)
  }
  

  // const handleSend = async () => {
  //   if (!input.trim()) return
  //   const newMessage = {
  //     sender: 'user',
  //     message: input.trim(),
  //     timestamp: formatDate(new Date().toLocaleDateString()),
  //   }
  //   const updated = [...messages, newMessage]
  //   setMessages(updated)
  //   setInput('')
  //   setIsLoading(true)
    
  //   await saveChatThread(updated)
  //   setIsLoading(false)
  // }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (!isComposing) {
        e.preventDefault()
        // composition이 끝난 후 input 반영될 수 있게 약간 딜레이
        setTimeout(() => {
          handleSend()
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
      <Stack spacing={2} sx={{ height: 380, overflowY: 'auto', mb: 2 }}>
      {messages.map((msg, idx) => (
        <Stack key={idx} direction="row" spacing={1} alignItems="flex-start">
          {msg.sender === 'agent' ? (
            <>
              <SmartToyIcon />
              <Box
                sx={{
                  bgcolor: '#CADDE5',
                  p: 1.5,
                  borderRadius: 2,
                  whiteSpace: 'pre-line',
                  flex: 1,
                }}
              >
                <Typography variant="body2">{msg.message}</Typography>
                {msg.message.includes('violin position') && (
                  <Link href="#" underline="hover" sx={{ display: 'block', mt: 1 }}>
                    🎻 violin position: sliding vs. stepping
                  </Link>
                )}
              </Box>
            </>
          ) : (
            <Box sx={{ ml: 5 }}>
              <Typography variant="body2">{msg.message}</Typography>
            </Box>
          )}
        </Stack>
      ))}

      {isLoading && (
          <Stack direction="row" spacing={1} alignItems="center">
            <SmartToyIcon />
            <Box
              sx={{
                bgcolor: '#CADDE5',
                p: 1.5,
                borderRadius: 2,
                fontStyle: 'italic',
              }}
            >
              <Typography variant="body2">답변 생성 중...</Typography>
            </Box>
          </Stack>
        )}
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
  