import { addDays, startOfWeek, format } from 'date-fns'

export const daysKor = ['월', '화', '수', '목', '금', '토', '일'];
export const daysEng = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function getWeekDates(baseDate: Date) {
    const start = startOfWeek(baseDate, { weekStartsOn: 1 }) // 월요일 기준
    return Array.from({ length: 7 }).map((_, i) => {
      const d = addDays(start, i)
      return {
        date: format(d, 'yyyy-MM-dd'), // 날짜 키
        day: daysKor[i],               // 요일 (월~일)
        dayNumber: Number(format(d, 'dd')), // ex: 7 (숫자)
      }
    })
  }
