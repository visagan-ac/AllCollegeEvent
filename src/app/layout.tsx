import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import ClientProviders from '@/components/ClientProviders';

export const metadata: Metadata = {
  title: 'AllCollegeEvent.com | AI-Driven Event Intelligence Platform',
  description: 'AI-Powered Event Discovery, Personalized Recommendations & Intelligence Layer for Collegiate Innovators',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased text-slate-100 bg-[#090d16]">
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl" />
        </div>
        
        <ClientProviders>
          <header className="relative z-40">
            <Navbar />
          </header>

          <main className="relative z-10 flex-1">
            {children}
          </main>

          <footer className="relative z-10 border-t border-slate-800/80 bg-[#070a11]/90 backdrop-blur-md py-8 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>AllCollegeEvent.com AI Engine v2.1 • National Opportunity Ecosystem</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-slate-500">Solution Area 2.1: AI Personalized Event Intelligence</span>
                <span className="text-purple-400">AllCollegeEvent Platform</span>
              </div>
            </div>
          </footer>
        </ClientProviders>
      </body>
    </html>
  );
}
