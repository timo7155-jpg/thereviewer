'use client'

import { useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

const IDLE_TIMEOUT = 6 * 60 * 60 * 1000 // 6 hours in milliseconds

export default function SessionGuard() {
  const resetTimer = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastActivity', Date.now().toString())
    }
  }, [])

  useEffect(() => {
    // Set initial activity timestamp
    resetTimer()

    // Track user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart']
    events.forEach(event => window.addEventListener(event, resetTimer, { passive: true }))

    // Check idle every 60 seconds
    const interval = setInterval(async () => {
      const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0')
      const now = Date.now()

      if (lastActivity && now - lastActivity > IDLE_TIMEOUT) {
        // Check if user is actually logged in before logging out
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase.auth.signOut()
          window.location.href = '/dashboard/login?expired=true'
        }
      }
    }, 60000) // check every minute

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer))
      clearInterval(interval)
    }
  }, [resetTimer])

  return null // invisible component
}
