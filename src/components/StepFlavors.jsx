import { useState } from 'react'

export default function StepFlavors({ flavors, setFlavors, onNext, onPrev }) {
  const [flavor, setFlavor] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    if (flavor.trim() && !flavors.includes(flavor.trim())) {
      setFlavors([...flavors, flavor.trim()])
      setFlavor('')
    }
  }

  const handleRemove = (f) => {
    setFlavors(flavors.filter(item => item !== f))
  }

  return (
    <div>
      <h2>Paso 2: Sabores disponibles</h2>
      <p>Agregá los gustos de empanadas que ofrece la casa de comidas.</p>

      <form onSubmit={handleAdd} className="input-group">
        <input 
          type="text" 
          placeholder="Nombre del gusto (ej. JyQ)..." 
          value={flavor}
          onChange={(e) => setFlavor(e.target.value)}
        />
        <button type="submit" className="btn-success">Agregar</button>
      </form>

      {flavors.length > 0 && (
        <div className="list-container">
          {flavors.map(f => (
            <div key={f} className="list-item">
              <span>{f}</span>
              <button 
                className="btn-icon btn-danger" 
                onClick={() => handleRemove(f)}
                title="Eliminar"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-4">
        <button 
          className="btn-icon" 
          style={{background: 'rgba(255,255,255,0.1)', width: 'auto', padding: '0.75rem 1rem', borderRadius: '0.75rem', fontWeight: 600}} 
          onClick={onPrev}
        >
          ← Volver
        </button>
        {flavors.length > 0 ? (
          <button className="btn-primary" style={{width: 'auto', marginTop: 0}} onClick={onNext}>
            Siguiente paso →
          </button>
        ) : (
          <p className="flex items-center" style={{opacity: 0.5}}>Cargá un gusto al menos</p>
        )}
      </div>
    </div>
  )
}
