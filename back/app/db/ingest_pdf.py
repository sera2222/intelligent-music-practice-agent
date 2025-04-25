
from embed_utils import embed_chunks
from pdf_cleaner import extract_and_clean_pdf
import os

import chromadb
from sentence_transformers import SentenceTransformer

from metadata import PDF_METADATA

BASE_DIR = "/Users/sera/hahaha/intelligent-music-practice-agent/back/app/db/data"

# 1. 임베딩 모델 로드
embedding_model = SentenceTransformer("sentence-transformers/distiluse-base-multilingual-cased-v2")

# 2. embedding_function 정의 (chroma가 요구하는 인터페이스)
class SentenceTransformerEmbeddingFunction(chromadb.EmbeddingFunction):
    def __call__(self, texts):
        return embedding_model.encode(texts).tolist()

embedding_fn = SentenceTransformerEmbeddingFunction()

# 3. PersistentClient 사용 (임베디드 모드)
chroma_client = chromadb.PersistentClient(path="./chroma_data")

chroma_client.delete_collection("practice_resources")
# 4. 컬렉션 생성 또는 로드
collection = chroma_client.get_or_create_collection(
    name="practice_resources",
    embedding_function=embedding_fn
)

def insert_pdf(filename, metadata_base):
    file_path = os.path.join(BASE_DIR, filename)

    print("file_path", file_path)

    paragraphs = extract_and_clean_pdf(file_path)
    embeddings = embed_chunks(paragraphs)

    ids = [f"{filename}_para_{i}" for i in range(len(paragraphs))]
    metadatas = [metadata_base] * len(paragraphs)

    print("paragraphs", len(paragraphs))

    collection.add(documents=paragraphs, embeddings=embeddings, metadatas=metadatas, ids=ids)


def list_pdf_files(folder_path: str) -> list[str]:
    return [
        f for f in os.listdir(folder_path)
        if f.endswith(".pdf") and os.path.isfile(os.path.join(folder_path, f))
    ]

import pandas as pd
from typing import Dict

def parse_pdf_metadata() -> Dict[str, Dict]:
    # CSV 파일 읽기
    df = pd.read_csv('./Enhanced_PDF_Metadata.csv', index_col=0)
    
    # 딕셔너리로 변환
    pdf_metadata = {}
    
    for index, row in df.iterrows():
        # 문자열로 된 리스트를 실제 리스트로 변환
        technique_keywords = eval(row['technique_keywords'])
        
        pdf_metadata[index] = {
            'instrument': row['instrument'],
            'type': row['type'],
            'topic': row['topic'],
            'technique_keywords': technique_keywords,
            'practice_goal': row['practice_goal']
        }
    
    return pdf_metadata

if __name__ == "__main__":
    pdf_metadata = parse_pdf_metadata()
    
    for filename, metadata in pdf_metadata.items():
        metadata_base = {
            "instrument": metadata["instrument"],
            "type": metadata["type"],
            "topic": metadata["topic"],
            "technique_keywords": ", ".join(metadata["technique_keywords"]),
            "practice_goal": metadata["practice_goal"]
        }
        
        insert_pdf(filename, metadata_base)

    # insert_pdf("data/피아노연습논문1.pdf")
    print("총 문서 수:", collection.count())
    peeked = collection.peek(n=1)
    if peeked:
        print("샘플 메타데이터:", peeked[0].metadata)

