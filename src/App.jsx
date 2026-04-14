import { useState, useEffect } from 'react'
import InputForm from './components/InputForm'
import QRCard from './components/QRCard'
import HistoryPanel from './components/HistoryPanel'
import ThemeToggle from './components/ThemeToggle'
import { buildSimpleUPI, buildEMVCoUPI } from './utils/emvco'
import { loadHistory, saveToHistory, clearHistory, genId } from './utils/storage'

export default function App() {
  const [isDark, setIsDark] = useState(true)
  const [qrData, setQrData] = useState(null)
  const [history, setHistory] = useState([])

  // Load history on mount
  useEffect(() => {
    setHistory(loadHistory())
  }, [])

  // Sync dark mode to <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
  }, [isDark])

  const handleGenerate = ({ upiId, name, amount, note, city, qrType }) => {
    let payload = ''
    if (qrType === 'emvco') {
      payload = buildEMVCoUPI({ upiId, name, amount, city })
    } else {
      payload = buildSimpleUPI({ upiId, name, amount, note })
    }

    const entry = {
      id: genId(),
      qrType,
      payload,
      upiId,
      name,
      amount,
      note,
      city,
      createdAt: new Date().toISOString(),
    }

    setQrData(entry)
    const updated = saveToHistory(entry)
    setHistory(updated)
  }

  const handleSelectHistory = (item) => {
    setQrData(item)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleClearHistory = () => {
    clearHistory()
    setHistory([])
  }

  return (
    <div className={`min-h-dvh transition-colors duration-300 ${isDark ? '' : 'bg-slate-50'}`}>
      {/* Ambient glow blobs */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className={`absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl
          ${isDark ? 'bg-cyan-400/6' : 'bg-cyan-400/8'}`} />
        <div className={`absolute top-1/2 -left-48 w-80 h-80 rounded-full blur-3xl
          ${isDark ? 'bg-indigo-500/5' : 'bg-indigo-400/6'}`} />
      </div>

      {/* Header */}
      <header className={`relative z-10 border-b backdrop-blur-sm sticky top-0
        ${isDark ? 'border-white/[0.07] bg-ink-950/80' : 'border-slate-200/80 bg-white/80'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center
              ${isDark ? 'bg-cyan-400/15 border border-cyan-400/25' : 'bg-cyan-50 border border-cyan-200'}`}>
              <svg className="w-4 h-4 text-cyan-400" viewBox="0 0 16 16" fill="currentColor">
                <rect x="1" y="1" width="5" height="5" rx="1"/>
                <rect x="10" y="1" width="5" height="5" rx="1"/>
                <rect x="1" y="10" width="5" height="5" rx="1"/>
                <rect x="10" y="10" width="2" height="2" rx="0.5"/>
                <rect x="13" y="10" width="2" height="2" rx="0.5"/>
                <rect x="10" y="13" width="2" height="2" rx="0.5"/>
                <rect x="13" y="13" width="2" height="2" rx="0.5"/>
              </svg>
            </div>
            <div>
              <span className={`font-display font-800 text-sm tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                UPI QR
              </span>
              <span className="font-display font-400 text-sm text-cyan-400 ml-1">Generator</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`hidden sm:block text-xs font-mono ${isDark ? 'text-white/20' : 'text-slate-400'}`}>
              Free · Open · No backend
            </span>
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(d => !d)} />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10 pb-24">
        {/* Hero */}
        <div className="mb-10 animate-fade-in">
          <div className={`inline-flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-full mb-4
            ${isDark ? 'bg-cyan-400/10 border border-cyan-400/20 text-cyan-400' : 'bg-cyan-50 border border-cyan-200 text-cyan-600'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            UPI + EMVCo · CRC16-CCITT Verified · Client-side only
          </div>
          <h1 className={`font-display font-800 text-3xl sm:text-4xl leading-tight mb-3
            ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Generate UPI QR codes<br />
            <span className="text-gradient">instantly, privately.</span>
          </h1>
          <p className={`text-sm max-w-lg ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
            Simple deep-link QRs or EMVCo-compliant codes with TLV encoding and CRC checksum.
            Everything runs in your browser — nothing leaves your device.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">

          {/* Left: Form */}
          <div className={`rounded-2xl p-6 sm:p-8 animate-slide-up
            ${isDark ? 'glass-card' : 'glass-card-light'}`}>
            <div className={`flex items-center gap-2 mb-6 pb-5 border-b ${isDark ? 'border-white/[0.07]' : 'border-slate-100'}`}>
              <svg className={`w-5 h-5 ${isDark ? 'text-white/40' : 'text-slate-400'}`} viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 10-2 0v1H8a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
              </svg>
              <h2 className={`font-display font-700 text-base ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                Payment Details
              </h2>
            </div>
            <InputForm onGenerate={handleGenerate} isDark={isDark} />

            {/* History */}
            <HistoryPanel
              history={history}
              onSelect={handleSelectHistory}
              onClear={handleClearHistory}
              isDark={isDark}
            />
          </div>

          {/* Right: QR Preview */}
          <div className="animate-slide-up animate-delay-100">
            {qrData ? (
              <div className={`rounded-2xl p-5 ${isDark ? 'glass-card' : 'glass-card-light'}`}>
                <div className={`flex items-center gap-2 mb-5 pb-4 border-b ${isDark ? 'border-white/[0.07]' : 'border-slate-100'}`}>
                  <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.5 2A1.5 1.5 0 002 3.5v5A1.5 1.5 0 003.5 10h5A1.5 1.5 0 0010 8.5v-5A1.5 1.5 0 008.5 2h-5zm9 0A1.5 1.5 0 0011 3.5v5A1.5 1.5 0 0012.5 10h5A1.5 1.5 0 0019 8.5v-5A1.5 1.5 0 0017.5 2h-5zm-9 9A1.5 1.5 0 002 12.5v5A1.5 1.5 0 003.5 19h5a1.5 1.5 0 001.5-1.5v-5A1.5 1.5 0 008.5 11h-5zm9 0A1.5 1.5 0 0011 12.5v5A1.5 1.5 0 0012.5 19h5a1.5 1.5 0 001.5-1.5v-5a1.5 1.5 0 00-1.5-1.5h-5z" clipRule="evenodd" />
                  </svg>
                  <h2 className={`font-display font-700 text-base ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                    QR Preview
                  </h2>
                </div>
                <QRCard
                  key={qrData.id}
                  payload={qrData.payload}
                  qrType={qrData.qrType}
                  upiId={qrData.upiId}
                  name={qrData.name}
                  amount={qrData.amount}
                  isDark={isDark}
                />
              </div>
            ) : (
              <EmptyState isDark={isDark} />
            )}
          </div>
        </div>

        {/* Footer info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          {[
            {
              icon: '◈',
              title: 'Simple UPI',
              desc: 'Standard upi://pay deep-link. Works with all UPI apps — GPay, PhonePe, Paytm and more.',
              accent: 'text-cyan-400',
            },
            {
              icon: '⬡',
              title: 'EMVCo Standard',
              desc: 'TLV-encoded with CRC16-CCITT checksum. Bank-grade compliance, verified payload.',
              accent: 'text-amber-400',
            },
            {
              icon: '⟡',
              title: '100% Private',
              desc: 'All processing is in-browser. No data sent to any server. History stays in your device.',
              accent: 'text-indigo-400',
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`rounded-xl p-5 border ${isDark
                ? 'bg-ink-800/40 border-white/[0.05]'
                : 'bg-white border-slate-200'}`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`text-xl mb-2 ${card.accent}`}>{card.icon}</div>
              <h3 className={`font-display font-700 text-sm mb-1.5 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                {card.title}
              </h3>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-white/35' : 'text-slate-500'}`}>
                {card.desc}
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className={`relative z-10 border-t py-6 px-4 text-center ${isDark ? 'border-white/[0.07]' : 'border-slate-200'}`}>
        <p className={`text-xs font-mono ${isDark ? 'text-white/15' : 'text-slate-400'}`}>
          UPI QR Generator · Open source · No tracking · Made with ♥ in India
        </p>
      </footer>
    </div>
  )
}

function EmptyState({ isDark }) {
  return (
    <div className={`rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-12 text-center min-h-[320px]
      ${isDark ? 'border-white/[0.08]' : 'border-slate-200'}`}>
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5
        ${isDark ? 'bg-white/[0.04] border border-white/[0.06]' : 'bg-slate-100 border border-slate-200'}`}>
        <svg className={`w-8 h-8 ${isDark ? 'text-white/20' : 'text-slate-300'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
        </svg>
      </div>
      <p className={`font-display font-700 text-sm mb-1 ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
        QR will appear here
      </p>
      <p className={`text-xs ${isDark ? 'text-white/20' : 'text-slate-400'}`}>
        Fill in your UPI ID and hit Generate
      </p>
    </div>
  )
}
