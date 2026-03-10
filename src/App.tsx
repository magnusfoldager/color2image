import { useState, useCallback, useRef, useEffect } from 'react'

// Curated Tailwind palette — vibrant for light mode, deep for dark mode
const COLORS_LIGHT = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#6366f1',
]
const COLORS_DARK = [
  '#991b1b', '#9a3412', '#854d0e', '#166534', '#115e59',
  '#1e40af', '#5b21b6', '#9d174d', '#155e75', '#3730a3',
]

function parseColorInput(input: string): string | null {
  const s = input.trim()
  if (/^#[0-9a-f]{6}$/i.test(s)) return s.toLowerCase()
  if (/^[0-9a-f]{6}$/i.test(s)) return '#' + s.toLowerCase()
  if (/^#[0-9a-f]{3}$/i.test(s)) return '#' + s[1] + s[1] + s[2] + s[2] + s[3] + s[3]
  const rgb = /^rgb\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i.exec(s)
  if (rgb) {
    return '#' + [rgb[1], rgb[2], rgb[3]]
      .map(n => Math.min(255, parseInt(n)).toString(16).padStart(2, '0'))
      .join('')
  }
  return null
}

type Format = 'png' | 'jpeg' | 'webp'
type SizeUnit = 'KB' | 'MB'

function PrivacyModal({ onClose, isDark }: { onClose: () => void; isDark: boolean }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const prose = isDark ? 'text-zinc-300' : 'text-zinc-700'
  const heading = isDark ? 'text-zinc-100' : 'text-zinc-900'
  const muted = isDark ? 'text-zinc-500' : 'text-zinc-400'
  const hr = isDark ? 'border-zinc-800' : 'border-zinc-100'

  const sections: [string, string[]][] = [
    ['1. Overview', [
      'We have designed this website to be as privacy-respecting as possible.',
      'We do not use tracking cookies.',
      'We do not collect Personal Identifiable Information (PII) like names or emails unless you voluntarily provide them (e.g., via a contact form).',
      'We do not sell your data to third parties.',
    ]],
    ['2. Analytics (Umami)', [
      'We use Umami Analytics to understand how visitors use our site. Unlike traditional analytics tools, Umami is a "privacy-first" platform.',
      'No Cookies: Umami does not use cookies or any local storage to track you.',
      'Anonymization: All data is anonymized. Your IP address is never stored; it is temporarily hashed to distinguish unique visits without identifying you.',
      'Data Collected: We only see aggregate data such as which pages were visited, what type of device was used (mobile/desktop), and the general country of origin.',
    ]],
    ['3. Hosting (GitHub Pages)', [
      'This website is hosted using GitHub Pages.',
      'When you visit this site, GitHub may collect "Log Data," which includes your IP address, browser type, and the time of your visit.',
      'This data is processed by GitHub for security and operational purposes (e.g., preventing DDoS attacks). We do not have access to these logs.',
    ]],
    ['4. Fonts (Google Fonts)', [
      'We use Google Fonts to ensure our website looks consistent and professional.',
      'These fonts are loaded from Google\'s servers. When you load a page, your browser sends a request to Google, which includes your IP address. Google uses this to serve the font files and for their own internal analytics.',
    ]],
    ['5. Your Rights (GDPR/CCPA)', [
      'Depending on where you live, you have rights regarding your data, including the right to access, correct, or delete it. Since we do not store personal data or use tracking cookies, there is typically no "profile" for us to provide or delete. However, if you have contacted us directly, you may request the deletion of that correspondence at any time.',
    ]],
    ['6. External Links', [
      'Our site may contain links to other websites. We are not responsible for the privacy practices or content of those third-party sites.',
    ]],
    ['7. Contact Us', [
      'If you have any questions about this policy, please reach out via the GitHub repository linked at the top of the page or by reaching out to us at magnus+color2image@foldager.me.',
    ]],
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className={`w-full max-w-2xl max-h-[85vh] rounded-2xl shadow-2xl flex flex-col ${isDark ? 'bg-zinc-900' : 'bg-white'}`}>
        <div className={`flex items-center justify-between px-7 pt-6 pb-5 border-b ${hr} flex-shrink-0`}>
          <h2 className={`text-base font-semibold font-heading ${heading}`}>Privacy Policy</h2>
          <button
            onClick={onClose}
            className={`rounded-lg p-1.5 transition-colors cursor-pointer ${isDark ? 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800' : 'text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100'}`}
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto px-7 py-6 space-y-6 text-sm leading-relaxed">
          <p className={muted}>Last Updated: March 10, 2026</p>
          <p className={prose}>
            At color2image, we believe that your privacy is a right, not a feature. This policy explains what limited information we collect and how we handle it.
          </p>
          {sections.map(([title, points]) => (
            <div key={title}>
              <h3 className={`font-semibold font-heading mb-2 ${heading}`}>{title}</h3>
              <ul className="space-y-1.5 list-disc list-inside">
                {points.map((p, i) => <li key={i} className={prose}>{p}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const initialColor = (() => {
  const colors = prefersDark ? COLORS_DARK : COLORS_LIGHT
  return colors[Math.floor(Math.random() * colors.length)]
})()

function App() {
  const [color, setColor] = useState(initialColor)
  const [colorInput, setColorInput] = useState(initialColor)
  const [colorError, setColorError] = useState(false)
  const [width, setWidth] = useState('1920')
  const [height, setHeight] = useState('1080')
  const [format, setFormat] = useState<Format>('png')
  const [targetSize, setTargetSize] = useState('')
  const [sizeUnit, setSizeUnit] = useState<SizeUnit>('KB')
  const [generating, setGenerating] = useState(false)
  const [showPrivacy, setShowPrivacy] = useState(false)

  const pickerRef = useRef<HTMLInputElement>(null)
  const isDark = prefersDark

  useEffect(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = color
    ctx.fillRect(0, 0, 32, 32)
    const url = canvas.toDataURL('image/png')
    const links = document.querySelectorAll<HTMLLinkElement>("link[rel~='icon']")
    links.forEach(l => { l.href = url })
    if (!links.length) {
      const link = document.createElement('link')
      link.rel = 'icon'
      link.type = 'image/png'
      link.href = url
      document.head.appendChild(link)
    }
  }, [color])

  const applyColor = (hex: string) => {
    setColor(hex)
    setColorInput(hex)
    setColorError(false)
  }

  const handleTextInput = (val: string) => {
    setColorInput(val)
    const parsed = parseColorInput(val)
    if (parsed) {
      setColor(parsed)
      setColorError(false)
    } else {
      setColorError(true)
    }
  }

  const generateImage = useCallback(async () => {
    const w = parseInt(width)
    const h = parseInt(height)
    if (!w || !h || w < 1 || h < 1) return
    setGenerating(true)
    await new Promise<void>(r => setTimeout(r, 30))

    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = color
    ctx.fillRect(0, 0, w, h)

    const mime: Record<Format, string> = {
      png: 'image/png',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
    }
    const toBlob = (quality?: number) =>
      new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          b => (b ? resolve(b) : reject(new Error('Canvas toBlob failed'))),
          mime[format],
          quality,
        ),
      )

    let blob: Blob
    if (targetSize && (format === 'jpeg' || format === 'webp')) {
      const targetBytes = parseFloat(targetSize) * (sizeUnit === 'MB' ? 1024 * 1024 : 1024)
      let lo = 0.01, hi = 1.0, best: Blob | null = null
      for (let i = 0; i < 12; i++) {
        const mid = (lo + hi) / 2
        const b = await toBlob(mid)
        if (b.size <= targetBytes) { best = b; lo = mid } else { hi = mid }
      }
      blob = best ?? await toBlob(0.01)
    } else {
      blob = await toBlob(format === 'png' ? undefined : 0.92)
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${color.replace('#', '')}-${w}x${h}.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setGenerating(false)
  }, [color, width, height, format, targetSize, sizeUnit])

  const inputCls = [
    'px-3 py-2 rounded-lg text-sm border outline-none transition-colors',
    'focus:ring-2 focus:ring-zinc-400',
    isDark
      ? 'bg-zinc-800 border-zinc-700 text-zinc-100 placeholder-zinc-500'
      : 'bg-zinc-50 border-zinc-200 text-zinc-900 placeholder-zinc-400',
  ].join(' ')

  const labelCls = `block text-sm font-medium mb-1.5 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`
  const dividerCls = `border-t ${isDark ? 'border-zinc-800' : 'border-zinc-100'}`
  const segmentBase = 'flex-1 py-2 text-sm font-medium uppercase tracking-wide transition-colors'
  const segmentActive = isDark ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-900 text-white'
  const segmentInactive = isDark ? 'text-zinc-400 hover:bg-zinc-800' : 'text-zinc-500 hover:bg-zinc-50'
  const segmentBorder = isDark ? 'border-l border-zinc-700' : 'border-l border-zinc-200'

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 transition-[background-color] duration-500"
      style={{ backgroundColor: color }}
    >
      <div className={`w-full max-w-md rounded-2xl shadow-2xl ${isDark ? 'bg-zinc-900' : 'bg-white'}`}>
        {/* Header */}
        <div className={`px-7 pt-7 pb-6`}>
          <div className="flex items-center justify-between">
            <h1 className={`text-lg font-semibold tracking-tight font-heading ${isDark ? 'text-zinc-100' : 'text-zinc-900'}`}>
              color2image
            </h1>
            <a
              href="https://github.com/magnusfoldager/color2image/"
              target="_blank"
              rel="noopener noreferrer"
              className={`transition-colors ${isDark ? 'text-zinc-500 hover:text-zinc-200' : 'text-zinc-400 hover:text-zinc-900'}`}
              title="View on GitHub"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="w-5 h-5 fill-current">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.742 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
          </div>
          <p className={`mt-0.5 text-sm ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Generate a solid-color image ready to download.
          </p>
        </div>

        <div className="px-7 py-6 space-y-5">
          {/* Color */}
          <div>
            <label className={labelCls}>Color</label>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => pickerRef.current?.click()}
                className="relative w-10 h-10 rounded-lg flex-shrink-0 border-2 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-400"
                style={{ backgroundColor: color, borderColor: isDark ? '#3f3f46' : '#d4d4d8' }}
                title="Open color picker"
              >
                <input
                  ref={pickerRef}
                  type="color"
                  value={color}
                  onChange={e => applyColor(e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  tabIndex={-1}
                />
              </button>
              <input
                type="text"
                value={colorInput}
                onChange={e => handleTextInput(e.target.value)}
                placeholder="#3b82f6"
                spellCheck={false}
                className={`flex-1 font-mono ${inputCls} ${colorError ? (isDark ? '!border-red-500 !bg-red-950 !text-red-300 focus:!ring-red-800' : '!border-red-400 !bg-red-50 !text-red-700 focus:!ring-red-300') : ''}`}
              />
            </div>
            {colorError && (
              <p className="mt-1 text-xs text-red-500">Enter a valid hex or rgb() color.</p>
            )}
          </div>

          {/* Dimensions */}
          <div>
            <label className={labelCls}>Dimensions</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={width}
                onChange={e => setWidth(e.target.value)}
                min={1}
                max={16384}
                placeholder="1920"
                className={`flex-1 ${inputCls}`}
              />
              <span className={`text-sm select-none ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`}>×</span>
              <input
                type="number"
                value={height}
                onChange={e => setHeight(e.target.value)}
                min={1}
                max={16384}
                placeholder="1080"
                className={`flex-1 ${inputCls}`}
              />
              <span className={`text-sm select-none ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>px</span>
            </div>
          </div>

          {/* Format */}
          <div>
            <label className={labelCls}>Format</label>
            <div className={`flex rounded-lg border overflow-hidden ${isDark ? 'border-zinc-700' : 'border-zinc-200'}`}>
              {(['png', 'jpeg', 'webp'] as Format[]).map((f, i) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`${segmentBase} ${i > 0 ? segmentBorder : ''} ${format === f ? segmentActive : segmentInactive}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Target file size — only for lossy formats */}
          {(format === 'jpeg' || format === 'webp') && (
            <div>
              <label className={labelCls}>
                Target file size{' '}
                <span className={`font-normal ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>(optional)</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={targetSize}
                  onChange={e => setTargetSize(e.target.value)}
                  min={1}
                  placeholder="500"
                  className={`flex-1 ${inputCls}`}
                />
                <div className={`flex rounded-lg border overflow-hidden ${isDark ? 'border-zinc-700' : 'border-zinc-200'}`}>
                  {(['KB', 'MB'] as SizeUnit[]).map((u, i) => (
                    <button
                      key={u}
                      onClick={() => setSizeUnit(u)}
                      className={`px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${i > 0 ? segmentBorder : ''} ${sizeUnit === u ? segmentActive : segmentInactive}`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`px-7 py-5 ${dividerCls}`}>
          <button
            onClick={generateImage}
            disabled={generating || colorError || !width || !height}
            className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed ${
              isDark
                ? 'bg-zinc-100 text-zinc-900 hover:bg-white'
                : 'bg-zinc-900 text-white hover:bg-zinc-700'
            }`}
          >
            {generating ? 'Generating…' : 'Download Image'}
          </button>
        </div>
      </div>

      {/* Privacy Policy link */}
      <button
        onClick={() => setShowPrivacy(true)}
        className="fixed bottom-4 left-4 text-xs font-medium px-2 py-1 rounded-md cursor-pointer transition-colors bg-black/20 hover:bg-black/30 text-white/80 hover:text-white backdrop-blur-sm"
      >
        Privacy Policy
      </button>

      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} isDark={isDark} />}
    </div>
  )
}

export default App
