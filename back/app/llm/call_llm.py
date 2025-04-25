import os
from string import Template
from openai import OpenAI
import httpx

api_key = os.environ.get("OPENAI_API_KEY")
if not api_key:
    raise RuntimeError("OPENAI_API_KEY 환경변수가 설정되어 있지 않습니다")

client = OpenAI(api_key=api_key)

async def fetch_vector_search(summary: str, instrument: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "http://localhost:8000/vector/search",  # 실제 서버 주소
            params={"query": summary, "instrument": instrument}
        )
        response.raise_for_status()
        return response.json()
    
def summarize_logs(past_logs, weekly_goal):
    # LLM 요약 생성 로직
    # log_summaries: 연습 로그 요약 리스트
    # weekly_goal: 주간 목표
    logs_text = "\n".join([f"• 연습 곡명 : {log.title} | 연습 일자 : {log.practice_date}  | 연습 시간 : {log.duration}분  | 평균 BPM {log.tempo} | 어려웠던 부분 : {log.difficult_part} | 기타 메모 : {log.memo}" for log in past_logs])

    # 프롬프트 메시지 구성
    system_msg = (
        "당신은 숙련된 음악 연습 코치입니다. "
        "아래 연습 기록과 주간 목표를 참고해 3~4문장으로 간결하게 요약해 주세요."
    )
    user_msg = (
        f"연습 기록:\n{logs_text}\n\n"
        f"주간 목표: {weekly_goal}\n\n"
        "요약 (3~4문장):"
    )

    # GPT-4o 호출
    try:
        resp = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user",   "content": user_msg},
            ],
            temperature=0.5,
            max_tokens=150
        )

    except Exception as e:
        raise RuntimeError(f"요약 생성 중 오류 발생: {e}")

    # 요약문 리턴
    return resp.choices[0].message.content.strip()

def generate_feedback(weekly_goal, log, summary, vector_results, incontext_result):
    # LLM 피드백 생성 로직
    # log: 연습 로그
    # vector_results: 벡터 검색 결과
    # incontext_result: in-context example 검색 결과

    # 1. LLM에 전달할 프롬프트 생성
    incontext_info = incontext_result["example_input"] + " " + "| 목표: " + incontext_result["metadata"]["goals"]
    incontext_feedback = incontext_result["metadata"]["feedback"]
    user_info = "- 악기: piano"
    practice_log = f"• 연습 곡명 : {log.title} | 연습 일자 : {log.practice_date}  | 연습 시간 : {log.duration}분  | 평균 BPM {log.tempo} | 어려웠던 부분 : {log.difficult_part} | 기타 메모 : {log.memo}"
    goals = weekly_goal.summary if weekly_goal else ""


    with open("app/llm/prompts/feedback_prompt.txt", "r", encoding="utf-8") as f:
        template = Template(f.read())

    prompt_text = template.substitute(
        user_info=user_info,
        practice_log=practice_log,
        goals=goals,
        incontext_info=incontext_info,
        incontext_feedback=incontext_feedback,
        past_summary=summary,
        additional_resources=vector_results
    )
    print(prompt_text)

    # 4) GPT-4o 호출
    try:
        resp = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "당신은 사용자의 악기 연습을 도와주는 전문적인 레슨 선생님입니다. 사용자의 연습 기록과 목표를 바탕으로 기술적, 음악적 관점에서 피드백을 제공하고, 다음 연습 방향을 친절하고 전문적이며 친근한 말투로 제안해주세요."},
                {"role": "user",   "content": prompt_text}
            ],
            temperature=0.7,
            max_tokens=512
        )
    except Exception as e:
        raise RuntimeError(f"LLM 호출 중 오류 발생: {e}")

    # 5) 응답에서 답변만 추출해서 리턴
    feedback = resp.choices[0].message.content.strip()
    return feedback

async def generate_next_message(messages):
    # LLM 다음 메시지 생성 로직
    # messages: 대화 메시지 리스트

    # 1. LLM에 전달할 프롬프트 생성
    system_msg = (
        "당신은 음악 연습을 도와주는 전문적인 레슨 선생님이에요."
        "아래 대화 내용과 참고 자료를 바탕으로, **마지막 사용자의 질문에만** 명확히 답해주세요."
    )
    messages_text = "\n\n".join([f"{msg['sender']}: {msg['message']}" for msg in messages[:-1]])

    # 사용자 마지막 메시지 내용 기반으로 자료 검색
    last_message = messages[-1]
    vector_results = await fetch_vector_search(last_message, "piano")
    
    docs = "\n".join(f"- {d['document']}" for d in vector_results)
    user_msg = "[참고자료]\n\n" + docs + "\n\n" + "[이전 대화내용]" + "\n\n" + messages_text + "\n\n" + "질문:\n\n" + f"{last_message['sender']}: {last_message['message']}" + "\n\n" + "**마지막 사용자의 질문에만** 명확히 답해주세요. \n\n답변:"

    # 2. GPT-4o 호출
    try:
        resp = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_msg},
                {"role": "user",   "content": user_msg}
            ],
            temperature=0.7,
            max_tokens=150
        )
    except Exception as e:
        raise RuntimeError(f"다음 메시지 생성 중 오류 발생: {e}")

    # 3. 응답에서 답변만 추출해서 리턴
    next_message = resp.choices[0].message.content.strip()
    return next_message