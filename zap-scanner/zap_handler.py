
from zapv2 import ZAPv2
import time
import uuid
import json

# Initialize ZAP
zap = ZAPv2(proxies={'http': 'http://127.0.0.1:8080', 'https': 'http://127.0.0.1:8080'})

# Store scan statuses
active_scans = {}

def start_scan(target_url: str, scan_type: str = "full"):
    scan_id = str(uuid.uuid4())
    
    try:
        # Configure ZAP
        print(f'Accessing target {target_url}')
        zap.urlopen(target_url)
        zap.core.new_session()
        
        # Spider scan
        print('Starting Spider scan')
        scan_id = zap.spider.scan(target_url)
        active_scans[scan_id] = {
            "type": scan_type,
            "progress": 0,
            "status": "spider_running",
            "target": target_url,
            "results": None
        }
        
        if scan_type == "full":
            # Start the Active Scanner
            print('Starting Active scan')
            ascan_id = zap.ascan.scan(target_url)
            active_scans[scan_id]["ascan_id"] = ascan_id
        
        return scan_id
    
    except Exception as e:
        print(f'Error during scan: {str(e)}')
        raise

def get_scan_status(scan_id: str):
    if scan_id not in active_scans:
        raise Exception("Scan not found")
    
    scan_info = active_scans[scan_id]
    
    try:
        # Check spider progress
        if scan_info["status"] == "spider_running":
            progress = zap.spider.status(scan_id)
            scan_info["progress"] = progress
            
            if progress >= 100:
                scan_info["status"] = "spider_completed"
                if scan_info["type"] == "full":
                    scan_info["status"] = "active_scan_running"
        
        # Check active scan progress if applicable
        elif scan_info["status"] == "active_scan_running":
            progress = zap.ascan.status(scan_info["ascan_id"])
            scan_info["progress"] = progress
            
            if progress >= 100:
                scan_info["status"] = "completed"
                scan_info["results"] = get_scan_results(scan_info["target"])
        
        return {
            "scan_id": scan_id,
            "progress": scan_info["progress"],
            "status": scan_info["status"],
            "results": scan_info["results"]
        }
    
    except Exception as e:
        print(f'Error getting scan status: {str(e)}')
        raise

def get_scan_results(target_url):
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
