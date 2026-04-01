"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, PlusCircle } from "lucide-react"

export default function App() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const crearSala = async () => {
    setLoading(true)
    try {
      const newId = crypto.randomUUID()

      const { data, error } = await supabase
        .from('salas')
        .insert([{ id: newId, nombre_sala: 'Sala de Pedido' }])
        .select()
        .single()

      if (error) throw error

      const salaId = data?.id || newId
      router.push(`/sala/${salaId}`)
    } catch (err) {
      console.error('Error:', err)
      alert(`Error al crear la sala: ${err.message || 'Revisa la consola'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <Card className="max-w-2xl w-full glass-card border-none shadow-2xl">
        <CardHeader className="space-y-6 pt-12">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <span className="text-4xl">🥟</span>
            </div>
          </div>
          <CardTitle className="text-4xl md:text-5xl font-extrabold text-center tracking-tight">
            ¡Noche de <span className="text-primary">Empanadas!</span>
          </CardTitle>
          <CardDescription className="text-lg md:text-xl text-center max-w-md mx-auto text-slate-600">
            Organizá el pedido de empanadas sin vueltas. Compartí el link y elegí en tiempo real.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-8 pb-12">
          <p className="text-sm text-slate-500 text-center max-w-sm">
            Creá una sala única, compartí el link con tus amigos y dejá que cada uno elija sus gustos favoritos.
          </p>

          <Button
            size="lg"
            className="bg-neutral-950 w-full md:w-auto px-8 py-7 rounded-2xl text-lg font-bold shadow-xl  transition-all hover:scale-105 active:scale-95"
            onClick={crearSala}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Creando sala...
              </>
            ) : (
              <>
                Crear Sala de Pedido
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
