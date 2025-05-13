
from fastapi import FastAPI, HTTPException, Request, Depends, Header
from pydantic import BaseModel
from typing import Optional, Dict, Any
import requests
import jwt
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

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

# Configuration
ZAP_SCANNER_URL = "https://zap-scanner-211605900220.europe-west2.run.app/scan"
JWT_SECRET = "8bb1c57ce11343100ceb53cfccf9e48373bacce0773b6f91c11e20a8f0f992a"  # For JWT validation

class ScanRequest(BaseModel):
    url: str
    scan_id: Optional[str] = None
    scan_type: str = "full"  # "spider" or "full"

class ScanStatus(BaseModel):
    scan_id: str
    status: str
    progress: Optional[int] = None
    results: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

async def verify_jwt(authorization: str = Header(None)):
    """Verify JWT token from the Authorization header"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Authorization header")
    
    try:
        # Extract token from "Bearer <token>"
        if not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Invalid authorization format")
        
        token = authorization.split(" ")[1]
        
        # Verify token
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            return payload
        except jwt.PyJWTError as e:
            print(f"JWT verification error: {str(e)}")
            raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
    
    except Exception as e:
        print(f"Authorization error: {str(e)}")
        raise HTTPException(status_code=401, detail=str(e))

@app.get("/")
async def root():
    return {"status": "ZAP Scanner API Proxy is running"}

@app.post("/scan")
async def start_scan_post(scan_request: ScanRequest, token_payload: dict = Depends(verify_jwt)):
    """
    Start a new vulnerability scan
    """
    try:
        # Log details for debugging
        print(f"Starting scan for URL: {scan_request.url}, scan_id: {scan_request.scan_id}")
        
        # Forward request to ZAP Scanner
        zap_request = {
            "url": scan_request.url
        }
        
        if scan_request.scan_id:
            zap_request["scan_id"] = scan_request.scan_id
            
        if scan_request.scan_type:
            zap_request["scan_type"] = scan_request.scan_type
            
        response = requests.post(
            ZAP_SCANNER_URL,
            json=zap_request,
            headers={"Content-Type": "application/json"}
        )
        
        if not response.ok:
            print(f"ZAP Scanner error: {response.status_code} - {response.text}")
            raise HTTPException(
                status_code=response.status_code, 
                detail=f"ZAP Scanner error: {response.text}"
            )
            
        zap_response = response.json()
        
        # Return scan information
        return {
            "scan_id": zap_response.get("scan_id", scan_request.scan_id or "unknown"),
            "status": zap_response.get("status", "pending"),
            "progress": zap_response.get("progress", 0),
            "results": None,
            "error": None
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error starting scan: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/scan/{scan_id}")
async def get_scan_status(scan_id: str, token_payload: dict = Depends(verify_jwt)):
    """
    Get the status of a scan
    """
    try:
        # Log the request for debugging
        print(f"Checking status for scan_id: {scan_id}")
        
        # Forward request to ZAP Scanner
        response = requests.get(
            f"{ZAP_SCANNER_URL}/{scan_id}",
            headers={"Content-Type": "application/json"}
        )
        
        if not response.ok:
            print(f"ZAP Scanner error: {response.status_code} - {response.text}")
            if response.status_code == 404:
                return {
                    "scan_id": scan_id,
                    "status": "failed",
                    "progress": 0,
                    "results": None,
                    "error": "Scan not found on ZAP server"
                }
                
            raise HTTPException(
                status_code=response.status_code, 
                detail=f"ZAP Scanner error: {response.text}"
            )
            
        zap_response = response.json()
        
        # Return status information
        return {
            "scan_id": zap_response.get("scan_id", scan_id),
            "status": zap_response.get("status", "unknown"),
            "progress": zap_response.get("progress", 0),
            "results": zap_response.get("results"),
            "error": zap_response.get("error")
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error getting scan status: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
