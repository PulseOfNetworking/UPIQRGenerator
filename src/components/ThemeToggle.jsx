export default function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      className={`
        relative w-11 h-6 rounded-full transition-all duration-300 
        ${isDark ? 'bg-cyan-400/20 border border-cyan-400/30' : 'bg-slate-200 border border-slate-300'}
      `}
    >
      <span
        className={`
          absolute top-0.5 left-0.5 w-5 h-5 rounded-full shadow-md flex items-center justify-center
          transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${isDark ? 'translate-x-5 bg-cyan-400' : 'translate-x-0 bg-white'}
        `}
      >
        {isDark ? (
          <svg className="w-3 h-3 text-ink-950" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 1.5a.5.5 0 01.5.5v.5a.5.5 0 01-1 0V2a.5.5 0 01.5-.5zM3.05 3.05a.5.5 0 01.707 0l.354.354a.5.5 0 11-.707.707l-.354-.354a.5.5 0 010-.707zM1.5 6a.5.5 0 01.5-.5h.5a.5.5 0 010 1H2a.5.5 0 01-.5-.5zM6 8a2 2 0 100-4 2 2 0 000 4zM8.95 3.05a.5.5 0 010 .707l-.354.354a.5.5 0 11-.707-.707l.354-.354a.5.5 0 01.707 0zM10.5 6a.5.5 0 01-.5.5h-.5a.5.5 0 010-1H10a.5.5 0 01.5.5zM3.757 8.243a.5.5 0 01.707.707l-.354.354a.5.5 0 01-.707-.707l.354-.354zM6 9a.5.5 0 01.5.5V10a.5.5 0 01-1 0v-.5A.5.5 0 016 9zM8.596 8.596a.5.5 0 010 .707l-.354.354a.5.5 0 11-.707-.707l.354-.354a.5.5 0 01.707 0z"/>
          </svg>
        ) : (
          <svg className="w-3 h-3 text-slate-500" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6.76 1.32a5.5 5.5 0 104.92 4.92A4 4 0 016.76 1.32z"/>
          </svg>
        )}
      </span>
    </button>
  )
}
