import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({ headless: true })
const page = await browser.newPage()

await page.goto('http://localhost:3000/proposal', { waitUntil: 'networkidle0', timeout: 30000 })

// Hide the print button before generating PDF
await page.evaluate(() => {
  const printDiv = document.querySelector('.print\\:hidden')
  if (printDiv) printDiv.style.display = 'none'
})

await page.pdf({
  path: 'C:/Users/User/Desktop/thereviewer/public/proposal_v2.pdf',
  format: 'A4',
  printBackground: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
})

await browser.close()
console.log('PDF generated: public/proposal_v2.pdf')
