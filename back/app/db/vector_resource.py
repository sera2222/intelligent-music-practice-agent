from fastapi import APIRouter, Query
from typing import Optional

import chromadb
from sentence_transformers import SentenceTransformer

# 1. 임베딩 모델 로드
embedding_model = SentenceTransformer("sentence-transformers/distiluse-base-multilingual-cased-v2")

# 2. embedding_function 정의 (chroma가 요구하는 인터페이스)
class SentenceTransformerEmbeddingFunction(chromadb.EmbeddingFunction):
    def __call__(self, texts):
        return embedding_model.encode(texts).tolist()

embedding_fn = SentenceTransformerEmbeddingFunction()

# 3. PersistentClient 사용 (임베디드 모드)
chroma_client = chromadb.PersistentClient(path="app/db/chroma_data")

# 4. 컬렉션 생성 또는 로드
collection = chroma_client.get_or_create_collection(
    name="practice_resources",
    embedding_function=embedding_fn
)

router = APIRouter()

@router.get("/vector/search")
def search_vector(
    query: str = Query(..., description="연습 로그 기반의 검색 질의"),
    instrument: str = Query(..., description="악기명 (예: 'piano')")
):
    try:
        # 몇 개 문서 있는지 확인용 로그
        print(f"Collection document count: {collection.count()}")
        import os
        print("CWD:", os.getcwd())
        print("chromadb folders:", os.listdir(os.getcwd()))

        result = collection.query(
            query_texts=[query],
            n_results=5,
            where={"instrument": instrument}
        )

        # 결과 정리
        documents = result.get("documents", [[]])[0]
        metadatas = result.get("metadatas", [[]])[0]
        ids = result.get("ids", [[]])[0]
        distances = result.get("distances", [[]])[0]

        return [
            {
                "id": id_,
                "document": doc,
                "metadata": meta,
                "distance": dist
            }
            for id_, doc, meta, dist in zip(ids, documents, metadatas, distances)
        ]

    except Exception as e:
        return {"error": str(e)}


# --- incontext examples retrieval ---

incontext_collection = chroma_client.get_or_create_collection(
    name="incontext_examples",
    embedding_function=embedding_fn
)

@router.get("/vector/incontext")
def get_incontext_example(
    query: str = Query(..., description="사용자 연습 로그 및 주간 목표"),
):
    try:
        result = incontext_collection.query(
            query_texts=[query],
            n_results=1
        )

        # 예외 처리: 결과 없음
        if not result.get("documents", [[]])[0]:
            return {"message": "No in-context example found."}

        doc = result["documents"][0][0]
        metadata = result["metadatas"][0][0]
        doc_id = result["ids"][0][0]
        distance = result["distances"][0][0]

        return {
            "id": doc_id,
            "example_input": doc,
            "metadata": metadata,
            "distance": distance
        }

    except Exception as e:
        return {"error": str(e)}
