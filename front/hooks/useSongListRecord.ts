import { useEffect, useState } from 'react'

const pastSongs = [
    '멘델스존 바이올린 협주곡 제1악장',
    '바흐 무반주 파르티타 2번',
    '비발디 사계 중 봄',
    '모차르트 협주곡 3번',
  ]

export function useSongListRecord() {
  const [songs, setSongs] = useState<string[]>([])

  // 초기 로딩
  useEffect(() => {
    setSongs(pastSongs)
  }, [])

  // 저장
  const saveSong = (song: string) => {
    const updated = [...songs, song]
    setSongs(updated)
  }

  return { setSongs, saveSong }
}
