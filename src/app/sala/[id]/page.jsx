/* src/app/sala/[id]/page.jsx */
"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Plus,
  Minus,
  Share2,
  Check,
  MessageSquare,
  ChevronLeft,
  Loader2,
  User,
  ShoppingBag,
  ListRestart
} from "lucide-react"

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
  const router = useRouter()

  const [userName, setUserName] = useState('')
  const [hasName, setHasName] = useState(false)
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [copyStatus, setCopyStatus] = useState('Copiar Link')
  const [newFlavor, setNewFlavor] = useState('')
  const [summariesCopyStatus, setSummariesCopyStatus] = useState('WhatsApp')

  useEffect(() => {
    if (!salaId) return;

    const storedName = sessionStorage.getItem('empanadas_user_name')
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
    sessionStorage.setItem('empanadas_user_name', userName.trim())
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
    const customFlavors = new Set(pedidos.filter(p => p.gusto !== STATE_KEY).map(p => {
      // Only include non-empty flavors and ensure it's not the STATE_KEY
      return p.gusto;
    }))

    FLAVORS.forEach(f => customFlavors.delete(f))
    return [...FLAVORS, ...Array.from(customFlavors)].filter(f => f && f !== STATE_KEY);
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
      setTimeout(() => setSummariesCopyStatus('WhatsApp'), 2000);
    } catch (err) {
      console.error('Error copying', err);
    }
  }

  // --- RENDERING ---

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 text-primary animate-spin" />
          <p className="text-slate-500 font-medium">Cargando sala...</p>
        </div>
      </div>
    )
  }

  if (!hasName) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <Card className="w-full max-w-md shadow-2xl glass-card animate-in border-none">
          <CardHeader className="text-center pt-8">
            <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <User className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">¿Cómo te llamas?</CardTitle>
            <CardDescription>
              Ingresá tu nombre para unirte al pedido grupal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pb-8">
            <Input
              type="text"
              placeholder="Ej: Federico"
              value={userName}
              onChange={e => setUserName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveName()}
              autoFocus
              className="py-6 text-lg rounded-xl focus-visible:ring-primary"
            />
            <Button className="w-full py-6 rounded-xl text-lg font-semibold" onClick={saveName} disabled={!userName.trim()}>
              Entrar a la sala
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (allReady) {
    return (
      <main className="min-h-screen bg-slate-50 pb-20 p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="shadow-xl glass-card animate-in border-none overflow-hidden">
            <div className="bg-primary p-6 text-white text-center">
              <Check className="mx-auto h-12 w-12 mb-2 p-2 bg-white/20 rounded-full" />
              <CardTitle className="text-3xl font-bold">Pedido Cerrado</CardTitle>
              <p className="text-white/80">Todos han terminado su elección.</p>
            </div>

            <CardContent className="p-8 space-y-8">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-bold">Total General ({grandTotal})</h3>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 space-y-2 border">
                  {Object.entries(totalsByFlavor).filter(([_, qty]) => qty > 0).map(([flavor, qty]) => (
                    <div key={flavor} className="flex justify-between items-center py-2 px-2 border-b last:border-0 border-slate-100">
                      <span className="font-medium text-slate-700">{flavor}</span>
                      <Badge variant="secondary" className="text-lg py-0 px-3 bg-white border shadow-sm font-bold">{qty}</Badge>
                    </div>
                  ))}
                </div>
              </section>

              <Separator />

              <section>
                <h3 className="text-lg font-semibold mb-4 text-slate-600">Detalle por Persona</h3>
                <div className="grid gap-4">
                  {participants.map(name => {
                    const orders = pedidos.filter(p => p.nombre_persona === name && p.gusto !== STATE_KEY && p.cantidad > 0);
                    return (
                      <div key={name} className="flex flex-col p-4 bg-white rounded-xl border shadow-sm">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-slate-900">{name}</span>
                          <Badge className="bg-green-100 text-green-700 border-green-200">✓ Listo</Badge>
                        </div>
                        <p className="text-sm text-slate-500 italic">
                          {orders.length > 0 ? orders.map(o => `${o.cantidad} ${o.gusto}`).join(', ') : 'No pidió nada'}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </section>
            </CardContent>

            <CardFooter className="bg-slate-50 p-8 flex flex-col gap-3">
              <Button className="w-full py-7 rounded-2xl text-lg font-bold gap-2 shadow-lg" onClick={copyFinalSummary}>
                <MessageSquare className="h-6 w-6" />
                {summariesCopyStatus.includes('Copiado') ? '✓ Copiado' : 'Compartir pedido por WhatsApp'}
              </Button>
              <div className="grid grid-cols-2 gap-3 w-full">
                <Button 
                  variant="outline" 
                  className="py-6 rounded-xl hover:bg-black hover:text-white" 
                  onClick={() => {
                    sessionStorage.removeItem('empanadas_user_name');
                    router.push('/');
                  }}
                >
                  Volver al Inicio
                </Button>
                <Button variant="ghost" className="py-6 rounded-xl text-slate-400 hover:text-slate-600" onClick={() => updateQuantity(STATE_KEY, 0)}>
                  <ListRestart className="h-4 w-4 mr-2" />
                  Reabrir sala
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    )
  }

  if (isReady) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg shadow-2xl glass-card animate-in border-none">
          <CardHeader className="text-center pt-10">
            <div className="mx-auto bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-3xl font-bold">¡Listo por aquí!</CardTitle>
            <CardDescription className="text-lg">
              Esperando a que los demás completen su pedido...
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <div className="bg-slate-50 border rounded-2xl p-6 mb-8">
              <h4 className="text-xs uppercase font-bold text-slate-400 tracking-widest mb-4">Tu selección</h4>
              <div className="space-y-3">
                {myOrdersRaw.filter(p => p.cantidad > 0).map(p => (
                  <div key={p.gusto} className="flex justify-between items-center border-b border-slate-100 pb-2 last:border-0">
                    <span className="font-semibold text-slate-700">{p.gusto}</span>
                    <Badge className="bg-white border text-primary font-bold shadow-sm">{p.cantidad}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-slate-600 mb-3">Estado de la sala</h4>
              <div className="flex flex-wrap gap-2">
                {participants.map(name => {
                  const ready = pedidos.find(p => p.nombre_persona === name && p.gusto === STATE_KEY)?.cantidad === 1;
                  return (
                    <Badge
                      key={name}
                      variant={ready ? "default" : "outline"}
                      className={`px-4 py-2 rounded-full border-none shadow-sm ${ready ? 'bg-primary text-white' : 'bg-white text-slate-400'}`}
                    >
                      {name} {ready && <Check className="ml-1 h-3 w-3" />}
                    </Badge>
                  )
                })}
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-8">
            <Button variant="secondary" className="w-full py-6 rounded-xl hover:bg-slate-100" onClick={() => updateQuantity(STATE_KEY, 0)}>
              Cambiar mi elección
            </Button>
          </CardFooter>
        </Card>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 pb-32">
      <div className="max-w-4xl mx-auto px-4 pt-8 md:pt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Sala de <span className="text-primary">Pedido</span></h2>
            <p className="text-slate-500 text-lg mt-1">Hola <span className="font-bold text-slate-700">@{userName}</span>, ¿qué vas a pedir hoy?</p>
          </div>
          <Button
            variant="outline"
            className="rounded-full px-6 py-6 shadow-sm hover:shadow-md transition-all gap-2 bg-white border-none text-slate-600 font-bold"
            onClick={copyLink}
          >
            {copyStatus.includes('Copiado') ? <Check className="h-5 w-5 text-green-500" /> : <Share2 className="h-5 w-5" />}
            {copyStatus}
          </Button>
        </div>

        <Card className="border-none shadow-xl glass-card overflow-hidden">
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-100">
              {allFlavors.map(flavor => {
                const qty = getMyQty(flavor)
                return (
                  <div key={flavor} className="bg-white p-6 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                    <span className="font-bold text-slate-800 text-lg">{flavor}</span>
                    <div className="flex items-center gap-4 bg-slate-100/50 p-1 rounded-full border border-slate-100 shadow-inner">
                      <Button
                        size="icon"
                        variant="ghost"
                        className={`h-10 w-10 rounded-full ${qty === 0 ? 'opacity-20 pointer-events-none' : 'text-primary'}`}
                        onClick={() => updateQuantity(flavor, -1)}
                      >
                        <Minus className="h-5 w-5" />
                      </Button>
                      <span className="w-6 text-center font-black text-xl text-slate-900">{qty}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-10 w-10 rounded-full text-primary"
                        onClick={() => updateQuantity(flavor, 1)}
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
          <CardFooter className="p-8 bg-white border-t border-slate-100 md:flex md:gap-4 md:items-center flex-col md:flex-row space-y-4 md:space-y-0">
            <div className="flex-1 flex gap-3 w-full">
              <Input
                type="text"
                placeholder="¿Otro gusto?"
                value={newFlavor}
                onChange={e => setNewFlavor(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddCustomFlavor()}
                className="py-6 rounded-xl text-lg focus-visible:ring-primary shadow-inner bg-slate-50 border-none"
              />
              <Button variant="secondary" className="py-6 px-6 font-bold rounded-xl" onClick={handleAddCustomFlavor}>
                Agregar
              </Button>
            </div>
            <Button className="bg-neutral-950 w-full md:w-auto py-6 px-10 rounded-xl text-lg font-black shadow-lg" onClick={() => updateQuantity(STATE_KEY, 1)}>
              Terminar mi pedido
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* STICKY BOTTOM BAR */}
      <footer className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-xl border-t border-slate-100 p-6 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="bg-primary/10 p-3 rounded-2xl">
              <ShoppingBag className="h-8 w-8 text-primary" />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-slate-400 tracking-widest">Total acumulado</span>
              <h3 className="text-3xl font-black text-slate-900 leading-tight">{grandTotal} <span className="text-lg font-medium text-slate-500">empanadas</span></h3>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto pr-2 scrollbar-hide">
            {Object.entries(totalsByFlavor).filter(([_, qty]) => qty > 0).map(([f, qty]) => (
              <Badge key={f} className="bg-slate-100 hover:bg-slate-200 text-slate-700 border-none shadow-sm font-bold px-3 py-1 rounded-lg">
                {qty} {f}
              </Badge>
            ))}
            {grandTotal === 0 && <span className="text-slate-400 font-medium italic">Nadie ha pedido nada aún...</span>}
          </div>
        </div>
      </footer>
    </main>
  )
}
