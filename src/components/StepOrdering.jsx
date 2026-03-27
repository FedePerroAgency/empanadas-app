import { useState } from 'react'

export default function StepOrdering({ people, flavors, orders, setOrders, onNext, onPrev }) {
  const [activePersonIndex, setActivePersonIndex] = useState(0)
  
  if (people.length === 0) return <p>No hay personas cargadas.</p>
  
  const currentPerson = people[activePersonIndex]

  const getQty = (person, flavor) => {
    return orders[person]?.[flavor] || 0
  }

  const updateQty = (person, flavor, delta) => {
    setOrders(prev => {
      const currentPersonOrders = prev[person] || {}
      const currentQty = currentPersonOrders[flavor] || 0
      const newQty = Math.max(0, currentQty + delta)
      
      return {
        ...prev,
        [person]: {
          ...currentPersonOrders,
          [flavor]: newQty
        }
      }
    })
  }

  const nextPerson = () => {
    if (activePersonIndex < people.length - 1) {
      setActivePersonIndex(i => i + 1)
    } else {
      onNext()
    }
  }

  const prevPerson = () => {
    if (activePersonIndex > 0) {
      setActivePersonIndex(i => i - 1)
    } else {
      onPrev()
    }
  }

  const personTotal = Object.values(orders[currentPerson] || {}).reduce((a, b) => a + b, 0)

  return (
    <div>
      <h2>Paso 3: ¡A pedir!</h2>
      <div className="flex justify-between items-center mb-4">
        <h3 style={{ margin: 0, color: 'var(--accent)' }}>¿Qué lleva {currentPerson}?</h3>
        <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Total: {personTotal} 🥟
        </span>
      </div>
      
      <div className="list-container" style={{maxHeight: '40vh'}}>
        {flavors.map(f => (
          <div key={f} className="list-item">
            <span style={{flex: 1}}>{f}</span>
            <div className="counter-control">
              <button 
                className="btn-icon" 
                style={{width: '2rem', height: '2rem', minWidth: '2rem'}}
                onClick={() => updateQty(currentPerson, f, -1)}
              >
                -
              </button>
              <span className="counter-value">{getQty(currentPerson, f)}</span>
              <button 
                className="btn-icon" 
                style={{width: '2rem', height: '2rem', minWidth: '2rem'}}
                onClick={() => updateQty(currentPerson, f, 1)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <button 
          className="btn-icon" 
          style={{background: 'rgba(255,255,255,0.1)', width: 'auto', padding: '0.75rem 1rem', borderRadius: '0.75rem', fontWeight: 600}} 
          onClick={prevPerson}
        >
          ← {activePersonIndex > 0 ? people[activePersonIndex - 1] : 'Volver'}
        </button>
        <div style={{color: 'var(--text-secondary)', alignSelf: 'center', fontWeight: 'bold'}}>
           {activePersonIndex + 1} / {people.length}
        </div>
        <button className="btn-primary" style={{width: 'auto', marginTop: 0}} onClick={nextPerson}>
          {activePersonIndex < people.length - 1 ? 'Siguiente →' : 'Terminar Pedido ✓'}
        </button>
      </div>
    </div>
  )
}
