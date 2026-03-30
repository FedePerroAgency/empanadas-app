import './globals.css'

export const metadata = {
  title: '¡Noche de Empanadas!',
  description: 'Aplicación para pedir empanadas entre amigos',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
