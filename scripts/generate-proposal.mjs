import { jsPDF } from 'jspdf'
import fs from 'fs'

const doc = new jsPDF({ unit: 'mm', format: 'a4' })
const W = 210
const H = 297
const margin = 20
const contentW = W - margin * 2

// Colors
const blue = [37, 99, 235]
const darkBlue = [15, 23, 42]
const gray = [100, 116, 139]
const lightGray = [148, 163, 184]
const white = [255, 255, 255]
const green = [16, 185, 129]
const purple = [124, 58, 237]

let y = 0

// ========== PAGE 1 — Cover / Intro ==========

// Blue header bar
doc.setFillColor(...blue)
doc.rect(0, 0, W, 65, 'F')

// Logo
doc.setFillColor(255, 255, 255)
doc.roundedRect(margin, 15, 14, 14, 3, 3, 'F')
doc.setFontSize(12)
doc.setTextColor(...blue)
doc.setFont('helvetica', 'bold')
doc.text('R', margin + 4.8, 24.5)

// Brand name
doc.setFontSize(18)
doc.setTextColor(...white)
doc.setFont('helvetica', 'bold')
doc.text('TheReviewer.mu', margin + 18, 24.5)

// Title
doc.setFontSize(26)
doc.setTextColor(...white)
doc.setFont('helvetica', 'bold')
doc.text('Partner With Us', margin, 48)

doc.setFontSize(11)
doc.setFont('helvetica', 'normal')
doc.text('Discover, Rate, and Book — Mauritius\' Business Review Platform', margin, 57)

y = 80

// Intro paragraph
doc.setTextColor(...darkBlue)
doc.setFontSize(11)
doc.setFont('helvetica', 'normal')
const introText = 'TheReviewer.mu is Mauritius\' dedicated platform for discovering, rating, and booking businesses. We aggregate and analyse public reviews using AI to provide customers with trusted insights, and we give business owners the tools to manage their reputation, respond to feedback, and grow.'
const introLines = doc.splitTextToSize(introText, contentW)
doc.text(introLines, margin, y)
y += introLines.length * 5.5 + 10

// What's already live section
doc.setFontSize(14)
doc.setFont('helvetica', 'bold')
doc.setTextColor(...blue)
doc.text('What\'s Already Live', margin, y)
y += 8

const stats = [
  ['200+', 'Businesses listed across Mauritius'],
  ['7', 'Categories: Hotels, Restaurants, Spas, Tours, Car Rental, Retail, Services'],
  ['289,000+', 'Public reviews analyzed by our AI'],
  ['AI-Powered', 'Scores, strengths, and improvement insights per business'],
  ['Bilingual', 'Full English and French support'],
  ['Instant', 'Booking requests for hotels, restaurants, and services'],
]

stats.forEach(([num, desc]) => {
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...blue)
  doc.text(num, margin, y)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...gray)
  doc.text(desc, margin + 28, y)
  y += 7
})

y += 8

// Your business is already listed
doc.setFillColor(248, 250, 252)
doc.roundedRect(margin, y, contentW, 30, 3, 3, 'F')
doc.setFontSize(11)
doc.setFont('helvetica', 'bold')
doc.setTextColor(...darkBlue)
doc.text('Your business is already on TheReviewer.mu', margin + 5, y + 10)
doc.setFont('helvetica', 'normal')
doc.setFontSize(10)
doc.setTextColor(...gray)
const alreadyText = 'Customers can already see your business profile, ratings, and AI analysis. By claiming your listing, you take control of your reputation.'
const alreadyLines = doc.splitTextToSize(alreadyText, contentW - 10)
doc.text(alreadyLines, margin + 5, y + 17)

y += 40

// Why it matters
doc.setFontSize(14)
doc.setFont('helvetica', 'bold')
doc.setTextColor(...blue)
doc.text('Why It Matters', margin, y)
y += 8

const reasons = [
  '90% of customers read reviews before choosing a business',
  'Businesses that respond to reviews see 33% higher revenue',
  'AI insights reveal what customers truly think — beyond star ratings',
  'Direct booking through your listing reduces commission fees',
]

reasons.forEach(r => {
  doc.setFillColor(...green)
  doc.circle(margin + 2, y - 1.5, 1.5, 'F')
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...darkBlue)
  doc.text(r, margin + 7, y)
  y += 7
})

// ========== PAGE 2 — Plans ==========
doc.addPage()
y = 20

doc.setFontSize(20)
doc.setFont('helvetica', 'bold')
doc.setTextColor(...darkBlue)
doc.text('Plans for Business Owners', margin, y)
y += 5
doc.setFontSize(10)
doc.setFont('helvetica', 'normal')
doc.setTextColor(...gray)
doc.text('Searching and reading reviews is always free for everyone.', margin, y + 5)
y += 18

// Free Plan Box
doc.setDrawColor(226, 232, 240)
doc.setFillColor(248, 250, 252)
doc.roundedRect(margin, y, (contentW - 5) / 2, 90, 3, 3, 'FD')

