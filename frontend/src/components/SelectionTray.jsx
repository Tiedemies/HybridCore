import React from 'react'

export default function SelectionTray({ selected }) {
  if (!selected.length) return null

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h2>Selection Tray</h2>
      <ul>
        {selected.map((s, idx) => (
          <li key={idx}>{s.document}</li>
        ))}
      </ul>
    </div>
  )
}
