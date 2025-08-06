import { useRef, useState, type KeyboardEvent } from 'react'

const colorThemes = [
  {
    name: 'Original Teal',
    gradient: 'linear-gradient(135deg, #20e4bc 0%, #0fbf96 100%)',
    base: '#0aa582',
    glow: 'radial-gradient(circle, rgba(28, 216, 176, 0.8) 0%, rgba(12, 184, 142, 0) 70%)',
  },
  {
    name: 'Royal Purple',
    gradient: 'linear-gradient(135deg, #a18cff 0%, #7c5cff 100%)',
    base: '#6a4aef',
    glow: 'radial-gradient(circle, rgba(124, 92, 255, 0.8) 0%, rgba(106, 74, 239, 0) 70%)',
  },
  {
    name: 'Coral Red',
    gradient: 'linear-gradient(135deg, #ff7e7e 0%, #ff5252 100%)',
    base: '#e64545',
    glow: 'radial-gradient(circle, rgba(255, 82, 82, 0.8) 0%, rgba(230, 69, 69, 0) 70%)',
  },
  {
    name: 'Ocean Blue',
    gradient: 'linear-gradient(135deg, #5ebbff 0%, #3d9dff 100%)',
    base: '#2a85e5',
    glow: 'radial-gradient(circle, rgba(61, 157, 255, 0.8) 0%, rgba(42, 133, 229, 0) 70%)',
  },
  {
    name: 'Amber Gold',
    gradient: 'linear-gradient(135deg, #ffcf5e 0%, #ffb72a 100%)',
    base: '#e59e1a',
    glow: 'radial-gradient(circle, rgba(255, 183, 42, 0.8) 0%, rgba(229, 158, 26, 0) 70%)',
  },
  {
    name: 'Magenta Pink',
    gradient: 'linear-gradient(135deg, #ff7ad9 0%, #ff42c0 100%)',
    base: '#e032a8',
    glow: 'radial-gradient(circle, rgba(255, 66, 192, 0.8) 0%, rgba(224, 50, 168, 0) 70%)',
  },
  {
    name: 'Lime Green',
    gradient: 'linear-gradient(135deg, #b4e04a 0%, #8bc220 100%)',
    base: '#78a818',
    glow: 'radial-gradient(circle, rgba(139, 194, 32, 0.8) 0%, rgba(120, 168, 24, 0) 70%)',
  },
]

