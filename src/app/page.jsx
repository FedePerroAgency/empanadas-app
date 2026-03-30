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
      // Generamos el ID manualmente por si la tabla no tiene configurado un valor por defecto
      const newId = crypto.randomUUID()
      
      const { data, error } = await supabase
        .from('salas')
        .insert([{ id: newId, nombre_sala: 'Sala de Pedido' }])
        .select()
        .single()

      if (error) {
        console.error('Error detallado de Supabase:', error)
        throw error
      }

      const salaId = data?.id || newId; // Fallback por si .select() falla por RLS
      router.push(`/sala/${salaId}`)
    } catch (err) {
      console.error('Error atrapado:', err)
      // Mostramos un alert con el detalle de Supabase para entender fácil si es RLS u otra cosa
      alert(`Error al crear la sala: ${err.message || err.details || 'Revisa la consola'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="main-wrapper">
      <div className="glass-panel text-left" style={{ paddingTop: '5rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>¡Noche de Empanadas!</h1>
        
        <div style={{ marginBottom: '3rem' }}>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Organizá el pedido de empanadas sin vueltas.
          </p>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
            Creá una sala única, compartí el link con tus amigos y dejá que cada uno elija sus gustos en tiempo real.
          </p>
        </div>

        <button 
          className="btn-primary" 
          onClick={crearSala}
          disabled={loading}
          style={{ fontSize: '1.1rem', padding: '1.25rem', borderRadius: '12px' }}
        >
          {loading ? 'Creando...' : 'Crear Sala de Pedido'}
        </button>
      </div>
    </div>
  )
}
