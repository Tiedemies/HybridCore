import React, { useState } from 'react'
import axios from 'axios'

export default function SearchBar({ setResults }) {
  const [query, setQuery] = useState('')

  const handleSearch = async () => {
    try {
      const resp = await axios.post('http://127.0.0.1:8000/search', {
        query: query,
        top_k: 5
      })
      setResults(resp.data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="search-bar">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  )
}
