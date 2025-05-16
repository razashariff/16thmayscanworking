# Changelog

All notable changes to the Vulnerability Scanner project will be documented in this file.

---

## [Unreleased]

### Added
- **New Vulnerability Scan Page**
  - Created a new scan page allowing users to select a URL from Supabase, start a scan, and view the latest scan report.
  - After scan initiation, the app polls the Supabase Storage bucket for the latest `.json` report file and displays its contents.
  - The workflow is now consistent with `TestLatestScan.html`, ensuring users always see the most recent scan result for their selected URL.

### Improved
- **User Experience**
  - Simplified the scan flow: user selects a URL, starts a scan, and sees the latest report automatically.
  - JSON report is shown in a `<pre>` block for clarity; future updates will convert this to a styled HTML report.
  - Reduced confusion by always fetching results from storage, not from a database or status endpoint.

### Fixed
- **Polling Logic**
  - Fixed polling to always show the latest scan report, regardless of scan_id or filename format.

### Security
- **Supabase Storage**
  - Scan results are securely fetched directly from the Supabase Storage bucket.

---

## [Earlier]

- Initial implementation of Vulnerability Scanner with React, Vite, Supabase, and toast notifications.
- Added support for listing scan reports, viewing scan details, and error handling for failed scans.
- Implemented user session management and secure API integration.

---

## How to Use This Changelog
- Refer to this file for a summary of all major fixes, improvements, and refactors.
- Use the details here to assist with debugging, future upgrades, or when discussing the project in other chats.

---
