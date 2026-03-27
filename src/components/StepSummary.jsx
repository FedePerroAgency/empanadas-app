import { useState } from 'react'

export default function StepSummary({ people, flavors, orders, onPrev, onRestart }) {
  const [pricePerEmpanada, setPricePerEmpanada] = useState('')
  const [copied, setCopied] = useState(false)

  // Calculate totals per flavor
  const totalsByFlavor = {}
  let grandTotal = 0

  flavors.forEach(f => {
    let totalForFlavor = 0
    people.forEach(p => {
      totalForFlavor += (orders[p]?.[f] || 0)
    })
    if (totalForFlavor > 0) {
      totalsByFlavor[f] = totalForFlavor
      grandTotal += totalForFlavor
    }
  })

  const price = parseFloat(pricePerEmpanada) || 0

  const generateSummaryText = () => {
    let text = `🥟 *PEDIDO DE EMPANADAS* 🥟\n\n`
    text += `*TOTAL A PEDIR: ${grandTotal}*\n`
    Object.entries(totalsByFlavor).forEach(([flavor, qty]) => {
      text += `- ${qty}x ${flavor}\n`
    })

    if (price > 0) {
      text += `\n*COSTO TOTAL: $${grandTotal * price}*\n`
    }

    text += `\n*DETALLE POR PERSONA*\n`
    people.forEach(p => {
      const personOrders = orders[p] || {}
      const personTotalQty = Object.values(personOrders).reduce((a, b) => a + b, 0)
      if (personTotalQty > 0) {
        text += `\n*${p}* (${personTotalQty} emp.`
        if (price > 0) text += ` - $${personTotalQty * price}`
        text += `):\n`
        Object.entries(personOrders).forEach(([f, q]) => {
          if (q > 0) text += `  - ${q}x ${f}\n`
        })
      }
    })

    return text
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generateSummaryText())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <h2>Paso 4: Resumen final</h2>
      
      <div className="input-group" style={{ marginBottom: '1.5rem' }}>
        <input 
          type="number" 
          placeholder="Precio x empanada (Opcional)..." 
          value={pricePerEmpanada}
          onChange={(e) => setPricePerEmpanada(e.target.value)}
          min="0"
        />
      </div>

      <div className="list-container" style={{maxHeight: '45vh', marginBottom: '1rem'}}>
        <div className="summary-block">
          <h3>Total General</h3>
          {Object.entries(totalsByFlavor).length === 0 ? (
            <p className="mt-4" style={{opacity: 0.5}}>Nadie pidió nada todavía.</p>
          ) : (
            <>
              {Object.entries(totalsByFlavor).map(([f, qty]) => (
                <div key={f} className="summary-row">
                  <span>{f}</span>
                  <span className="font-bold">{qty}</span>
                </div>
              ))}
              <div className="summary-row" style={{ marginTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                <span>Total de Empanadas</span>
                <span className="font-bold">{grandTotal}</span>
              </div>
              {price > 0 && grandTotal > 0 && (
                 <div className="summary-row" style={{ color: 'var(--success)' }}>
                   <span>Costo Total</span>
                   <span className="font-bold">${grandTotal * price}</span>
                 </div>
              )}
            </>
          )}
        </div>

        <div className="summary-block">
          <h3>Detalle individual</h3>
          {people.map(p => {
            const sum = Object.values(orders[p] || {}).reduce((a, b) => a + b, 0)
            if (sum === 0) return null
            return (
              <div key={p} className="summary-row" style={{flexDirection: 'column', gap: '0.5rem'}}>
                <div className="flex justify-between items-center">
                  <span style={{color: 'var(--accent)', fontWeight: 'bold'}}>{p}</span>
                  <span className="font-bold">{sum} emp. {price > 0 && <span style={{color: 'var(--success)'}}>(${sum * price})</span>}</span>
                </div>
                <div style={{fontSize: '0.85rem', color: 'var(--text-secondary)', paddingLeft: '0.5rem', borderLeft: '2px solid rgba(255,255,255,0.1)'}}>
                  {Object.entries(orders[p] || {}).map(([f, q]) => q > 0 && (
                    <div key={f} className="flex justify-between" style={{marginBottom: '0.25rem'}}>
                       <span>{q}x {f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <button 
          className={copied ? "btn-success" : "btn-primary"} 
          onClick={handleCopy}
          style={{ width: '100%', marginTop: 0 }}
          disabled={grandTotal === 0}
        >
           {copied ? '¡Copiado al portapapeles! ✓' : 'Copiar Resumen para WhatsApp'}
        </button>
        
        <button 
          className="btn-icon" 
          style={{background: 'rgba(255,255,255,0.1)', width: '100%', borderRadius: '0.75rem', padding: '0.75rem', fontWeight: 600}} 
          onClick={onPrev}
        >
          ← Volver a Editar
        </button>
        
        <button 
          className="btn-danger" 
          style={{width: '100%', borderRadius: '0.75rem', padding: '0.75rem', fontWeight: 600, marginTop: '-0.25rem'}} 
          onClick={onRestart}
        >
          ↻ Reiniciar Noche
        </button>
      </div>
    </div>
  )
}
