// frontend/src/components/CoreBoard.jsx
import React from 'react'

/**
 * CoreBoard (Grayscale)
 * 3 spaces × 3 layers, evenly spaced, no inner text.
 * Pure SVG; no external deps; safe drop-in replacement.
 *
 * Props (all optional):
 *  - width, height: canvas size in px (default 800 × 800)
 *  - ringRadii: [inner, middle, outer] radii for the three layers
 *  - stroke: border color for segment outlines
 *  - baseGray: base grayscale (0–255) used to derive fills
 *  - style: inline style for the wrapping div
 *
 * New (optional) domain marker props (no-op unless provided):
 *  - domainNames: string[]
 *  - domainAngles: number[]  // degrees, clockwise, 0° at +X (to the right)
 *  - domainRadius: number    // small circle radius
 *  - domainDistance: number  // distance from center to marker centers
 *  - domainFill, domainStroke, domainTextColor, domainFontSize
 */
export default function CoreBoard({
  width = 1000,
  height = 1000,
  ringRadii = [90, 180, 270, 360],
  stroke = '#666',
  baseGray = 210,
  style = {},

  // --- NEW, optional domain marker props ---
  domainNames = ["Political", "Public\nAdmin", "Culture"],
  domainAngles = [0, 15, 310],
  domainRadius = 36,
  domainDistance = 410,   // must be > max ring radius + domainRadius
  domainFill = '#ffffff',
  domainStroke = '#333',
  domainTextColor = '#000',
  domainFontSize = 12,
}) {
  const cx = width / 2
  const cy = height / 2

  // Three spaces (Civic, Governance, Services) arranged to mirror the board
  // Angles in degrees, clockwise, 0° is to the right (SVG uses 0° on +X)
  // We convert from a -90° offset so 0° is at 12 o'clock for nicer math.
  const sectors = [
    { key: 'civic', start: 240, end: 360 },      // left arc
    { key: 'governance', start: 0, end: 120 },   // right arc (wraps across 0°)
    { key: 'services', start: 120, end: 240 },   // bottom arc
  ]

  function polarToCartesian(cx, cy, r, angleDeg) {
    const a = ((angleDeg - 90) * Math.PI) / 180
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
  }

  function ringSectorPath(rInner, rOuter, startAngle, endAngle) {
    // Normalize sweep so large-arc-flag is correct across wrap
    let sweep = ((endAngle - startAngle) % 360 + 360) % 360
    const largeArc = sweep > 180 ? 1 : 0

    const pOuterStart = polarToCartesian(cx, cy, rOuter, endAngle)
    const pOuterEnd = polarToCartesian(cx, cy, rOuter, startAngle)
    const pInnerEnd = polarToCartesian(cx, cy, rInner, startAngle)
    const pInnerStart = polarToCartesian(cx, cy, rInner, endAngle)

    return [
      'M', pOuterStart.x, pOuterStart.y,
      'A', rOuter, rOuter, 0, largeArc, 0, pOuterEnd.x, pOuterEnd.y,
      'L', pInnerEnd.x, pInnerEnd.y,
      'A', rInner, rInner, 0, largeArc, 1, pInnerStart.x, pInnerStart.y,
      'Z',
    ].join(' ')
  }

  // --- NEW: domain markers (no-op if domainNames/Angles empty) ---
  function renderDomains() {
    const n = Math.min(domainNames.length, domainAngles.length)
    if (n === 0) return null

    return (
      <g className="domain-markers">
        {Array.from({ length: n }).map((_, i) => {
          const angle = Number(domainAngles[i]) || 0
          const name = String(domainNames[i] ?? '')
          const { x, y } = polarToCartesian(cx, cy, domainDistance, angle)
          return (
            <g key={`domain-${i}`} transform={`translate(${x},${y})`}>
              <circle
                r={domainRadius}
                fill={domainFill}
                stroke={domainStroke}
                strokeWidth="1.5"
                shapeRendering="geometricPrecision"
              />
              <text
                x="0"
                y="0"
                fill={domainTextColor}
                fontSize={domainFontSize}
                fontFamily="Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
                dominantBaseline="middle"
                textAnchor="middle"
                style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {name}
              </text>
            </g>
          )
        })}
      </g>
    )
  }

  return (
    <div
      style={{
        width,
        height,
        display: 'inline-block',
        ...style,
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="CORE diagram: 3 spaces by 3 layers (grayscale)"
      >
        {/* Background */}
        <rect x="0" y="0" width={width} height={height} fill="#fff" />

        {/* Concentric rings × 3 sector arcs */}
        {ringRadii.map((rOuter, i) => {
          const rInner = i === 0 ? 90 : ringRadii[i - 1]
          return sectors.map((s, j) => {
            // Subtle differentiation per ring & sector, except inner is white
            const g = i === 0 ? 255 : Math.max(160, Math.min(245, baseGray + i * 12 - j * 8))
            const fill = `rgb(${g}, ${g}, ${g})`
            const d = ringSectorPath(rInner, rOuter, s.start, s.end)
            return (
              <path
                key={`ring-${i}-sector-${s.key}`}
                d={d}
                fill={fill}
                stroke={stroke}
                strokeWidth="1"
                shapeRendering="geometricPrecision"
              />
            )
          })
        })}

        {/* NEW: Domain markers (outside) */}
        {renderDomains()}
      </svg>
    </div>
  )
}
