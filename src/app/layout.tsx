import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import ClientProviders from '@/components/ClientProviders';

export const metadata: Metadata = {
  title: 'AllCollegeEvent.ai | AI-Driven Collegiate Opportunity Ecosystem',
  description: 'AI-Powered Event Discovery, Personalized Recommendations & Real-Time Intelligence for Collegiate Innovators',
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
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased text-slate-100 bg-[#060911]">
        {/* Dynamic Multi-Color Ambient Aura Lighting */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px]" />
          <div className="absolute top-[25%] right-[5%] w-[500px] h-[500px] bg-cyan-500/12 rounded-full blur-[130px]" />
          <div className="absolute top-[60%] left-[-5%] w-[550px] h-[550px] bg-indigo-600/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-10%] right-[20%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px]" />
        </div>
        
        <ClientProviders>
          <header className="relative z-40">
            <Navbar />
          </header>

          <main className="relative z-10 flex-1">
            {children}
          </main>

          <footer className="relative z-10 border-t border-slate-800/80 bg-[#060911]/95 backdrop-blur-xl py-8 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-medium text-slate-300">AllCollegeEvent<span className="text-cyan-400">.ai</span></span>
                <span className="text-slate-500">• 2,000+ Verified Collegiate Opportunities</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-slate-500">Autonomous 5-D Hybrid Match Engine</span>
                <span className="text-purple-400 font-semibold">PostgreSQL Powered</span>
              </div>
            </div>
          </footer>
        </ClientProviders>
      </body>
    </html>
  );
}
