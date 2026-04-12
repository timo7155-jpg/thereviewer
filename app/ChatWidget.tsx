'use client'

import { useState, useRef, useEffect } from 'react'
import { useLang } from '@/lib/i18n'

type Message = {
  role: 'user' | 'assistant'
  text: string
}

export default function ChatWidget() {
  const { lang } = useLang()
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const msg = input.trim()
    if (!msg || loading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', text: data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: lang === 'fr' ? 'Désolé, une erreur est survenue.' : 'Sorry, something went wrong.' }])
    }
    setLoading(false)
  }

  // Convert markdown links [text](url) to safe HTML
  const renderText = (text: string) => {
    // Escape HTML first to prevent XSS
    const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    // Then convert markdown links (only allow internal /hotels/ paths)
    return escaped.replace(/\[([^\]]+)\]\((\/hotels\/[a-z0-9-]+)\)/g, '<a href="$2" class="text-blue-600 font-semibold hover:underline">$1</a>')
  }

  return (
    <>
      {/* Chat bubble */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          open ? 'bg-gray-700 hover:bg-gray-800 rotate-0' : 'bg-blue-600 hover:bg-blue-700 hover:scale-110'
        }`}
      >
        {open ? (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        ) : (
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-fade-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">
                  {lang === 'fr' ? 'Assistant TheReviewer' : 'TheReviewer Assistant'}
                </h3>
                <p className="text-blue-200 text-xs">
                  {lang === 'fr' ? 'Je vous aide à trouver le bon endroit' : 'I help you find the right place'}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[320px] overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400 text-sm mb-4">
                  {lang === 'fr' ? 'Comment puis-je vous aider ?' : 'How can I help you?'}
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    lang === 'fr' ? 'Meilleur hôtel dans le nord ?' : 'Best hotel in the north?',
                    lang === 'fr' ? 'Restaurant romantique à Grand Baie' : 'Romantic restaurant in Grand Baie',
                    lang === 'fr' ? 'Location de voiture pas cher' : 'Affordable car rental',
                  ].map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => { setInput(suggestion); }}
                      className="text-xs bg-white border border-gray-200 rounded-lg px-3 py-2 text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-colors text-left"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-white border border-gray-200 text-gray-700 rounded-bl-md shadow-sm'
                }`}>
                  {msg.role === 'assistant' ? (
                    <span dangerouslySetInnerHTML={{ __html: renderText(msg.text) }} />
                  ) : msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t border-gray-100 bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSend() }}
                placeholder={lang === 'fr' ? 'Que cherchez-vous ?' : 'What are you looking for?'}
                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 transition-all"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="bg-blue-600 text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-40 transition-colors shrink-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
