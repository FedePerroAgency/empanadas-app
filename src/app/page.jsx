"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function App() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const crearSala = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('salas')
        .insert([{ nombre: 'Sala de Pedido' }])
        .select()
        .single()

      if (error) {
        throw error
      }

      if (data && data.id) {
        router.push(`/sala/${data.id}`)
      }
    } catch (err) {
      console.error('Error creando sala:', err)
      alert('Error al crear la sala. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-panel text-center">
      <h1>¡Noche de Empanadas!</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
          Organizá el pedido de empanadas sin vueltas.
        </p>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
          Creá una sala única, compartí el link con tus amigos<br />
          y dejá que cada uno elija sus gustos en tiempo real.
        </p>
      </div>

      <button 
        className="btn-primary" 
        onClick={crearSala}
        disabled={loading}
        style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}
      >
        {loading ? 'Creando...' : 'Crear Sala de Pedido'}
      </button>
    </div>
  )
}
