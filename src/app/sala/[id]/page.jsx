"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

const FLAVORS = [
  'Carne Suave',
  'Carne Picante',
  'Jamón y Queso',
  'Humita',
  'Pollo',
  'Roquefort'
];

export default function SalaPage() {
  const { id: salaId } = useParams()
  
  const [userName, setUserName] = useState('')
  const [hasName, setHasName] = useState(false)
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [copyStatus, setCopyStatus] = useState('Copiar Link')

  // Load initial data and Setup Realtime
  useEffect(() => {
    if (!salaId) return;

    // Check localStorage for name
    const storedName = localStorage.getItem('empanadas_user_name')
    if (storedName) {
      setUserName(storedName)
      setHasName(true)
    }

    const fetchPedidos = async () => {
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .eq('sala_id', salaId)
      
      if (!error && data) {
        setPedidos(data)
      }
      setLoading(false)
    }

    fetchPedidos()

    // Realtime subscription
    const channel = supabase
      .channel(`public:pedidos:sala_id=eq.${salaId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'pedidos',
        filter: `sala_id=eq.${salaId}` 
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setPedidos(prev => [...prev, payload.new])
        } else if (payload.eventType === 'UPDATE') {
          setPedidos(prev => prev.map(p => p.id === payload.new.id ? payload.new : p))
        } else if (payload.eventType === 'DELETE') {
          setPedidos(prev => prev.filter(p => p.id !== payload.old.id))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [salaId])

  const saveName = () => {
    if (!userName.trim()) return;
    localStorage.setItem('empanadas_user_name', userName.trim())
    setHasName(true)
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopyStatus('¡Copiado!')
      setTimeout(() => setCopyStatus('Copiar Link'), 2000)
    } catch (err) {
      console.error('Error copying link', err)
      setCopyStatus('Error')
      setTimeout(() => setCopyStatus('Copiar Link'), 2000)
    }
  }

  // Optimize calculations
  const myOrdersRaw = useMemo(() => {
    return pedidos.filter(p => p.nombre_persona === userName)
  }, [pedidos, userName])
  
  const getMyQty = useCallback((flavor) => {
    const order = myOrdersRaw.find(o => o.gusto === flavor)
    return order ? order.cantidad : 0
  }, [myOrdersRaw])

  const updateQuantity = async (flavor, delta) => {
    const currentQty = getMyQty(flavor)
    const newQty = Math.max(0, currentQty + delta)
    if (currentQty === newQty) return; // no change

    // Check if the row exists for this user and flavor
    const existingOrder = myOrdersRaw.find(o => o.gusto === flavor)

    if (existingOrder) {
      // update
      await supabase
        .from('pedidos')
        .update({ cantidad: newQty })
        .eq('id', existingOrder.id)
    } else {
      // insert
      if (newQty > 0) {
        await supabase
          .from('pedidos')
          .insert([{ 
            sala_id: salaId, 
            nombre_persona: userName, 
            gusto: flavor, 
            cantidad: newQty 
          }])
      }
    }
  }

  const totalsByFlavor = useMemo(() => {
    const totals = {}
    FLAVORS.forEach(f => totals[f] = 0)
    pedidos.forEach(p => {
      if (totals[p.gusto] !== undefined) {
        totals[p.gusto] += p.cantidad
      } else {
        totals[p.gusto] = p.cantidad
      }
    })
    return totals
  }, [pedidos])

  const grandTotal = useMemo(() => {
    return Object.values(totalsByFlavor).reduce((a, b) => a + b, 0)
  }, [totalsByFlavor])

  if (loading) {
    return <div className="glass-panel text-center"><h2>Cargando sala...</h2></div>
  }

  if (!hasName) {
    return (
      <div className="glass-panel text-center">
        <h2>¿Cuál es tu nombre?</h2>
        <p>Ingresá tu nombre para sumarte al pedido de esta sala.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
          <input 
            type="text" 
            placeholder="Ej: Fede" 
            value={userName} 
            onChange={e => setUserName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && saveName()}
            autoFocus
          />
          <button className="btn-primary" onClick={saveName}>Entrar a la sala</button>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-panel" style={{ paddingBottom: '8rem', position: 'relative', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>Sala de Pedido</h2>
        <button className="btn-success" onClick={copyLink} style={{ padding: '0.5rem 1rem' }}>
          {copyStatus}
        </button>
      </div>
      
      <p>Hola <strong>{userName}</strong>, elegí tus gustos:</p>

      <div className="list-container" style={{ maxHeight: 'none' }}>
        {FLAVORS.map(flavor => {
          const qty = getMyQty(flavor)
          return (
            <div key={flavor} className="list-item">
              <span style={{ fontWeight: 500 }}>{flavor}</span>
              <div className="counter-control">
                <button 
                  className="btn-icon" 
                  onClick={() => updateQuantity(flavor, -1)}
                  disabled={qty === 0}
                >
                  −
                </button>
                <span className="counter-value">{qty}</span>
                <button 
                  className="btn-icon" 
                  onClick={() => updateQuantity(flavor, 1)}
                >
                  +
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Ticking Totalizer (Bottom Fixed inside panel for mobile) */}
      <div style={{
          position: 'fixed',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 2rem)',
          maxWidth: '580px',
          background: 'var(--surface)',
          padding: '1rem',
          borderRadius: '1rem',
          border: '2px solid var(--border)',
          boxShadow: '0 -4px 10px rgba(0,0,0,0.1), 4px 4px 0px 0px var(--border)',
          zIndex: 10
      }}>
        <h3 style={{ margin: 0, marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>Total en vivo</span>
          <span>{grandTotal} empanadas</span>
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '100px', overflowY: 'auto' }}>
          {Object.entries(totalsByFlavor).filter(([f, qty]) => qty > 0).map(([f, qty]) => (
            <div key={f} style={{ background: 'var(--accent)', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.9rem', fontWeight: 600 }}>
              {qty} {f}
            </div>
          ))}
          {grandTotal === 0 && (
             <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Nadie pidió todavía...</span>
          )}
        </div>
      </div>
    </div>
  )
}
