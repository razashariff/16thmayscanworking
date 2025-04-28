
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import zap_handler
import uvicorn

app = FastAPI()

class ScanRequest(BaseModel):
    target_url: str
    scan_type: str = "full"  # "spider" or "full"

class ScanStatus(BaseModel):
    scan_id: str
    progress: int
    status: str
    results: Optional[dict] = None

@app.get("/")
async def root():
    return {"status": "ZAP Scanner API is running"}

@app.post("/scan")
async def start_scan(scan_request: ScanRequest):
    try:
        scan_id = zap_handler.start_scan(scan_request.target_url, scan_request.scan_type)
        return {"scan_id": scan_id, "status": "started"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/scan/{scan_id}")
async def get_scan_status(scan_id: str):
    try:
        status = zap_handler.get_scan_status(scan_id)
        return status
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
