import React from 'react'

// Simple 3x3 grid board
export default function CoreBoard({ selection }) {
  const grid = [
    ['Societal-Cognitive', 'Tech-Cognitive', 'Info-Cognitive'],
    ['Societal-Org', 'Tech-Org', 'Info-Org'],
    ['Societal-Infra', 'Tech-Infra', 'Info-Infra']
  ]

  return (
    <div className="core-board">
      <h2>Core Board</h2>
      <table border="1" cellPadding="5">
        <tbody>
          {grid.map((row, i) => (
            <tr key={i}>
              {row.map(cell => (
                <td key={cell} style={{ width: 150, height: 80, verticalAlign: 'top' }}>
                  <strong>{cell}</strong>
                  <ul>
                    {selection.filter(item =>
                      (item.metadata?.space + '-' + item.metadata?.layer) === cell.replace('-', '.')
                    ).map(item => (
                      <li key={item.id}>{item.metadata?.title}</li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
