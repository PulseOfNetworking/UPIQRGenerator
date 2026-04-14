import { useState } from 'react'
import { isValidUPI, isValidAmount } from '../utils/emvco'

const QR_TYPES = [
  {
    id: 'simple',
    label: 'Simple UPI',
    desc: 'Standard deep-link',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M3.5 2A1.5 1.5 0 002 3.5v13A1.5 1.5 0 003.5 18h13a1.5 1.5 0 001.5-1.5V8.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0012.378 3H3.5zm4 9.5a.75.75 0 01.75-.75h3.5a.75.75 0 010 1.5h-3.5a.75.75 0 01-.75-.75zm.75-3.25a.75.75 0 000 1.5H10a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: 'emvco',
    label: 'EMVCo QR',
    desc: 'CRC-verified standard',
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
        <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
      </svg>
    ),
  },
]

export default function InputForm({ onGenerate, isDark }) {
  const [form, setForm] = useState({
    upiId: '',
    name: '',
    amount: '',
    note: '',
    city: 'Kolkata',
  })
  const [qrType, setQrType] = useState('simple')
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const validate = (data = form) => {
    const errs = {}
    if (!data.upiId.trim()) errs.upiId = 'UPI ID is required'
    else if (!isValidUPI(data.upiId)) errs.upiId = 'Invalid UPI ID format (e.g. name@upi)'
    if (data.amount && !isValidAmount(data.amount)) errs.amount = 'Enter a valid amount (0 – 1 Cr)'
    return errs
  }

  const handleChange = (field, value) => {
    const next = { ...form, [field]: value }
    setForm(next)
    if (touched[field]) {
      setErrors(validate(next))
    }
  }

  const handleBlur = (field) => {
    setTouched(t => ({ ...t, [field]: true }))
    setErrors(validate())
  }

  const handleSubmit = () => {
    const allTouched = { upiId: true, amount: true }
    setTouched(allTouched)
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    onGenerate({ ...form, qrType })
  }

  const inputClass = (field) =>
    isDark
      ? `input-field ${errors[field] && touched[field] ? 'border-coral-400/60 focus:border-coral-400' : ''}`
      : `input-field-light ${errors[field] && touched[field] ? 'border-red-400 focus:ring-red-200' : ''}`

  const labelClass = isDark ? 'label' : 'label-light'

  return (
    <div className="space-y-6">
      {/* QR Type Toggle */}
      <div>
        <span className={labelClass}>QR Standard</span>
        <div className={`grid grid-cols-2 gap-2 p-1 rounded-xl ${isDark ? 'bg-ink-900/80 border border-white/[0.07]' : 'bg-slate-100 border border-slate-200'}`}>
          {QR_TYPES.map(t => (
            <button
              key={t.id}
              onClick={() => setQrType(t.id)}
              className={`
                flex items-center gap-2.5 rounded-lg px-4 py-2.5 text-sm font-display font-600
                transition-all duration-200
                ${qrType === t.id
                  ? isDark
                    ? 'bg-cyan-400 text-ink-950 shadow-glow'
                    : 'bg-cyan-400 text-white shadow-md'
                  : isDark
                    ? 'text-white/50 hover:text-white/80'
                    : 'text-slate-500 hover:text-slate-800'}
              `}
            >
              {t.icon}
              <span className="leading-none">{t.label}</span>
            </button>
          ))}
        </div>
        <p className={`mt-1.5 text-xs ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
          {qrType === 'emvco' ? '✦ Includes TLV encoding + CRC16-CCITT checksum' : '✦ Standard upi://pay deep-link format'}
        </p>
      </div>

      {/* UPI ID */}
      <div>
        <label className={labelClass}>
          UPI ID <span className={isDark ? 'text-coral-400 normal-case' : 'text-red-400 normal-case'}>*</span>
        </label>
        <input
          className={inputClass('upiId')}
          placeholder="yourname@upi"
          value={form.upiId}
          onChange={e => handleChange('upiId', e.target.value)}
          onBlur={() => handleBlur('upiId')}
          autoComplete="off"
          spellCheck={false}
        />
        {errors.upiId && touched.upiId && (
          <p className="mt-1.5 text-xs text-coral-400 flex items-center gap-1">
            <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 12 12" fill="currentColor"><path d="M6 1a5 5 0 100 10A5 5 0 006 1zm-.75 2.5a.75.75 0 011.5 0v3a.75.75 0 01-1.5 0v-3zM6 9a.75.75 0 110-1.5A.75.75 0 016 9z"/></svg>
            {errors.upiId}
          </p>
        )}
      </div>

      {/* Payee Name */}
      <div>
        <label className={labelClass}>Payee Name</label>
        <input
          className={isDark ? 'input-field' : 'input-field-light'}
          placeholder="Rahul Kumar"
          value={form.name}
          onChange={e => handleChange('name', e.target.value)}
          maxLength={25}
        />
        <p className={`mt-1 text-xs text-right ${isDark ? 'text-white/20' : 'text-slate-400'}`}>
          {form.name.length}/25
        </p>
      </div>

      {/* Amount */}
      <div>
        <label className={labelClass}>Amount (INR) <span className={isDark ? 'text-white/30 normal-case' : 'text-slate-400 normal-case'}>— optional</span></label>
        <div className="relative">
          <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-sm font-mono ${isDark ? 'text-white/30' : 'text-slate-400'}`}>₹</span>
          <input
            className={`${inputClass('amount')} pl-8`}
            placeholder="0.00"
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={e => handleChange('amount', e.target.value)}
            onBlur={() => handleBlur('amount')}
          />
        </div>
        {errors.amount && touched.amount && (
          <p className="mt-1.5 text-xs text-coral-400">{errors.amount}</p>
        )}
      </div>

      {/* Note */}
      <div>
        <label className={labelClass}>Transaction Note <span className={isDark ? 'text-white/30 normal-case' : 'text-slate-400 normal-case'}>— optional</span></label>
        <input
          className={isDark ? 'input-field' : 'input-field-light'}
          placeholder="Payment for invoice #123"
          value={form.note}
          onChange={e => handleChange('note', e.target.value)}
          maxLength={60}
        />
      </div>

      {/* City (EMVCo only) */}
      {qrType === 'emvco' && (
        <div className="animate-slide-up">
          <label className={labelClass}>Merchant City</label>
          <input
            className={isDark ? 'input-field' : 'input-field-light'}
            placeholder="Kolkata"
            value={form.city}
            onChange={e => handleChange('city', e.target.value)}
            maxLength={15}
          />
        </div>
      )}

      {/* Generate Button */}
      <button
        className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
        onClick={handleSubmit}
      >
        <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3.5 2A1.5 1.5 0 002 3.5v5A1.5 1.5 0 003.5 10h5A1.5 1.5 0 0010 8.5v-5A1.5 1.5 0 008.5 2h-5zm9 0A1.5 1.5 0 0011 3.5v5A1.5 1.5 0 0012.5 10h5A1.5 1.5 0 0019 8.5v-5A1.5 1.5 0 0017.5 2h-5zm-9 9A1.5 1.5 0 002 12.5v5A1.5 1.5 0 003.5 19h5a1.5 1.5 0 001.5-1.5v-5A1.5 1.5 0 008.5 11h-5zm9 0A1.5 1.5 0 0011 12.5v5A1.5 1.5 0 0012.5 19h5a1.5 1.5 0 001.5-1.5v-5a1.5 1.5 0 00-1.5-1.5h-5z" clipRule="evenodd" />
        </svg>
        Generate QR Code
      </button>
    </div>
  )
}
