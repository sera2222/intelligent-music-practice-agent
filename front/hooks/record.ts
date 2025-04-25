export interface TRecord {
  id?: number;
  title: string;
  duration: number;         // number 타입으로
  tempo: number;            // number 타입으로
  difficult_part: string;   // 백엔드 필드명과 동일하게
  memo: string;
  practice_date: string;    // "YYYY-MM-DD" 형식의 문자열
}

export interface TRecordResponse extends TRecord {
  user_id: number;
  created_at: string;
  updated_at: string;
}
