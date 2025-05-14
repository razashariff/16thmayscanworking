from fastapi import FastAPI, File, UploadFile, HTTPException, FileResponse
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List
from zap_handler import start_scan, get_scan_status, get_report_file

app = FastAPI()

@app.post("/scan")
async def initiate_scan(url: str, scan_id: str, scan_type: str = "full"):
    try:
        scan_id = start_scan(url, scan_type)
        return {"scan_id": scan_id, "status": "pending"}
    except Exception as e:
        return {"error": str(e)}

@app.get("/scan/{scan_id}")
async def get_scan_status(scan_id: str):
    try:
        status = get_scan_status(scan_id)
        return status
    except Exception as e:
        return {"error": str(e)}

@app.get("/report/{scan_id}")
async def get_report(scan_id: str):
    try:
        report_path = get_report_file(scan_id)
        return FileResponse(report_path, media_type='text/plain')
    except Exception as e:
        return {"error": str(e)} 