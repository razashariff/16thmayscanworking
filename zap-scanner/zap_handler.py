
from zapv2 import ZAPv2
import time
import uuid
import json

# Initialize ZAP
zap = ZAPv2(proxies={'http': 'http://127.0.0.1:8080', 'https': 'http://127.0.0.1:8080'})

# Store scan statuses
active_scans = {}

def start_scan(target_url: str, scan_type: str = "full"):
    """
    Start a new ZAP scan
    
    Args:
        target_url: URL to scan
        scan_type: Type of scan (spider or full)
        
    Returns:
        scan_id: Unique ID for this scan
    """
    # Create unique scan ID if not provided
    scan_id = str(uuid.uuid4())
    
    try:
        # Configure ZAP
        print(f'Accessing target {target_url}')
        zap.urlopen(target_url)
        zap.core.new_session()
        
        # Spider scan
        print('Starting Spider scan')
        spider_id = zap.spider.scan(target_url)
        
        # Store scan information
        active_scans[scan_id] = {
            "type": scan_type,
            "progress": 0,
            "status": "spider_running",
            "target": target_url,
            "results": None,
            "spider_id": spider_id
        }
        
        # For full scans, we'll add active scan information later
        if scan_type == "full":
            active_scans[scan_id]["ascan_id"] = None
        
        return scan_id
    
    except Exception as e:
        print(f'Error during scan initialization: {str(e)}')
        raise Exception(f"Failed to start scan: {str(e)}")

def get_scan_status(scan_id: str):
    """
    Get the status of a scan
    
    Args:
        scan_id: ID of the scan
        
    Returns:
        status: Dictionary with scan status information
    """
    if scan_id not in active_scans:
        raise Exception(f"Scan not found: {scan_id}")
    
    scan_info = active_scans[scan_id]
    
    try:
        # Check spider progress
        if scan_info["status"] == "spider_running":
            spider_id = scan_info.get("spider_id", "1")
            progress = int(zap.spider.status(spider_id))
            scan_info["progress"] = progress
            
            if progress >= 100:
                print(f"Spider completed for scan {scan_id}")
                scan_info["status"] = "spider_completed"
                
                # For full scans, start the active scanner
                if scan_info["type"] == "full":
                    print(f"Starting active scan for {scan_id}")
                    # Wait for passive scan to complete
                    time.sleep(2)
                    ascan_id = zap.ascan.scan(scan_info["target"])
                    scan_info["ascan_id"] = ascan_id
                    scan_info["status"] = "active_scan_running"
                else:
                    # For spider-only scans, we're done
                    scan_info["status"] = "completed"
                    scan_info["results"] = get_scan_results(scan_info["target"])
        
        # Check active scan progress if applicable
        elif scan_info["status"] == "active_scan_running":
            if scan_info.get("ascan_id") is None:
                # If active scan ID is missing, start the active scan
                ascan_id = zap.ascan.scan(scan_info["target"])
                scan_info["ascan_id"] = ascan_id
                scan_info["progress"] = 0
            else:
                # Get active scan progress
                ascan_id = scan_info["ascan_id"]
                progress = int(zap.ascan.status(ascan_id))
                scan_info["progress"] = progress
                
                if progress >= 100:
                    print(f"Active scan completed for {scan_id}")
                    scan_info["status"] = "completed"
                    scan_info["results"] = get_scan_results(scan_info["target"])
        
        return {
            "scan_id": scan_id,
            "progress": scan_info["progress"],
            "status": scan_info["status"],
            "results": scan_info["results"],
            "error": None
        }
    
    except Exception as e:
        print(f'Error getting scan status: {str(e)}')
        # Update scan status to failed
        scan_info["status"] = "failed"
        scan_info["error"] = str(e)
        
        return {
            "scan_id": scan_id,
            "progress": scan_info.get("progress", 0),
            "status": "failed",
            "results": None,
            "error": str(e)
        }

def get_scan_results(target_url):
    """
    Get results from a completed scan
    
    Args:
        target_url: URL that was scanned
        
    Returns:
        results: Dictionary with scan results
    """
    try:
        # Get alerts from ZAP
        alerts = zap.core.alerts(baseurl=target_url)
        
        # Organize results by risk level
        results = {
            "high": [],
            "medium": [],
            "low": [],
            "informational": []
        }
        
        for alert in alerts:
            risk = alert["risk"].lower()
            if risk in results:
                results[risk].append({
                    "name": alert["name"],
                    "description": alert["description"],
                    "url": alert["url"],
                    "param": alert["param"],
                    "solution": alert["solution"]
                })
        
        return results
    except Exception as e:
        print(f'Error getting scan results: {str(e)}')
        return {"error": str(e)}
