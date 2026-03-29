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

const STATE_KEY = '__ESTADO__';

export default function SalaPage() {
  const { id: salaId } = useParams()
  
  const [userName, setUserName] = useState('')
  const [hasName, setHasName] = useState(false)
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [copyStatus, setCopyStatus] = useState('Copiar Link')
  const [newFlavor, setNewFlavor] = useState('')
  const [summariesCopyStatus, setSummariesCopyStatus] = useState('Copiar pedido para WhatsApp')

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
    return pedidos.filter(p => p.nombre_persona === userName && p.gusto !== STATE_KEY)
  }, [pedidos, userName])
  
  const getMyQty = useCallback((flavor) => {
    const order = myOrdersRaw.find(o => o.gusto === flavor)
    return order ? order.cantidad : 0
  }, [myOrdersRaw])

  const isReady = useMemo(() => {
    const statusRow = pedidos.find(p => p.nombre_persona === userName && p.gusto === STATE_KEY);
    return statusRow?.cantidad === 1;
  }, [pedidos, userName]);

  const participants = useMemo(() => {
    return [...new Set(pedidos.map(p => p.nombre_persona))];
  }, [pedidos]);

  const allReady = useMemo(() => {
    if (participants.length === 0) return false;
    return participants.every(name => {
      const statusRow = pedidos.find(p => p.nombre_persona === name && p.gusto === STATE_KEY);
      return statusRow?.cantidad === 1;
    });
  }, [pedidos, participants]);

  const updateQuantity = async (flavor, delta) => {
    if (isReady && flavor !== STATE_KEY) return;
    
    const currentQty = flavor === STATE_KEY 
      ? (pedidos.find(p => p.nombre_persona === userName && p.gusto === STATE_KEY)?.cantidad || 0)
      : getMyQty(flavor);
      
    const newQty = flavor === STATE_KEY ? delta : Math.max(0, currentQty + delta);
    if (currentQty === newQty && flavor !== STATE_KEY) return;

    const existingOrder = pedidos.find(p => p.nombre_persona === userName && p.gusto === flavor);

    if (existingOrder) {
      await supabase
        .from('pedidos')
        .update({ cantidad: newQty })
        .eq('id', existingOrder.id)
    } else {
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

  const handleAddCustomFlavor = () => {
    if (!newFlavor.trim()) return;
    const flavor = newFlavor.trim();
    updateQuantity(flavor, 1);
    setNewFlavor('');
  }

  const allFlavors = useMemo(() => {
    const customFlavors = new Set(pedidos.filter(p => p.gusto !== STATE_KEY).map(p => p.gusto))
    FLAVORS.forEach(f => customFlavors.delete(f))
    return [...FLAVORS, ...Array.from(customFlavors)]
  }, [pedidos])

  const totalsByFlavor = useMemo(() => {
    const totals = {}
    allFlavors.forEach(f => totals[f] = 0)
    pedidos.forEach(p => {
      if (p.gusto !== STATE_KEY) {
        if (totals[p.gusto] !== undefined) {
          totals[p.gusto] += p.cantidad
        } else {
          totals[p.gusto] = p.cantidad
        }
      }
    })
    return totals
  }, [pedidos, allFlavors])

  const grandTotal = useMemo(() => {
    return Object.values(totalsByFlavor).reduce((a, b) => a + b, 0)
  }, [totalsByFlavor])

  const copyFinalSummary = async () => {
    let text = `🥟 *RESUMEN DE EMPANADAS* 🥟\n\n`;
    text += `*Total (${grandTotal} empanadas):*\n`;
    Object.entries(totalsByFlavor).filter(([_, qty]) => qty > 0).forEach(([flavor, qty]) => {
      text += `- ${qty} ${flavor}\n`;
    });
    
    text += `\n*Detalle por persona:*\n`;
    participants.forEach(name => {
      const userOrders = pedidos.filter(p => p.nombre_persona === name && p.gusto !== STATE_KEY && p.cantidad > 0);
      if (userOrders.length > 0) {
        text += `- ${name}: ${userOrders.map(o => `${o.cantidad} ${o.gusto}`).join(', ')}\n`;
      }
    });

    try {
      await navigator.clipboard.writeText(text);
      setSummariesCopyStatus('¡Copiado!');
      setTimeout(() => setSummariesCopyStatus('Copiar pedido para WhatsApp'), 2000);
    } catch (err) {
      console.error('Error copying summary', err);
    }
  }

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

  // --- RENDERING SCREENS ---

  if (allReady) {
    return (
      <div className="glass-panel animate-in">
        <div className="text-center mb-4">
          <span style={{ fontSize: '3rem' }}>🎉</span>
          <h1 style={{ marginTop: '0.5rem' }}>¡Pedido Cerrado!</h1>
          <p>Todos terminaron de elegir. Aquí está el resumen final:</p>
        </div>

        <div className="summary-block">
          <h3>Total General ({grandTotal} empanadas)</h3>
          {Object.entries(totalsByFlavor).filter(([_, qty]) => qty > 0).map(([flavor, qty]) => (
            <div key={flavor} className="summary-row">
              <span>{flavor}</span>
              <strong>{qty}</strong>
            </div>
          ))}
        </div>

        <div className="summary-block">
          <h3>Detalle por Persona</h3>
          {participants.map(name => {
            const orders = pedidos.filter(p => p.nombre_persona === name && p.gusto !== STATE_KEY && p.cantidad > 0);
            return (
              <div key={name} style={{ marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #eee' }}>
                <strong>{name}:</strong>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {orders.length > 0 ? orders.map(o => `${o.cantidad} ${o.gusto}`).join(', ') : 'No eligió nada'}
                </div>
              </div>
            )
          })}
        </div>

        <button className="btn-primary btn-success" onClick={copyFinalSummary}>
          {summariesCopyStatus}
        </button>
        
        <button 
          className="btn-secondary" 
          style={{ marginTop: '1rem', width: '100%', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}
          onClick={() => updateQuantity(STATE_KEY, 0)}
        >
          Reabrir sala (volver a editar)
        </button>
      </div>
    )
  }

  if (isReady) {
    return (
      <div className="glass-panel text-center animate-in">
        <div style={{ marginBottom: '2rem' }}>
          <span style={{ fontSize: '3rem' }}>⏳</span>
          <h2 style={{ marginTop: '1rem' }}>¡Listo, {userName}!</h2>
          <p>Tu pedido está guardado. Esperando a los demás participantes...</p>
        </div>

        <div className="list-container" style={{ maxHeight: '200px', marginBottom: '2rem' }}>
          <h4>Tu elección:</h4>
          {myOrdersRaw.filter(p => p.cantidad > 0).map(p => (
            <div key={p.gusto} className="summary-row">
              <span>{p.gusto}</span>
              <strong>{p.cantidad}</strong>
            </div>
          ))}
          {myOrdersRaw.filter(p => p.cantidad > 0).length === 0 && <p style={{ fontStyle: 'italic' }}>No elegiste nada aún.</p>}
        </div>

        <div className="status-box" style={{ background: '#f8f8f8', padding: '1rem', borderRadius: '0.5rem', border: '2px solid var(--border)', marginBottom: '2rem' }}>
          <h4 style={{ marginBottom: '0.5rem' }}>Estado de la sala:</h4>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {participants.map(name => {
              const ready = pedidos.find(p => p.nombre_persona === name && p.gusto === STATE_KEY)?.cantidad === 1;
              return (
                <div key={name} style={{ padding: '0.2rem 0.6rem', background: ready ? 'var(--success)' : '#ddd', color: ready ? 'white' : '#666', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 600 }}>
                  {name} {ready ? '✓' : '...'}
                </div>
              )
            })}
          </div>
        </div>

        <button className="btn-primary" onClick={() => updateQuantity(STATE_KEY, 0)}>
          Volver a editar mi pedido
        </button>

        {/* Realtime Tiny Totalizer */}
        <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #eee' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>Total acumulado en vivo: {grandTotal} empanadas</p>
        </div>
      </div>
    )
  }

  return (
    <div className="glass-panel" style={{ paddingBottom: '10rem', position: 'relative', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ margin: 0 }}>Sala de Pedido</h2>
        <button className="btn-success" onClick={copyLink} style={{ padding: '0.5rem 1rem' }}>
          {copyStatus}
        </button>
      </div>
      
      <p>Hola <strong>{userName}</strong>, elegí tus gustos:</p>

      <div className="list-container" style={{ maxHeight: 'none' }}>
        {allFlavors.map(flavor => {
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

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem' }}>
        <input 
          type="text" 
          placeholder="Otro gusto..." 
          value={newFlavor} 
          onChange={e => setNewFlavor(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddCustomFlavor()}
          style={{ flex: 1 }}
        />
        <button className="btn-primary" style={{ marginTop: 0, width: 'auto' }} onClick={handleAddCustomFlavor}>
          Ok
        </button>
      </div>

      <button 
        className="btn-primary" 
        style={{ background: 'var(--success)', color: 'white', fontSize: '1.2rem', padding: '1.2rem' }}
        onClick={() => updateQuantity(STATE_KEY, 1)}
      >
        Terminar mi pedido
      </button>

      {/* Ticking Totalizer (Bottom Fixed) */}
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
