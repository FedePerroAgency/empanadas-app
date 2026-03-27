import { useState } from 'react'

export default function StepPeople({ people, setPeople, onNext }) {
  const [name, setName] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    if (name.trim() && !people.includes(name.trim())) {
      setPeople([...people, name.trim()])
      setName('')
    }
  }

  const handleRemove = (n) => {
    setPeople(people.filter(p => p !== n))
  }

  return (
    <div>
      <h2>Paso 1: ¿Quiénes comen?</h2>
      <p>Anotá los nombres de todos los que van a pedir empanadas hoy.</p>

      <form onSubmit={handleAdd} className="input-group">
        <input 
          type="text" 
          placeholder="Nombre del comensal..." 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" className="btn-success">Agregar</button>
      </form>

      {people.length > 0 && (
        <div className="list-container">
          {people.map(p => (
            <div key={p} className="list-item">
              <span>{p}</span>
              <button 
                className="btn-icon btn-danger" 
                onClick={() => handleRemove(p)}
                title="Eliminar"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {people.length > 0 ? (
        <button className="btn-primary" onClick={onNext}>
          Siguiente paso →
        </button>
      ) : (
        <p className="text-center" style={{opacity: 0.5}}>Agrega al menos una persona para continuar.</p>
      )}
    </div>
  )
}
