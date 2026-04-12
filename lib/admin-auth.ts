import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'timo7155@gmail.com'

export async function verifyAdmin(req: NextRequest): Promise<{ authorized: boolean; error?: string }> {
  try {
    // Get the auth token from the request cookies
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            cookie: req.headers.get('cookie') || ''
          }
        }
      }
    )

    // Try to get user from auth header or cookie
    const authHeader = req.headers.get('authorization')
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '')
      const { data: { user } } = await supabase.auth.getUser(token)
      if (user?.email === ADMIN_EMAIL) return { authorized: true }
    }

    // For browser requests, check via cookie-based session
    // Since admin pages use client-side auth, API calls from those pages
    // include cookies. We verify by checking the supabase auth cookie.
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.email === ADMIN_EMAIL) return { authorized: true }

    return { authorized: false, error: 'Unauthorized' }
  } catch {
    return { authorized: false, error: 'Auth check failed' }
  }
}

export function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL || 'timo7155@gmail.com'
}
