import { NextApiRequest, NextApiResponse } from 'next'
import puppeteer from 'puppeteer-core'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { scanId } = req.query
  if (!scanId) return res.status(400).json({ error: 'Missing scanId' })

  // Construct the URL to the report page
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/report/${scanId}`

  // Launch Puppeteer (locally or in serverless, adjust executablePath as needed)
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: process.env.CHROME_EXECUTABLE_PATH || '/usr/bin/google-chrome',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--single-process',
      '--no-zygote',
    ],
  })
  const page = await browser.newPage()
  await page.goto(url, { waitUntil: 'networkidle0' })
  const pdf = await page.pdf({ format: 'A4', printBackground: true })
  await browser.close()

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `attachment; filename="scan-${scanId}.pdf"`)
  res.send(pdf)
}
