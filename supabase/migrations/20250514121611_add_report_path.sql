-- Add report_path column to vulnerability_scans table
ALTER TABLE vulnerability_scans
ADD COLUMN report_path TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN vulnerability_scans.report_path IS 'Path to the generated ZAP scan report file';
