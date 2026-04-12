export const BUSINESS_CATEGORIES = [
  { value: 'all', label: { en: 'All', fr: 'Tout' } },
  { value: 'hotel', label: { en: 'Hotels', fr: 'Hôtels' } },
  { value: 'restaurant', label: { en: 'Restaurants', fr: 'Restaurants' } },
  { value: 'retail', label: { en: 'Retail & Shops', fr: 'Commerces' } },
  { value: 'spa', label: { en: 'Spas & Wellness', fr: 'Spas & Bien-être' } },
  { value: 'tour', label: { en: 'Tours & Activities', fr: 'Tours & Activités' } },
  { value: 'car_rental', label: { en: 'Car Rental', fr: 'Location de voitures' } },
  { value: 'services', label: { en: 'Other Services', fr: 'Autres services' } },
] as const

export type BusinessCategory = typeof BUSINESS_CATEGORIES[number]['value']

export const PLANS = {
  free: {
    name: { en: 'Free', fr: 'Gratuit' },
    price: { en: 'MUR 0', fr: '0 MUR' },
    period: { en: '/month', fr: '/mois' },
    description: {
      en: 'Get started with basic business visibility',
      fr: 'Commencez avec une visibilité de base',
    },
    features: {
      en: [
        'Create your account',
        'Claim your business listing',
        'View all reviews',
        'Basic business profile',
      ],
      fr: [
        'Créer votre compte',
        'Réclamer votre fiche',
        'Voir tous les avis',
        'Profil entreprise basique',
      ],
    },
    limitations: {
      en: [
        'Cannot reply to reviews',
        'No dashboard analytics',
        'No AI insights',
        'No reviewer contact details',
      ],
      fr: [
        'Pas de réponse aux avis',
        'Pas de tableau de bord analytique',
        'Pas d\'analyse IA',
        'Pas de détails des évaluateurs',
      ],
    },
  },
  premium: {
    name: { en: 'Premium', fr: 'Premium' },
    price: { en: 'MUR 2,990', fr: '2 990 MUR' },
    period: { en: '/month', fr: '/mois' },
    description: {
      en: 'Full control over your reputation and reviews',
      fr: 'Contrôle total de votre réputation et vos avis',
    },
    features: {
      en: [
        'Everything in Free',
        'Reply to all reviews',
        'Full analytics dashboard',
        'AI-powered insights & suggestions',
        'Reviewer contact details',
        'Service quality tracking',
        'Competitive benchmarking',
        'Priority support',
      ],
      fr: [
        'Tout du plan Gratuit',
        'Répondre à tous les avis',
        'Tableau de bord analytique complet',
        'Analyse et suggestions IA',
        'Détails des évaluateurs',
        'Suivi qualité de service',
        'Comparaison concurrentielle',
        'Support prioritaire',
      ],
    },
    limitations: { en: [], fr: [] },
  },
} as const

export const CONTACT_REASONS = [
  { value: 'onboard', label: { en: 'Onboard my business', fr: 'Inscrire mon entreprise' } },
  { value: 'premium', label: { en: 'Subscribe to Premium', fr: 'Souscrire au Premium' } },
  { value: 'report', label: { en: 'Report something', fr: 'Signaler quelque chose' } },
  { value: 'partnership', label: { en: 'Partnership enquiry', fr: 'Demande de partenariat' } },
  { value: 'support', label: { en: 'Technical support', fr: 'Support technique' } },
  { value: 'other', label: { en: 'Other enquiry', fr: 'Autre demande' } },
] as const
