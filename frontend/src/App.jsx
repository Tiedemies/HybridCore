import React, { useState } from 'react'
import SearchBar from './components/SearchBar'
import ResultsList from './components/ResultsList'
import SelectionTray from './components/SelectionTray'
import CoreBoard from './components/CoreBoard'

export default function App() {
  const [results, setResults] = useState([])
  const [selection, setSelection] = useState([])

  const handleSelect = (entry) => {
    if (!selection.find(s => s.id === entry.id)) {
      setSelection([...selection, entry])
    }
  }

  return (
    <div className="app">
      <h1>CORE Prototype</h1>
      <SearchBar setResults={setResults} />
      <ResultsList results={results} onSelect={handleSelect} />
      <SelectionTray selection={selection} setSelection={setSelection} />
      <CoreBoard selection={selection} />
    </div>
  )
}
