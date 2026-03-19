import './globals.css'

export const metadata = {
  title: 'FC Friendlies Tracker',
  description: 'Track your EA FC 26 online friendlies matches, ELO ratings, and tournaments',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
