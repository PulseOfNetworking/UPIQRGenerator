import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'

export default function QRCard({ payload, qrType, upiId, name, amount, isDark }) {
  const canvasRef = useRef(null)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState(null)

  useEffect(() => {
    if (!payload || !canvasRef.current) return
    const canvas = canvasRef.current
    QRCode.toCanvas(canvas, payload, {
      width: 280,
      margin: 2,
      color: {
        dark: isDark ? '#ffffff' : '#0d0f1a',
        light: isDark ? '#0d0f1a' : '#ffffff',
      },
      errorCorrectionLevel: 'M',
    }).then(() => {
      setQrDataUrl(canvas.toDataURL('image/png'))
    }).catch(console.error)
  }, [payload, isDark])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(payload)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const el = document.createElement('textarea')
      el.value = payload
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    if (!qrDataUrl) return
    setDownloading(true)
    const a = document.createElement('a')
    a.download = `upi-qr-${upiId?.replace('@', '_') || 'code'}-${Date.now()}.png`
    a.href = qrDataUrl
    a.click()
    setTimeout(() => setDownloading(false), 1000)
  }

  if (!payload) return null

  const typeColor = qrType === 'emvco' ? 'text-amber-400' : 'text-cyan-400'
  const typeBg = qrType === 'emvco'
    ? isDark ? 'bg-amber-400/10 border-amber-400/20' : 'bg-amber-50 border-amber-200'
    : isDark ? 'bg-cyan-400/10 border-cyan-400/20' : 'bg-cyan-50 border-cyan-200'

  return (
    <div className="space-y-4 animate-slide-up">
      {/* QR Canvas */}
      <div className={`flex flex-col items-center gap-0 rounded-2xl overflow-hidden ${isDark ? 'bg-ink-900/60 border border-white/[0.07]' : 'bg-white border border-slate-200'}`}>
        {/* Header strip */}
        <div className={`w-full flex items-center justify-between px-5 py-3 ${isDark ? 'border-b border-white/[0.05]' : 'border-b border-slate-100'}`}>
          <div className="flex items-center gap-2">
            <span className={`badge border ${typeBg} ${typeColor} font-mono text-xs`}>
              {qrType === 'emvco' ? '⬡ EMVCo' : '◈ Simple UPI'}
            </span>
            {amount && Number(amount) > 0 && (
              <span className={`badge border ${isDark ? 'bg-white/5 border-white/10 text-white/50' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                ₹ {Number(amount).toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <div className={`text-xs font-mono ${isDark ? 'text-white/25' : 'text-slate-400'}`}>
            INR · India
          </div>
        </div>

        {/* QR Code */}
        <div className="relative p-6">
          <canvas
            ref={canvasRef}
            className="rounded-xl block"
            style={{ imageRendering: 'pixelated' }}
          />
          {/* Corner marks */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-cyan-400/40 rounded-tl-lg pointer-events-none" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-cyan-400/40 rounded-tr-lg pointer-events-none" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-cyan-400/40 rounded-bl-lg pointer-events-none" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-cyan-400/40 rounded-br-lg pointer-events-none" />
        </div>

        {/* Payee info */}
        <div className={`w-full px-5 py-3 ${isDark ? 'border-t border-white/[0.05] bg-ink-950/30' : 'border-t border-slate-100 bg-slate-50/60'}`}>
          <div className="flex items-center justify-between">
            <div>
              {name && (
                <p className={`text-sm font-display font-600 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>{name}</p>
              )}
              <p className={`text-xs font-mono mt-0.5 ${isDark ? 'text-cyan-400/70' : 'text-cyan-600'}`}>{upiId}</p>
            </div>
            <svg className={`w-8 h-8 opacity-20 ${isDark ? 'text-white' : 'text-slate-700'}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleDownload}
          disabled={!qrDataUrl || downloading}
          className={isDark ? 'btn-ghost' : 'btn-ghost-light'}
        >
          <div className="flex items-center justify-center gap-2">
            {downloading ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" strokeOpacity=".25"/>
                <path d="M12 2a10 10 0 0110 10" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v7.44l2.47-2.47a.75.75 0 111.06 1.06l-3.75 3.75a.75.75 0 01-1.06 0L5.72 9.78a.75.75 0 011.06-1.06l2.47 2.47V3.75A.75.75 0 0110 3zM3.75 15a.75.75 0 000 1.5h12.5a.75.75 0 000-1.5H3.75z" clipRule="evenodd" />
              </svg>
            )}
            <span className="text-sm">Download</span>
          </div>
        </button>

        <button
          onClick={handleCopy}
          className={isDark ? 'btn-ghost' : 'btn-ghost-light'}
        >
          <div className="flex items-center justify-center gap-2">
            {copied ? (
              <>
                <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-cyan-400">Copied!</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                  <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
                </svg>
                <span className="text-sm">Copy Payload</span>
              </>
            )}
          </div>
        </button>
      </div>

      {/* Raw Payload */}
      <div className={`rounded-xl overflow-hidden ${isDark ? 'border border-white/[0.06]' : 'border border-slate-200'}`}>
        <div className={`flex items-center justify-between px-4 py-2 ${isDark ? 'bg-ink-900/80 border-b border-white/[0.06]' : 'bg-slate-100 border-b border-slate-200'}`}>
          <span className={`text-xs font-display font-600 uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
            Raw Payload
          </span>
          <span className={`text-xs font-mono ${isDark ? 'text-white/20' : 'text-slate-400'}`}>
            {payload.length} chars
          </span>
        </div>
        <pre className={`px-4 py-3 text-xs font-mono break-all whitespace-pre-wrap leading-relaxed select-all
          ${isDark ? 'text-cyan-300/70 bg-ink-950/50' : 'text-cyan-700 bg-cyan-50/40'}`}>
          {payload}
        </pre>
      </div>
    </div>
  )
}
