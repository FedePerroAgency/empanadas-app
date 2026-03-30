/* src/app/sala/[id]/page.jsx */
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

  useEffect(() => {
    if (!salaId) return;

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

      if (!error && data) setPedidos(data)
      setLoading(false)
    }

    fetchPedidos()

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
      setCopyStatus('Error')
      setTimeout(() => setCopyStatus('Copiar Link'), 2000)
    }
  }

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
      await supabase.from('pedidos').update({ cantidad: newQty }).eq('id', existingOrder.id)
    } else {
      await supabase.from('pedidos').insert([{
        sala_id: salaId,
        nombre_persona: userName,
        gusto: flavor,
        cantidad: newQty
      }])
    }
  }

  const handleAddCustomFlavor = () => {
    if (!newFlavor.trim()) return;
    updateQuantity(newFlavor.trim(), 1);
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
        totals[p.gusto] = (totals[p.gusto] || 0) + p.cantidad
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
      console.error('Error copying', err);
    }
  }

  // --- RENDERING ---

  if (loading) {
    return (
      <div className="main-wrapper">
        <div className="glass-panel text-center" style={{ paddingTop: '10rem' }}>
          <h2 className="animate-pulse">Cargando sala...</h2>
        </div>
      </div>
    )
  }

  if (!hasName) {
    return (
      <div className="main-wrapper">
        <div className="glass-panel" style={{ paddingTop: '5rem' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>¿Cómo te llamas?</h2>
          <p style={{ marginBottom: '2rem' }}>Ingresá tu nombre para unirte al pedido.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Ej: Federico"
              value={userName}
              onChange={e => setUserName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveName()}
              autoFocus
            />
            <button className="btn-primary" onClick={saveName} style={{ padding: '1rem' }}>
              Entrar a la sala
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (allReady) {
    return (
      <div className="main-wrapper">
        <div className="glass-panel animate-in">
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ marginBottom: '0.25rem' }}>Pedido Cerrado</h1>
            <p>Aquí está el resumen final de la sala:</p>
          </div>
          <div className="summary-block">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Total General ({grandTotal} empanadas)</h3>
            {Object.entries(totalsByFlavor).filter(([_, qty]) => qty > 0).map(([flavor, qty]) => (
              <div key={flavor} className="summary-row">
                <span style={{ fontWeight: 500 }}>{flavor}</span>
                <strong>{qty}</strong>
              </div>
            ))}
          </div>
          <div className="summary-block">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Detalle por Persona</h3>
            {participants.map(name => {
              const orders = pedidos.filter(p => p.nombre_persona === name && p.gusto !== STATE_KEY && p.cantidad > 0);
              return (
                <div key={name} style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600 }}>{name}</span>
                    <span className="status-badge active" style={{ fontSize: '0.7rem' }}>✓ Listo</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {orders.length > 0 ? orders.map(o => `${o.cantidad} ${o.gusto}`).join(', ') : 'No pidió nada'}
                  </div>
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
            <button className="btn-success" onClick={copyFinalSummary} style={{ padding: '1.25rem' }}>
              {summariesCopyStatus.includes('Copiado') ? '✓ Copiado' : 'Compartir pedido por WhatsApp'}
            </button>
            <button className="btn-secondary" onClick={() => window.location.href = '/'} style={{ padding: '1rem' }}>Volver al Inicio</button>
            <button className="btn-secondary" style={{ padding: '0.75rem', background: 'transparent', fontSize: '0.85rem' }} onClick={() => updateQuantity(STATE_KEY, 0)}>Reabrir sala</button>
          </div>
        </div>
      </div>
    )
  }

  if (isReady) {
    return (
      <div className="main-wrapper">
        <div className="glass-panel animate-in">
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>¡De tu parte está listo!</h2>
            <p>Esperando a que los demás terminen...</p>
          </div>
          <div className="summary-block" style={{ borderTop: 'none', background: '#F9F9F9', borderRadius: '12px', padding: '1.25rem', marginBottom: '2rem' }}>
            <h4 style={{ marginBottom: '0.75rem', fontSize: '0.9rem', textTransform: 'uppercase' }}>Tu elección</h4>
            {myOrdersRaw.filter(p => p.cantidad > 0).map(p => (
              <div key={p.gusto} className="summary-row" style={{ borderBottom: '1px solid #EEE', padding: '0.75rem 0' }}>
                <span style={{ fontWeight: 500 }}>{p.gusto}</span>
                <strong>{p.cantidad}</strong>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: '3rem' }}>
            <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem' }}>Estado de la sala</h4>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {participants.map(name => {
                const ready = pedidos.find(p => p.nombre_persona === name && p.gusto === STATE_KEY)?.cantidad === 1;
                return (
                  <div key={name} className={`status-badge ${ready ? 'active' : ''}`} style={{ padding: '0.5rem 1rem' }}>{name} {ready ? '✓' : ''}</div>
                )
              })}
            </div>
          </div>
          <button className="btn-secondary" onClick={() => updateQuantity(STATE_KEY, 0)} style={{ width: '100%', padding: '1rem' }}>Cambiar mi elección</button>
        </div>
      </div>
    )
  }

  return (
    <div className="main-wrapper">
      <div className="glass-panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ margin: 0 }}>Sala de Pedido</h2>
          <button className="status-badge active" onClick={copyLink} style={{ cursor: 'pointer', border: 'none' }}>
            {copyStatus.includes('Copiado') ? '✓ Enlace Copiado' : '🔗 Copiar Link'}
          </button>
        </div>
        <p style={{ marginBottom: '1.5rem' }}>Hola <strong>{userName}</strong>, ¿qué vas a pedir hoy?</p>
        <div className="list-container">
          {allFlavors.map(flavor => {
            const qty = getMyQty(flavor)
            return (
              <div key={flavor} className="list-item">
                <span style={{ fontWeight: 500, fontSize: '1.05rem' }}>{flavor}</span>
                <div className="counter-control">
                  <button className="btn-icon" onClick={() => updateQuantity(flavor, -1)} disabled={qty === 0} style={{ opacity: qty === 0 ? 0.3 : 1 }}>−</button>
                  <span className="counter-value">{qty}</span>
                  <button className="btn-icon" onClick={() => updateQuantity(flavor, 1)}>+</button>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', margin: '3rem 0 1.5rem 0' }}>
          <input type="text" placeholder="¿Otro gusto?" value={newFlavor} onChange={e => setNewFlavor(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddCustomFlavor()} style={{ flex: 1 }} />
          <button className="btn-secondary" onClick={handleAddCustomFlavor}>Agregar</button>
        </div>

        <button className="btn-primary" onClick={() => updateQuantity(STATE_KEY, 1)} style={{ padding: '1.25rem', fontSize: '1.1rem', borderRadius: '12px' }}>Terminar mi pedido</button>

        <div className="bottom-bar">
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase' }}>Total acumulado</span>
              <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{grandTotal} empanadas</h3>
            </div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', maxHeight: '60px', overflowY: 'auto' }}>
            {Object.entries(totalsByFlavor).filter(([_, qty]) => qty > 0).map(([f, qty]) => (
              <div key={f} className="status-badge" style={{ background: '#F3F3F3', color: '#000' }}>{qty} {f}</div>
            ))}
          </div>
        </div>
      </div>
    </div >
  )
}
