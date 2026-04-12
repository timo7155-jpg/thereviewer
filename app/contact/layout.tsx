import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with TheReviewer.mu — business onboarding, partnerships, Premium subscriptions, or support. Based in Terre Rouge, Rodrigues, Mauritius.',
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
