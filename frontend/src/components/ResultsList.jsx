import React from 'react'

export default function ResultsList({ results, onSelect }) {
  if (!results || !results.ids) return null

  return (
    <div className="results-list">
      <h2>Results</h2>
      <ul>
        {results.ids[0].map((id, idx) => (
          <li key={id}>
            <strong>{id}</strong>
            <button onClick={() => onSelect({
              id,
              metadata: results.metadatas[0][idx]
            })}>Select</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
