import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from 'sonner';

export default function Layout() {
  return (
    <div className="min-h-screen bg-surface-0 dot-grid relative">
      <div className="grain-overlay" />
      <Navbar />
      <main className="container mx-auto px-4 py-10 max-w-6xl relative z-10">
        <Outlet />
      </main>
      <footer className="relative z-10 border-t border-surface-3 py-8">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-dotnet-purple to-dotnet-purple-light opacity-60" />
            <p className="font-mono text-xs text-surface-4 tracking-wider uppercase">
              Rodrigo Landim &copy; {new Date().getFullYear()}
            </p>
          </div>
          <p className="font-mono text-xs text-surface-4">
            <span className="text-dotnet-cyan opacity-50">{'>'}</span>{' '}
            Feito com .NET & React
          </p>
        </div>
      </footer>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            background: '#111118',
            border: '1px solid rgba(123, 92, 240, 0.15)',
            color: '#e8e6f0',
            fontFamily: 'Lexend, sans-serif',
          },
        }}
      />
    </div>
  );
}
