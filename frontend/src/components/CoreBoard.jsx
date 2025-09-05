import React from 'react'

export default function CoreBoard({ selected }) {
  // naive 3x3 layout for now
  return (
    <div>
      <h2>Core Strategic Design Board</h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridGap: '1rem',
          marginTop: '1rem'
        }}
      >
        {Array.from({ length: 9 }).map((_, idx) => (
          <div
            key={idx}
            style={{
              border: '1px solid #ccc',
              minHeight: '100px',
              padding: '0.5rem'
            }}
          >
            {selected[idx] ? selected[idx].document : `Cell ${idx + 1}`}
          </div>
        ))}
      </div>
    </div>
  )
}