function PlayButton({ colorTheme }: { colorTheme: (typeof colorThemes)[0] }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setIsPressed(true)
    }
  }

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      setIsPressed(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        ref={buttonRef}
        className={`group relative outline-none ${isFocused ? 'focus-visible:ring-opacity-50 focus-visible:ring-4 focus-visible:ring-white' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false)
          setIsPressed(false)
        }}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onClick={() => console.log(`${colorTheme.name} button clicked`)}
        aria-label={`Play with ${colorTheme.name} button`}
        tabIndex={0}
      >
        <div
          className={`absolute inset-0 rounded-full blur-xl transition-all duration-300 ${isHovered || isFocused ? 'scale-110 opacity-70' : 'scale-100 opacity-50'}`}
          style={{
            background: colorTheme.glow,
          }}
        />

        <div
          className={`absolute rounded-full transition-all duration-300 ${isPressed ? 'scale-95' : isHovered || isFocused ? 'scale-105' : 'scale-100'}`}
          style={{
            width: '88px',
            height: '88px',
            background: colorTheme.base,
            transform: `${isPressed ? 'translateY(2px)' : 'translateY(4px)'}`,
            filter: 'blur(1px)',
          }}
        />

        <div
          className={`relative flex h-22 w-22 items-center justify-center rounded-full transition-all duration-300 ${isPressed ? 'scale-95' : isHovered || isFocused ? 'scale-105' : 'scale-100'}`}
          style={{
            width: '88px',
            height: '88px',
            background: colorTheme.gradient,
            boxShadow: `
              0 ${isPressed ? '2px' : '6px'} 0 ${colorTheme.base},
              0 ${isPressed ? '3px' : '8px'} 10px rgba(0, 0, 0, 0.2),
              inset 0 -3px 0 rgba(0, 0, 0, 0.1),
              inset 0 3px 0 rgba(255, 255, 255, 0.2)
            `,
            transform: `${isPressed ? 'translateY(2px)' : 'translateY(0)'}`,
          }}
        >
          <div
            className="ml-3 h-0 w-0 border-t-[14px] border-b-[14px] border-l-[22px] border-t-transparent border-b-transparent border-l-white"
            style={{
              filter: 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2))',
            }}
          />

          <div
            className="absolute top-[5%] right-[10%] left-[10%] h-[30%] rounded-t-full opacity-20"
            style={{
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0) 100%)',
            }}
          />
        </div>

        <div className="absolute -bottom-4 left-1/2 h-2 w-16 -translate-x-1/2 rounded-full bg-black opacity-20 blur-md" />
      </button>
      <span className="mt-1 text-xs font-medium text-gray-700">{colorTheme.name}</span>
    </div>
  )
}

export default function ChalkboardPlayButtonColors() {
  return (
    <div className="flex min-h-[400px] items-center justify-center bg-gray-100 p-6">
      <div className="relative w-full max-w-5xl">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg shadow-xl">
          <div
            className="absolute inset-0 rounded-lg border-[20px]"
            style={{
              borderColor: '#8B4513',
              backgroundImage:
                'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><defs><linearGradient id="woodGrain" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="%23B26B3F"/><stop offset="20%" stopColor="%239E5C32"/><stop offset="40%" stopColor="%23B26B3F"/><stop offset="60%" stopColor="%23854A21"/><stop offset="80%" stopColor="%239E5C32"/><stop offset="100%" stopColor="%23B26B3F"/></linearGradient></defs><rect width="200" height="200" fill="url(%23woodGrain)"/><filter id="woodTexture"><feTurbulence type="turbulence" baseFrequency="0.015" numOctaves="3" seed="5" stitchTiles="stitch"/><feDisplacementMap in="SourceGraphic" scale="3" xChannelSelector="R" yChannelSelector="G"/></filter><rect width="200" height="200" filter="url(%23woodTexture)" fill="none" stroke="%23854A21" strokeWidth="0.5" strokeOpacity="0.4"/><g fill="%23854A21" fillOpacity="0.2"><ellipse cx="50" cy="30" rx="20" ry="5"/><ellipse cx="150" cy="70" rx="25" ry="7"/><ellipse cx="70" cy="150" rx="15" ry="4"/><ellipse cx="180" cy="120" rx="18" ry="6"/><ellipse cx="30" cy="100" rx="22" ry="5"/></g></svg>\')',
              backgroundSize: '200px 200px',
              boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.3)',
            }}
          />

          <div
            className="absolute inset-[20px]"
            style={{
              background: 'linear-gradient(135deg, #0e6245 0%, #0d7a56 50%, #0e6245 100%)',
              boxShadow: 'inset 0 0 60px rgba(0, 0, 0, 0.3)',
            }}
          >
            <svg width="0" height="0">
              <filter id="chalkTexture">
                <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" seed="3" />
                <feDisplacementMap in="SourceGraphic" scale="5" />
                <feGaussianBlur stdDeviation="0.5" />
                <feComposite operator="in" in2="SourceGraphic" />
              </filter>
            </svg>

            <div
              className="absolute inset-0 opacity-10"
              style={{
                filter: 'url(#chalkTexture)',
                background: 'linear-gradient(to right, #ffffff 0%, transparent 50%, #ffffff 100%)',
              }}
            />

            <div
              className="absolute inset-0"
              style={{
                boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.4)',
              }}
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-x-12 gap-y-16 p-8 md:grid-cols-4">
                {colorThemes.map((theme, index) => (
                  <PlayButton key={index} colorTheme={theme} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
