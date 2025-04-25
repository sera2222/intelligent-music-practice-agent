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
chroma_client = chromadb.PersistentClient(path="./chroma_data")

# 4. 컬렉션 생성 또는 로드
collection = chroma_client.get_or_create_collection(
    name="practice_resources",
    embedding_function=embedding_fn
)
