"use client"

import { useState } from 'react'
import StepPeople from '../components/StepPeople'
import StepFlavors from '../components/StepFlavors'
import StepOrdering from '../components/StepOrdering'
import StepSummary from '../components/StepSummary'

const DEFAULT_FLAVORS = [
  'Carne Suave (Frita)',
  'Carne Suave (Horno)',
  'Carne Cortada a Cuchillo',
  'Jamón y Queso',
  'Pollo'
]

export default function App() {
  const [step, setStep] = useState(1)
  const [people, setPeople] = useState([])
  const [flavors, setFlavors] = useState(DEFAULT_FLAVORS)
  // orders format: { "Fede": { "Pollo": 2, "Jamón y Queso": 1 }, ... }
  const [orders, setOrders] = useState({})

  const nextStep = () => setStep(s => Math.min(s + 1, 4))
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const restartNight = () => {
    setStep(1)
    setPeople([])
    setFlavors(DEFAULT_FLAVORS)
    setOrders({})
  }

  return (
    <div className="glass-panel">
      <h1>¡Noche de Empanadas!</h1>
      
      <div className="stepper">
        {[1, 2, 3, 4].map(num => (
          <div 
            key={num} 
            className={`step-dot ${step === num ? 'active' : ''} ${step > num ? 'completed' : ''}`}
          />
        ))}
      </div>

      {step === 1 && (
        <StepPeople 
          people={people} 
          setPeople={setPeople} 
          onNext={nextStep} 
        />
      )}

      {step === 2 && (
        <StepFlavors 
          flavors={flavors} 
          setFlavors={setFlavors} 
          onNext={nextStep} 
          onPrev={prevStep} 
        />
      )}

      {step === 3 && (
        <StepOrdering 
          people={people} 
          flavors={flavors} 
          orders={orders} 
          setOrders={setOrders} 
          onNext={nextStep} 
          onPrev={prevStep} 
        />
      )}

      {step === 4 && (
        <StepSummary 
          people={people}
          flavors={flavors}
          orders={orders}
          onPrev={prevStep} 
          onRestart={restartNight}
        />
      )}
    </div>
  )
}
