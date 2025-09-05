import React, { useState } from 'react'
import SearchBar from './components/SearchBar.jsx'
import ResultsList from './components/ResultsList.jsx'
import SelectionTray from './components/SelectionTray.jsx'
import CoreBoard from './components/CoreBoard.jsx'

export default function App() {
  const [results, setResults] = useState([])
  const [selected, setSelected] = useState([])

  function handleSelect(entry) {
    if (!selected.find((s) => s.id === entry.id)) {
      setSelected([...selected, entry])
    }
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>CORE Prototype</h1>
      <SearchBar setResults={setResults} />
      <ResultsList results={results} onSelect={handleSelect} />
      <SelectionTray selected={selected} />
      <CoreBoard selected={selected} />
    </div>
  )
}
