import React from 'react'

export default function SelectionTray({ selection, setSelection }) {
  const handleClear = () => setSelection([])

  return (
    <div className="selection-tray">
      <h2>Selection Tray</h2>
      <button onClick={handleClear}>Clear</button>
      <ul>
        {selection.map(item => (
          <li key={item.id}>{item.id} - {item.metadata?.title}</li>
        ))}
      </ul>
    </div>
  )
}
