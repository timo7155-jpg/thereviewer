'use client'

import { useState } from 'react'
import AdminShell from '../AdminShell'

const signatureHtml = `<table cellpadding="0" cellspacing="0" border="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #333; font-size: 14px; line-height: 1.5;">
  <tr>
    <td style="padding-right: 20px; vertical-align: top;">
      <img src="https://thereviewer.mu/founder.jpg" alt="Timothee Lisette" width="85" height="85" style="border-radius: 50%; border: 3px solid #2563eb; display: block;">
    </td>
    <td style="vertical-align: top; border-left: 3px solid #2563eb; padding-left: 20px;">
      <div style="font-size: 16px; font-weight: bold; color: #0f172a; margin-bottom: 2px;">Timothée Lisette</div>
      <div style="font-size: 13px; color: #2563eb; font-weight: 600; margin-bottom: 10px;">Founder &amp; CEO</div>
      <div style="margin-bottom: 10px;">
        <table cellpadding="0" cellspacing="0" border="0" style="font-size: 13px;">
          <tr>
            <td style="padding: 2px 8px 2px 0; color: #64748b;">📞</td>
            <td style="padding: 2px 0; color: #334155;"><a href="https://wa.me/23058137384" style="color: #334155; text-decoration: none;">+230 5813 7384</a> (Phone / WhatsApp)</td>
          </tr>
          <tr>
            <td style="padding: 2px 8px 2px 0; color: #64748b;">✉️</td>
            <td style="padding: 2px 0;"><a href="mailto:contact@thereviewer.mu" style="color: #2563eb; text-decoration: none;">contact@thereviewer.mu</a></td>
          </tr>
          <tr>
            <td style="padding: 2px 8px 2px 0; color: #64748b;">🌐</td>
            <td style="padding: 2px 0;"><a href="https://thereviewer.mu" style="color: #2563eb; text-decoration: none; font-weight: 600;">thereviewer.mu</a></td>
          </tr>
        </table>
      </div>
      <div style="background: linear-gradient(90deg, #2563eb, #7c3aed); display: inline-block; padding: 1px; border-radius: 4px;">
        <div style="background: white; padding: 4px 10px; border-radius: 3px; font-size: 11px; color: #475569; font-style: italic;">Discover, rate, and book the best businesses in Mauritius</div>
      </div>
      <div style="margin-top: 10px; font-size: 11px; color: #94a3b8;">Terre Rouge, Rodrigues, Mauritius</div>
    </td>
  </tr>
</table>`

export default function SignaturePage() {
  const [copied, setCopied] = useState(false)

  const copyHtml = async () => {
    try {
      // Create a blob with HTML content for rich clipboard
      const blob = new Blob([signatureHtml], { type: 'text/html' })
      const blobText = new Blob([signatureHtml], { type: 'text/plain' })
      const item = new ClipboardItem({ 'text/html': blob, 'text/plain': blobText })
      await navigator.clipboard.write([item])
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      // Fallback: copy as plain text
      await navigator.clipboard.writeText(signatureHtml)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  const copyPreviewRender = async () => {
    try {
      const preview = document.getElementById('signature-preview')
      if (!preview) return
      const html = preview.innerHTML
      const blob = new Blob([html], { type: 'text/html' })
      const blobText = new Blob([preview.innerText], { type: 'text/plain' })
      const item = new ClipboardItem({ 'text/html': blob, 'text/plain': blobText })
      await navigator.clipboard.write([item])
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch {
      const range = document.createRange()
      const preview = document.getElementById('signature-preview')
      if (preview) {
        range.selectNode(preview)
        const sel = window.getSelection()
        sel?.removeAllRanges()
        sel?.addRange(range)
        document.execCommand('copy')
        sel?.removeAllRanges()
        setCopied(true)
        setTimeout(() => setCopied(false), 3000)
      }
    }
  }

  return (
    <AdminShell backHref="/admin" backLabel="← Admin Panel">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Email Signature</h1>
        <p className="text-gray-500 text-sm mb-8">Copy this signature and paste into Gmail settings</p>

        {/* Preview */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Preview</p>
          <div id="signature-preview" dangerouslySetInnerHTML={{ __html: signatureHtml }} />
        </div>

        {/* Copy buttons */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={copyPreviewRender}
            className={`px-6 py-3 rounded-xl font-semibold transition-colors ${
              copied ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {copied ? '✓ Copied!' : '📋 Copy signature (recommended)'}
          </button>
          <button
            onClick={copyHtml}
            className="px-6 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Copy as HTML
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-blue-900 mb-4">How to install in Gmail</h3>
          <ol className="space-y-3 text-sm text-blue-800 list-decimal pl-5">
            <li>Click <strong>&quot;📋 Copy signature&quot;</strong> above</li>
            <li>Open Gmail → click ⚙️ gear icon (top right) → <strong>See all settings</strong></li>
            <li>Scroll down to <strong>Signature</strong> section</li>
            <li>Click <strong>+ Create new</strong> → name it &quot;TheReviewer&quot;</li>
            <li>Click in the signature text box and paste (Ctrl+V or Cmd+V)</li>
            <li>Set <strong>Signature defaults</strong>:
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li>For New Emails Use: <strong>TheReviewer</strong></li>
                <li>On Reply/Forward Use: <strong>TheReviewer</strong></li>
              </ul>
            </li>
            <li>Check <strong>&quot;Insert signature before quoted text in replies&quot;</strong></li>
            <li>Scroll to bottom → <strong>Save Changes</strong></li>
          </ol>
          <p className="text-xs text-blue-600 mt-4 italic">Tip: If the photo doesn&apos;t show up, Gmail sometimes blocks external images by default. In the signature editor, click the image placeholder and re-upload the photo from: <a href="https://thereviewer.mu/founder.jpg" className="underline" target="_blank" rel="noreferrer">thereviewer.mu/founder.jpg</a></p>
        </div>
      </div>
    </AdminShell>
  )
}
