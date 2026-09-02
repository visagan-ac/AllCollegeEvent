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
      <body className="min-h-screen flex flex-col font-sans antialiased text-slate-100 bg-[#0b0f17]">
        {/* Subtle, Calm Atmospheric Ambient Layer */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-[-10%] left-[25%] w-[500px] h-[500px] bg-indigo-500/06 rounded-full blur-[120px]" />
          <div className="absolute top-[35%] right-[10%] w-[450px] h-[450px] bg-sky-500/05 rounded-full blur-[130px]" />
          <div className="absolute bottom-[-10%] left-[10%] w-[500px] h-[500px] bg-slate-700/08 rounded-full blur-[140px]" />
        </div>
        
        <ClientProviders>
          <header className="relative z-40">
            <Navbar />
          </header>

          <main className="relative z-10 flex-1">
            {children}
          </main>

          <footer className="relative z-10 border-t border-slate-800/70 bg-[#0b0f17]/90 backdrop-blur-md py-8 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span className="font-medium text-slate-200">AllCollegeEvent<span className="text-indigo-400">.ai</span></span>
                <span className="text-slate-500">• 2,000+ Verified Opportunities</span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-slate-400">AI Personalized Event Intelligence</span>
                <span className="text-indigo-400 font-medium">PostgreSQL Powered</span>
              </div>
            </div>
          </footer>
        </ClientProviders>
      </body>
    </html>
  );
}
