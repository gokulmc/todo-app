import "./globals.css";

export const metadata = {
  title: "Todo App",
  description: "A fullstack todo app with Next.js and SQLite",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
