import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from 'sonner';
import { Linkedin, Github, Instagram } from 'lucide-react';

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
            <p className="font-mono text-xs text-gray-400 tracking-wider uppercase">
              Rodrigo Landim &copy; {new Date().getFullYear()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://linkedin.com/in/rodrigolandim" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-dotnet-purple-light transition-colors">
              <Linkedin className="h-4 w-4" />
            </a>
            <a href="https://github.com/landim32" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-dotnet-purple-light transition-colors">
              <Github className="h-4 w-4" />
            </a>
            <a href="https://instagram.com/rodrigo_carneiro32" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-dotnet-purple-light transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
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
