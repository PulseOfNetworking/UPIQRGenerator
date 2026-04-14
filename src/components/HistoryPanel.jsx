import { formatTime } from '../utils/storage'

export default function HistoryPanel({ history, onSelect, onClear, isDark }) {
  if (!history || history.length === 0) return null

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className={`w-4 h-4 ${isDark ? 'text-white/30' : 'text-slate-400'}`} viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
          </svg>
          <span className={`text-xs font-display font-600 uppercase tracking-widest ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
            Recent ({history.length})
          </span>
        </div>
        <button
          onClick={onClear}
          className={`text-xs font-body transition-colors ${isDark ? 'text-white/20 hover:text-coral-400' : 'text-slate-400 hover:text-red-400'}`}
        >
          Clear all
        </button>
      </div>

      <div className="space-y-2">
        {history.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`
              w-full text-left rounded-xl px-4 py-3 
              border transition-all duration-200 group
              ${isDark
                ? 'bg-ink-900/40 border-white/[0.05] hover:border-cyan-400/30 hover:bg-ink-800/60'
                : 'bg-white border-slate-200 hover:border-cyan-400/50 hover:bg-cyan-50/30'}
            `}
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`
                  flex-shrink-0 w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-bold
                  ${item.qrType === 'emvco'
                    ? isDark ? 'bg-amber-400/15 text-amber-400' : 'bg-amber-100 text-amber-600'
                    : isDark ? 'bg-cyan-400/15 text-cyan-400' : 'bg-cyan-100 text-cyan-600'}
                `}>
                  {item.qrType === 'emvco' ? 'E' : 'U'}
                </span>
                <div className="min-w-0">
                  <p className={`text-sm font-display font-600 truncate ${isDark ? 'text-white/80 group-hover:text-white' : 'text-slate-700 group-hover:text-slate-900'}`}>
                    {item.upiId}
                  </p>
                  {item.name && (
                    <p className={`text-xs truncate mt-0.5 ${isDark ? 'text-white/30' : 'text-slate-400'}`}>
                      {item.name}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex-shrink-0 flex flex-col items-end gap-1 ml-3">
                {item.amount && Number(item.amount) > 0 && (
                  <span className={`text-xs font-mono ${isDark ? 'text-white/40' : 'text-slate-500'}`}>
                    ₹{Number(item.amount).toLocaleString('en-IN')}
                  </span>
                )}
                <span className={`text-[10px] font-mono ${isDark ? 'text-white/20' : 'text-slate-400'}`}>
                  {formatTime(item.createdAt)}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
