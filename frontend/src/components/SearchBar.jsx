import React, { useState } from 'react'

export default function SearchBar({ setResults }) {
  const [query, setQuery] = useState('')

 async function handleSearch(e) {
  e.preventDefault()
  try {
    const resp = await fetch('http://127.0.0.1:8000/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, top_k: 5 })
    })
    if (!resp.ok) {
      const txt = await resp.text()
      throw new Error(`HTTP ${resp.status}: ${txt}`)
    }
    const data = await resp.json()
    const docs = data.documents?.[0] || []
    const metas = data.metadatas?.[0] || []
    const ids = data.ids?.[0] || []
    const combined = docs.map((doc, i) => ({ id: ids[i], document: doc, metadata: metas[i] }))
    setResults(combined)
  } catch (err) {
    alert('Search failed: ' + err.message)
    console.error(err)
  }
}


  return (
    <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
      <input
        placeholder="Enter query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginRight: '0.5rem' }}
      />
      <button type="submit">Search</button>
    </form>
  )
}
