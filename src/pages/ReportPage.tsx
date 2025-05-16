import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
// Import html2pdf.js
import html2pdf from 'html2pdf.js';

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
      supabase
        .storage
        .from('scan_reports')
        .download(`scans/scan-${scanId}.json`)
        .then(({ data, error }) => {
          if (error) {
            setError('Could not fetch scan report.');
            setLoading(false);
            return;
          }
          if (data) {
            data.text().then((text: string) => {
              setData(JSON.parse(text));
              setLoading(false);
            });
          }
        });
    }
  }, [scanId]);

  const handleDownloadPdf = () => {
    const reportElement = document.getElementById('report-content');
    if (reportElement) {
      html2pdf().from(reportElement).save(`scan-report-${scanId}.pdf`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
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
      {/* Download PDF Button */}
      <button onClick={handleDownloadPdf} style={{ marginBottom: '1rem', float: 'right' }}>
        Download PDF
      </button>
      {/* Report Content */}
      <div id="report-content">
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
    </div>
  );
}