let freeY = y + 8
doc.setFontSize(14)
doc.setFont('helvetica', 'bold')
doc.setTextColor(...darkBlue)
doc.text('Free', margin + 5, freeY)
freeY += 6
doc.setFontSize(20)
doc.text('MUR 0', margin + 5, freeY)
doc.setFontSize(9)
doc.setFont('helvetica', 'normal')
doc.setTextColor(...gray)
doc.text('/month', margin + 32, freeY)
freeY += 10

const freeFeatures = [
  'Create your account',
  'Claim your business listing',
  'View all reviews & analysis',
  'Basic business profile',
  '1 free AI improvement tip',
]

freeFeatures.forEach(f => {
  doc.setFillColor(...green)
  doc.circle(margin + 7, freeY - 1, 1, 'F')
  doc.setFontSize(9)
  doc.setTextColor(...darkBlue)
  doc.text(f, margin + 11, freeY)
  freeY += 6
})

// Premium Plan Box
const premX = margin + (contentW - 5) / 2 + 5
doc.setDrawColor(...blue)
doc.setLineWidth(0.5)
doc.setFillColor(255, 255, 255)
doc.roundedRect(premX, y, (contentW - 5) / 2, 90, 3, 3, 'FD')

// Recommended badge
doc.setFillColor(...blue)
doc.roundedRect(premX + 15, y - 4, 30, 8, 2, 2, 'F')
doc.setFontSize(6)
doc.setFont('helvetica', 'bold')
doc.setTextColor(...white)
doc.text('RECOMMENDED', premX + 18, y + 1)

let premY = y + 8
doc.setFontSize(14)
doc.setFont('helvetica', 'bold')
doc.setTextColor(...darkBlue)
doc.text('Premium', premX + 5, premY)
premY += 6

// Strikethrough price
doc.setFontSize(10)
doc.setTextColor(...lightGray)
doc.text('MUR 3,000', premX + 5, premY)
doc.setDrawColor(...lightGray)
doc.line(premX + 5, premY - 1, premX + 28, premY - 1)

doc.setFontSize(20)
doc.setFont('helvetica', 'bold')
doc.setTextColor(...blue)
doc.text('MUR 2,490', premX + 30, premY)
doc.setFontSize(9)
doc.setFont('helvetica', 'normal')
doc.setTextColor(...gray)
doc.text('/month', premX + 63, premY)
premY += 5

doc.setFontSize(7)
doc.setTextColor(239, 68, 68)
doc.setFont('helvetica', 'bold')
doc.text('Launch offer — limited to first 50 subscribers', premX + 5, premY)
premY += 7

const premFeatures = [
  'Everything in Free',
  'Reply to all reviews',
  'Upload & manage photos',
  'Full AI analytics dashboard',
  'Reviewer contact details',
  'Service quality tracking',
  'Booking requests',
  'Priority support',
]

premFeatures.forEach(f => {
  doc.setFillColor(...blue)
  doc.circle(premX + 7, premY - 1, 1, 'F')
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...darkBlue)
  doc.text(f, premX + 11, premY)
  premY += 5.5
})

y += 100

// How it works
doc.setFontSize(14)
doc.setFont('helvetica', 'bold')
doc.setTextColor(...blue)
doc.text('How It Works', margin, y)
y += 10

const steps = [
  ['1', 'Create Account', 'Sign up for free at thereviewer.mu — takes 30 seconds.'],
  ['2', 'Claim Your Business', 'Submit a claim request. Our team verifies within 24-48 hours.'],
  ['3', 'Access Your Dashboard', 'See your reviews, scores, AI insights, and manage your listing.'],
  ['4', 'Upgrade to Premium', 'Unlock replies, full analytics, photo management, and more.'],
]

steps.forEach(([num, title, desc]) => {
  doc.setFillColor(...blue)
  doc.circle(margin + 4, y, 4, 'F')
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(...white)
  doc.text(num, margin + 2.5, y + 1.5)

  doc.setTextColor(...darkBlue)
  doc.setFontSize(11)
  doc.text(title, margin + 12, y + 1)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...gray)
  doc.setFontSize(9)
  doc.text(desc, margin + 12, y + 7)
  y += 16
})

y += 5

// Contact section
doc.setFillColor(...blue)
doc.roundedRect(margin, y, contentW, 40, 3, 3, 'F')

doc.setFontSize(14)
doc.setFont('helvetica', 'bold')
doc.setTextColor(...white)
doc.text('Ready to Get Started?', margin + 5, y + 12)

doc.setFontSize(10)
doc.setFont('helvetica', 'normal')
doc.text('Contact us for a personal walkthrough or claim your business today.', margin + 5, y + 20)

doc.setFontSize(10)
doc.setFont('helvetica', 'bold')
doc.text('Timothee Lisette, Founder & CEO', margin + 5, y + 30)
doc.setFont('helvetica', 'normal')
doc.text('Phone: +230 5813 7384  |  Email: contact@thereviewer.mu  |  thereviewer.mu', margin + 5, y + 36)

// Save
const output = doc.output('arraybuffer')
fs.writeFileSync('C:/Users/User/Desktop/thereviewer/public/proposal.pdf', Buffer.from(output))
console.log('PDF generated successfully!')
