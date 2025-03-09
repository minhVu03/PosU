from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Any

app = FastAPI()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)