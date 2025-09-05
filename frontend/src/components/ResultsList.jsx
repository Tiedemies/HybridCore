import React from 'react'

export default function ResultsList({ results, onSelect }) {
  if (!results.length) return null

  return (
    <div style={{ marginBottom: '1rem' }}>
      <h2>Results</h2>
      <ul>
        {results.map((r, idx) => (
          <li key={idx}>
            <strong>{r.document}</strong>
            <button
              style={{ marginLeft: '0.5rem' }}
              onClick={() => onSelect(r)}
            >
              Select
            </button>
            <pre style={{ background: '#eee', padding: '0.5rem' }}>
              {JSON.stringify(r.metadata, null, 2)}
            </pre>
          </li>
        ))}
      </ul>
    </div>
  )
}
