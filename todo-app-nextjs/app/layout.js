import './globals.css'

// Metadata is a Next.js feature — sets the <title> and <meta description> tags
// This runs on the server, never sent as JS to the browser
export const metadata = {
  title: 'Todo App',
  description: 'A simple todo app built with Next.js',
}

// RootLayout wraps every page in the app
// `children` is whatever page.js returns
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
