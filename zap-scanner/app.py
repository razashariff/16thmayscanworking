
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from typing import Optional
import zap_handler
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()

# Add CORS middleware with proper configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods including OPTIONS for preflight
    allow_headers=["*"],  # Allows all headers
    expose_headers=["*"]  # Expose all headers
)

class ScanRequest(BaseModel):
    url: str
    scan_id: Optional[str] = None
    scan_type: str = "full"  # "spider" or "full"

class ScanStatus(BaseModel):
    scan_id: str
    progress: int
    status: str
    results: Optional[dict] = None
    error: Optional[str] = None

# For API security
API_SECRET = "8bb1c57ce11343100ceb53cfccf9e48373bacce0773b6f91c11e20a8f0f992a"

async def verify_api_key(request: Request):
    auth_header = request.headers.get("Authorization")
    secret_header = request.headers.get("x-zap-secret")
    
    # Check header format
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid Authorization header")
    
    # Extract token
    token = auth_header.split(" ")[1]
    
    # Verify token matches our API secret
    if token != API_SECRET or secret_header != API_SECRET:
        raise HTTPException(status_code=403, detail="Invalid API key")
    
    return True

@app.get("/")
async def root():
    return {"status": "ZAP Scanner API is running"}

@app.post("/scan")
async def start_scan_post(scan_request: ScanRequest, request: Request):
    # Verify API key
    await verify_api_key(request)
    
    try:
        # Log details for debugging
        print(f"Starting scan for URL: {scan_request.url}, scan_id: {scan_request.scan_id}")
        
        # Start the scan
        scan_id = zap_handler.start_scan(scan_request.url, scan_request.scan_type)
        
        # Return scan information
        return {
            "scan_id": scan_id,
            "status": "pending",
            "results": None,
            "error": None
        }
    except Exception as e:
        print(f"Error starting scan: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/scan/{scan_id}")
async def get_scan_status(scan_id: str, request: Request):
    # Verify API key
    await verify_api_key(request)
    
    try:
        # Log the request for debugging
        print(f"Checking status for scan_id: {scan_id}")
        
        # Get scan status from ZAP handler
        status = zap_handler.get_scan_status(scan_id)
        
        # Return status information
        return status
    except Exception as e:
        print(f"Error getting scan status: {str(e)}")
        if "Scan not found" in str(e):
            raise HTTPException(status_code=404, detail=f"Scan not found: {scan_id}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
