import os
import pandas as pd
import chromadb
from sentence_transformers import SentenceTransformer
from chromadb.utils.embedding_functions import EmbeddingFunction

# 1. 임베딩 모델
embedding_model = SentenceTransformer("sentence-transformers/distiluse-base-multilingual-cased-v2")

class SentenceTransformerEmbeddingFunction(EmbeddingFunction):
    def __call__(self, texts):
        return embedding_model.encode(texts).tolist()

embedding_fn = SentenceTransformerEmbeddingFunction()

# 2. 벡터 DB 클라이언트
chroma_client = chromadb.PersistentClient(path="./chroma_data")
collection = chroma_client.get_or_create_collection(
    name="incontext_examples",
    embedding_function=embedding_fn
)

# 3. CSV 로드
df = pd.read_csv("../llm/feedback_incontext_examples.csv")

# 4. 문서/벡터/메타데이터 추출
documents = df["practice_log"].tolist()
embeddings = embedding_model.encode(documents).tolist()
ids = df["example_id"].astype(str).tolist()

metadatas = []
for _, row in df.iterrows():
    metadatas.append({
        "user_info": row["user_info"],
        "goals": row["goals"],
        "feedback": row["feedback"],
        "instrument": "piano",
    })

# 5. Chroma에 추가
collection.add(documents=documents, embeddings=embeddings, metadatas=metadatas, ids=ids)

print(f"{collection.count()}개의 in-context examples 저장")
