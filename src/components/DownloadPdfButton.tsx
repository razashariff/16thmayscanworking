import React from 'react'

interface DownloadPdfButtonProps {
  scanId: string
}

const DownloadPdfButton: React.FC<DownloadPdfButtonProps> = ({ scanId }) => (
  <a href={`/api/pdf?scanId=${scanId}`} target="_blank" rel="noopener noreferrer">
    <button className="btn btn-primary">Download PDF</button>
  </a>
)

export default DownloadPdfButton
