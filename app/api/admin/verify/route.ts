import { NextRequest, NextResponse } from 'next/server'

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'timo7155@gmail.com').trim().toLowerCase()

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()
    const isAdmin = typeof email === 'string' && email.trim().toLowerCase() === ADMIN_EMAIL
    return NextResponse.json({ isAdmin })
  } catch {
    return NextResponse.json({ isAdmin: false })
  }
}
