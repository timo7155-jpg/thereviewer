'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Lang = 'en' | 'fr'

const translations = {
  // Navbar
  'nav.hotels': { en: 'Businesses', fr: 'Entreprises' },
  'nav.forHotels': { en: 'Login', fr: 'Connexion' },
  'nav.adminPanel': { en: 'Admin Panel', fr: 'Panneau admin' },

  // Homepage
  'home.hero.title': { en: 'Find trusted reviews for businesses in Mauritius and Rodrigues', fr: 'Avis fiables sur les entreprises de Maurice et Rodrigues' },
  'home.hero.subtitle': { en: 'Real reviews from real customers \u2014 all in one place', fr: 'De vrais avis de vrais clients \u2014 tout en un seul endroit' },
  'home.search.placeholder': { en: 'Search by name, region...', fr: 'Rechercher par nom, r\u00e9gion...' },
  'home.search.button': { en: 'Search', fr: 'Rechercher' },
  'home.search.searching': { en: 'Searching...', fr: 'Recherche...' },
  'home.search.clear': { en: 'Clear', fr: 'Effacer' },
  'home.search.resultsFor': { en: 'Results for', fr: 'R\u00e9sultats pour' },
  'home.allHotels': { en: 'All businesses', fr: 'Toutes les entreprises' },
  'home.noResults': { en: 'No businesses found matching your search', fr: 'Aucune entreprise trouv\u00e9e correspondant \u00e0 votre recherche' },
  'home.noReviews': { en: 'No reviews yet', fr: 'Pas encore d\u2019avis' },
  'home.review': { en: 'review', fr: 'avis' },
  'home.reviews': { en: 'reviews', fr: 'avis' },

  // Hotel detail
  'hotel.backToAll': { en: '\u2190 Back to all businesses', fr: '\u2190 Retour \u00e0 toutes les entreprises' },
  'hotel.visitWebsite': { en: 'Visit website \u2192', fr: 'Visiter le site \u2192' },
  'hotel.writeReview': { en: 'Write a Review', fr: '\u00c9crire un avis' },
  'hotel.reviews': { en: 'Reviews', fr: 'Avis' },
  'hotel.noReviewsYet': { en: 'No reviews yet', fr: 'Pas encore d\u2019avis' },
  'hotel.beFirst': { en: 'Be the first to review', fr: 'Soyez le premier \u00e0 donner votre avis sur' },

  // Review form
  'review.title': { en: 'Write a Review', fr: '\u00c9crire un avis' },
  'review.name': { en: 'Your name', fr: 'Votre nom' },
  'review.email': { en: 'Your email', fr: 'Votre email' },
  'review.overall': { en: 'Overall rating', fr: 'Note globale' },
  'review.service': { en: 'Service', fr: 'Service' },
  'review.cleanliness': { en: 'Cleanliness', fr: 'Propret\u00e9' },
  'review.location': { en: 'Location', fr: 'Emplacement' },
  'review.food': { en: 'Food', fr: 'Nourriture' },
  'review.value': { en: 'Value', fr: 'Rapport qualit\u00e9/prix' },
  'review.body': { en: 'Your review', fr: 'Votre avis' },
  'review.submit': { en: 'Submit Review', fr: 'Soumettre l\u2019avis' },
  'review.submitting': { en: 'Submitting...', fr: 'Envoi en cours...' },
  'review.success': { en: 'Review submitted! Please check your email to verify.', fr: 'Avis soumis ! V\u00e9rifiez votre email pour confirmer.' },

  // Dashboard
  'dash.welcome': { en: 'Welcome to your dashboard', fr: 'Bienvenue sur votre tableau de bord' },
  'dash.manage': { en: 'Manage your business reviews and reputation', fr: 'G\u00e9rez les avis et la r\u00e9putation de votre entreprise' },
  'dash.claimHotel': { en: 'Claim your business', fr: 'R\u00e9clamer votre entreprise' },
  'dash.claimDesc': { en: 'Link your account to your business to start managing reviews', fr: 'Liez votre compte \u00e0 votre entreprise pour g\u00e9rer vos avis' },
  'dash.claimBtn': { en: 'Claim a business', fr: 'R\u00e9clamer une entreprise' },
  'dash.overallRating': { en: 'Overall rating', fr: 'Note globale' },
  'dash.totalReviews': { en: 'Total reviews', fr: 'Total des avis' },
  'dash.repliesSent': { en: 'Replies sent', fr: 'R\u00e9ponses envoy\u00e9es' },
  'dash.noReviews': { en: 'No reviews yet \u2014 share your listing to get your first review', fr: 'Pas encore d\u2019avis \u2014 partagez votre fiche pour obtenir votre premier avis' },
  'dash.viewPublic': { en: 'View public page \u2192', fr: 'Voir la page publique \u2192' },
  'dash.signOut': { en: 'Sign out', fr: 'Se d\u00e9connecter' },
  'dash.yourReply': { en: 'Your reply:', fr: 'Votre r\u00e9ponse :' },
  'dash.replyPlaceholder': { en: 'Write a reply to this review...', fr: '\u00c9crivez une r\u00e9ponse \u00e0 cet avis...' },
  'dash.postReply': { en: 'Post reply', fr: 'Publier la r\u00e9ponse' },
  'dash.posting': { en: 'Posting...', fr: 'Publication...' },

  // AI Insights
  'insights.title': { en: 'AI Insights', fr: 'Analyse IA' },
  'insights.desc': { en: 'Premium AI \u2014 deep trends and personalized action plans for your business', fr: 'IA Premium \u2014 tendances approfondies et plans d\u2019action personnalis\u00e9s' },
  'insights.generate': { en: 'Generate insights', fr: 'G\u00e9n\u00e9rer l\u2019analyse' },
  'insights.refresh': { en: 'Refresh', fr: 'Actualiser' },
  'insights.analyzing': { en: 'Analyzing', fr: 'Analyse de' },
  'insights.reviewsWord': { en: 'reviews...', fr: 'avis...' },
  'insights.strengths': { en: 'Strengths', fr: 'Points forts' },
  'insights.improvements': { en: 'Areas to improve', fr: 'Axes d\u2019am\u00e9lioration' },
  'insights.actions': { en: 'Action items', fr: '\u00c0 faire' },

  // Common
  'common.loading': { en: 'Loading...', fr: 'Chargement...' },
  'common.accessDenied': { en: 'Access denied', fr: 'Acc\u00e8s refus\u00e9' },
  'common.backHome': { en: 'Back to home', fr: 'Retour \u00e0 l\u2019accueil' },
  'common.anonymous': { en: 'Anonymous', fr: 'Anonyme' },
} as const

type TranslationKey = keyof typeof translations

const LangContext = createContext<{
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: TranslationKey) => string
}>({
  lang: 'en',
  setLang: () => {},
  t: (key) => translations[key]?.en || key
})

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang
    if (saved === 'fr') setLang('fr')
  }, [])

  const changeLang = (l: Lang) => {
    setLang(l)
    localStorage.setItem('lang', l)
  }

  const t = (key: TranslationKey) => {
    return translations[key]?.[lang] || translations[key]?.en || key
  }

  return (
    <LangContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}

export function LangToggle() {
  const { lang, setLang } = useLang()

  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
      className="text-sm font-medium px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 transition-colors"
      title={lang === 'en' ? 'Passer en fran\u00e7ais' : 'Switch to English'}
    >
      {lang === 'en' ? 'FR' : 'EN'}
    </button>
  )
}
