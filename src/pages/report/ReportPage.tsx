import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export default function ReportPage() {
  const { scanId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (scanId) {
      const filePath = `scans/scan-${scanId}.json`;
      supabase
        .storage
        .from('scan_reports')
        .download(filePath)
        .then(({ data, error }) => {
          if (error) {
            let msg = `Could not fetch scan report.\n`;
            msg += `File path attempted: ${filePath}\n`;
            msg += `Supabase error: ${error.message || error.error || error}\n`;
            if (error.statusCode === 404) {
              msg += 'File not found. Check that the scan report was uploaded and the filename matches.';
            } else if (error.statusCode === 401 || error.statusCode === 403) {
              msg += 'Permission denied. Check your Supabase Storage policy.';
            }
            setError(msg);
            setLoading(false);
            return;
          }
          if (data) {
            data.text().then((text: string) => {
              try {
                setData(JSON.parse(text));
              } catch (e) {
                setError(`Failed to parse JSON. File path: ${filePath}\nRaw text: ${text.slice(0, 200)}...`);
              }
              setLoading(false);
            });
          }
        });
    }
  }, [scanId]);

  if (loading) return <p>Loading...</p>;
  if (error) return (
    <div style={{ color: 'red', whiteSpace: 'pre-wrap', background: '#2b1a1a', padding: '1em', borderRadius: '8px' }}>
      <strong>Error loading scan report:</strong>
      <br />
      {error}
      <br /><br />
      <em>Tips:</em>
      <ul>
        <li>Check the file exists in Supabase Storage under <code>scan_reports/scans/</code>.</li>
        <li>Ensure the filename matches <code>scan-{'{scanId}'}.json</code>.</li>
        <li>If you see a permission error, check your Storage policy.</li>
        <li>If you see a file not found error, use the debug/test scripts to list files.</li>
      </ul>
    </div>
  );
  if (!data) return <p>No data found.</p>;

  const site = data.site?.[0];
  const alerts = site?.alerts || [];

  // Count vulnerabilities by risk level
  let high = 0, medium = 0, low = 0, info = 0;
  alerts.forEach((alert: any) => {
    if (alert.riskdesc?.toLowerCase().startsWith('high')) high++;
    else if (alert.riskdesc?.toLowerCase().startsWith('medium')) medium++;
    else if (alert.riskdesc?.toLowerCase().startsWith('low')) low++;
    else if (alert.riskdesc?.toLowerCase().startsWith('informational')) info++;
  });

  return (
    <div style={{ padding: '2rem', fontFamily: 'Inter, sans-serif', maxWidth: 800, margin: '0 auto' }}>
      <h1>Security Scan Report</h1>
      {/* DEBUG: Show raw alerts array and file path info */}
      <pre style={{background:'#f5f5f5',color:'#333',padding:'1em',overflow:'auto',fontSize:'0.85em'}}>
        File path: scans/scan-{scanId}.json\n
        alerts: {JSON.stringify(alerts, null, 2)}
      </pre>
      <p><strong>Scanned URL:</strong> {site?.['@name']}</p>
      <p><strong>Date:</strong> {data['@generated']}</p>
      <hr />
      {/* Vulnerability summary */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2>Summary</h2>
        <p><strong>Total Issues:</strong> {alerts.length}</p>
        <p><strong>High Risk:</strong> {high}</p>
        <p><strong>Medium Risk:</strong> {medium}</p>
        <p><strong>Low Risk:</strong> {low}</p>
        <p><strong>Informational:</strong> {info}</p>
      </div>
      {alerts.length === 0 && <p>No vulnerabilities found!</p>}
      {alerts.map((alert: any) => (
        <div key={alert.pluginid + alert.alertRef} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
          <h2>{alert.alert}</h2>
          <p><strong>Description:</strong> <span dangerouslySetInnerHTML={{ __html: alert.desc || '' }} /></p>
          <p><strong>Risk:</strong> {alert.riskdesc}</p>
          <p><strong>Solution:</strong> <span dangerouslySetInnerHTML={{ __html: alert.solution || '' }} /></p>
        </div>
      ))}
    </div>
  );
}
