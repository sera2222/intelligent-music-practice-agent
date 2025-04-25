import { Box, Typography, IconButton, Paper, Stack, Divider, Link } from '@mui/material'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

export default function WeeklyGoalView() {
  return (
    <Box p={2} maxWidth={600} mx="auto">
      {/* 헤더 */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <IconButton size="small">
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <Typography variant="h6">이번주 목표</Typography>
        <IconButton size="small">
          <HelpOutlineIcon />
        </IconButton>
      </Stack>

      {/* 지난주 요약 */}
      <Paper variant="outlined" sx={{ bgcolor: '#F2F2F2', p: 2, mb: 3 }}>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
          지난주에는, 멘델스존 바이올린 협주곡 제 1악장을 주로 연습했어요.
          연습 기록을 보니, 악보를 끝까지 읽는 데는 성공했지만, 고음 부분에서 음정이 불안정한 문제가 있다고 적어주셨네요.
          기존 템포를 아직 달성하지 못했지만, 템포를 올리는 것보다는 음정을 맞추는 것이 더 우선되어야 해요.
          이번 주 목표는 이 점들을 반영해서 설정했어요.
        </Typography>
      </Paper>

      {/* 목표 상세 */}
      <Stack spacing={1} mb={3}>
        <Typography fontWeight="bold">멘델스존 바이올린 협주곡 제 1악장</Typography>
        <Typography variant="body2">▸ 목표템포: <b>50~55bpm</b></Typography>
        <Typography variant="body2">▸ 목표연습시간: <b>350분</b></Typography>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
          ▸ 초반부 고음 부분에서 음정을 정확히 짚는 것에 유의해서 연습하세요.
          특히 도입부와, 35마디 ~ 108마디 부분이 중요합니다.
          도입부 연주가 익숙해지면, 느낌을 살리도록 연습하세요.
        </Typography>
      </Stack>

      {/* 하단 버튼 */}
      <Box textAlign="right">
        <Link href="#" underline="hover" fontSize="14px">목표재설정</Link>
      </Box>
    </Box>
  )
}
