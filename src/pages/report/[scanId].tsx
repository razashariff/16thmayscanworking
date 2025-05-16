import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function ReportPage() {
  const router = useRouter()
  const { scanId } = router.query
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (scanId) {
      // Fetch the scan report JSON from the scan_reports Supabase bucket
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
            // Read the Blob as text then parse JSON
            data.text().then((text: string) => {
              setData(JSON.parse(text));
              setLoading(false);
            });
          }
        })
    }
  }, [scanId])

  if (loading) return <p>Loading...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!data) return <p>No data found.</p>

  const site = data.site?.[0]
  const alerts = site?.alerts || []

  // Count vulnerabilities by risk level
  let high = 0, medium = 0, low = 0, info = 0
  alerts.forEach((alert: any) => {
    if (alert.riskdesc?.toLowerCase().startsWith('high')) high++
    else if (alert.riskdesc?.toLowerCase().startsWith('medium')) medium++
    else if (alert.riskdesc?.toLowerCase().startsWith('low')) low++
    else if (alert.riskdesc?.toLowerCase().startsWith('informational')) info++
  })

  return (
    <div style={{ padding: '2rem', fontFamily: 'Inter, sans-serif', maxWidth: 800, margin: '0 auto' }}>
      <h1>Security Scan Report</h1>
      {/* DEBUG: Show raw alerts array */}
      <pre style={{background:'#f5f5f5',color:'#333',padding:'1em',overflow:'auto',fontSize:'0.85em'}}>alerts: {JSON.stringify(alerts, null, 2)}</pre>
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
  )
}
