from fastapi import FastAPI

app = FastAPI(title="Neuti Backend")

@app.get("/health")
async def health_check():
    return {"status": "ok"}
