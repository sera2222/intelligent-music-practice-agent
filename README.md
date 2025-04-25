# intelligent music practice agent

## Execution

### 1. Start FastAPI Backend

```bash
# (Optional) Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server (default: http://localhost:8000)
uvicorn app.main:app --reload
```

### 2. Start FastAPI Backend

```bash
# Move into frontend directory
cd frontend  # (or your Next.js directory)

# Install dependencies
npm install

# Run development server (default: http://localhost:3000)
npm run dev
```

### 3. Environment Variables
Before running the FastAPI server, make sure to set the following environment variables:

OPENAI_API_KEY: Your API key for accessing OpenAI services

DATABASE_URL: Local database connection string
(e.g., mysql+pymysql://user:password@localhost/dbname)

You can define these in a .env file or set them directly in your execution environment.