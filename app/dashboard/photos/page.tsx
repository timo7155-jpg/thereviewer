'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useLang, LangToggle } from '@/lib/i18n'
import ImageUploader from '@/app/admin/businesses/ImageUploader'

export default function OwnerPhotosPage() {
  const router = useRouter()
  const { lang } = useLang()
  const [businessId, setBusinessId] = useState<string | null>(null)
  const [businessName, setBusinessName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/dashboard/login'); return }

      const { data: owner } = await supabase
        .from('business_owners')
        .select('plan, businesses(id, name)')
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .single()

      if (!owner || owner.plan !== 'premium') { router.push('/dashboard'); return }

      setBusinessId((owner.businesses as any)?.id)
      setBusinessName((owner.businesses as any)?.name || '')
      setLoading(false)
    }
    init()
  }, [router])

  if (loading) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500">{lang === 'fr' ? 'Chargement...' : 'Loading...'}</p>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-lg font-bold text-gray-900">TheReviewer<span className="text-blue-600">.mu</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <LangToggle />
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-blue-600 font-medium">
              {lang === 'fr' ? '← Tableau de bord' : '← Dashboard'}
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
          {lang === 'fr' ? 'Photos de votre entreprise' : 'Your Business Photos'}
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          {lang === 'fr'
            ? `Gérez les photos affichées sur la fiche de ${businessName}. Maximum 10 photos.`
            : `Manage photos displayed on ${businessName}'s listing. Maximum 10 photos.`}
        </p>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <p className="text-xs text-gray-500 mb-4">
            {lang === 'fr'
              ? 'La première photo sera utilisée comme photo de couverture sur la page d\'accueil.'
              : 'The first photo will be used as the cover photo on the homepage.'}
          </p>
          {businessId && <ImageUploader businessId={businessId} />}
        </div>
      </div>
    </main>
  )
}
