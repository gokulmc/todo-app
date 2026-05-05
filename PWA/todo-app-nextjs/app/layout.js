import './globals.css'
import ServiceWorkerRegistration from '../components/ServiceWorkerRegistration'

export const metadata = {
  title: 'Todo App',
  description: 'A simple todo app built with Next.js',
  manifest: '/manifest.json',
}

export const viewport = {
  themeColor: '#4a2988',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  )
}
