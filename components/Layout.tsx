import React from 'react';
import { useTheme } from '../utils/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Menu, X, ArrowRight, Cloud, Star } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-20 h-10 rounded-full transition-all duration-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] hover:shadow-[inset_0_2px_6px_rgba(0,0,0,0.2)] focus:outline-none overflow-hidden"
    >
      {/* Sky Background */}
      <motion.div
        className="absolute inset-0 flex items-center justify-between px-2"
        animate={{
          background: theme === 'light' 
            ? 'linear-gradient(180deg, #60A5FA 0%, #93C5FD 100%)' // Sky blue
            : 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)' // Deep Space
        }}
        transition={{ duration: 0.5 }}
      >
        {/* Clouds for Light Mode */}
        <motion.div 
            className="absolute top-2 left-2 text-white/90"
            animate={{ y: theme === 'light' ? 0 : 20, opacity: theme === 'light' ? 1 : 0 }}
        >
             <Cloud size={12} fill="currentColor" />
        </motion.div>
        <motion.div 
            className="absolute bottom-1 left-5 text-white/70"
            animate={{ x: theme === 'light' ? 0 : -20, opacity: theme === 'light' ? 1 : 0 }}
            transition={{ delay: 0.1 }}
        >
             <Cloud size={8} fill="currentColor" />
        </motion.div>

        {/* Stars for Dark Mode */}
        <motion.div 
            className="absolute top-2 right-4 text-yellow-100"
            animate={{ scale: theme === 'dark' ? 1 : 0, opacity: theme === 'dark' ? 1 : 0 }}
        >
             <Star size={8} fill="currentColor" />
        </motion.div>
        <motion.div 
            className="absolute bottom-2 right-7 text-yellow-100"
            animate={{ scale: theme === 'dark' ? 1 : 0, opacity: theme === 'dark' ? 1 : 0 }}
             transition={{ delay: 0.1 }}
        >
             <Star size={4} fill="currentColor" />
        </motion.div>
        <motion.div 
            className="absolute top-1 right-8 text-white/50"
            animate={{ scale: theme === 'dark' ? 1 : 0, opacity: theme === 'dark' ? 1 : 0 }}
             transition={{ delay: 0.2 }}
        >
             <Star size={3} fill="currentColor" />
        </motion.div>
      </motion.div>

      {/* The Sun/Moon Knob */}
      <motion.div
        className="absolute top-1 left-1 w-8 h-8 rounded-full shadow-lg flex items-center justify-center z-10 overflow-hidden"
        layout
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
        animate={{
          x: theme === 'dark' ? 40 : 0,
          backgroundColor: theme === 'light' ? '#FDB813' : '#E2E8F0',
          boxShadow: theme === 'light' ? '0 0 10px #FDB813' : '0 0 10px rgba(255,255,255,0.3)'
        }}
      >
          {/* Crater Effect for Moon (Overlay) */}
          <motion.div
             className="absolute w-full h-full rounded-full bg-slate-800"
             initial={{ x: 30 }}
             animate={{ x: theme === 'dark' ? 10 : 30 }} 
             transition={{ duration: 0.5 }}
          />
      </motion.div>
    </button>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const isBookingPage = location.pathname.includes('/book/');

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-500">
      {!isBookingPage && (
        <nav className="fixed w-full z-50 top-0 left-0 backdrop-blur-md bg-white/70 dark:bg-black/70 border-b border-slate-200 dark:border-white/10 transition-all duration-300">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-amro-500 rounded-lg p-2 text-white transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-amro-500/20">
                <Calendar size={24} strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-2xl tracking-tighter text-slate-900 dark:text-white">
                AMRO<span className="text-amro-500">MEET</span>
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-medium hover:text-amro-500 transition-colors">Product</Link>
              <Link to="/dashboard" className="text-sm font-medium hover:text-amro-500 transition-colors">Dashboard</Link>
              <a href="#" className="text-sm font-medium hover:text-amro-500 transition-colors">Integration</a>
              <div className="pl-4 border-l border-slate-200 dark:border-slate-800">
                <ThemeToggle />
              </div>
              <Link to="/dashboard">
                <button className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black font-semibold rounded-full text-sm hover:scale-105 transition-transform duration-200 flex items-center gap-2 shadow-xl shadow-slate-900/10 dark:shadow-white/10">
                  Get Started <ArrowRight size={16} />
                </button>
              </Link>
            </div>

            <div className="md:hidden flex items-center gap-4">
               <ThemeToggle />
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </nav>
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white dark:bg-black pt-24 px-6 md:hidden"
          >
            <div className="flex flex-col gap-6 text-xl font-display font-medium">
              <Link to="/" onClick={() => setIsMenuOpen(false)}>Product</Link>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={`flex-grow ${!isBookingPage ? 'pt-20' : ''} relative`}>
         {/* Background Ambient Glows */}
         <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 dark:bg-purple-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-amro-500/20 dark:bg-amro-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
            <div className="absolute top-[40%] left-[40%] w-[600px] h-[600px] bg-blue-500/20 dark:bg-blue-900/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
         </div>
        {children}
      </main>

      {!isBookingPage && (
        <footer className="py-12 border-t border-slate-200 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 text-center md:text-left flex flex-col md:flex-row justify-between items-center opacity-60">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
               <span className="font-display font-bold text-lg">AMROMEET</span>
               <span className="text-xs">© 2024 Modern Replica Inc.</span>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:underline">Privacy</a>
              <a href="#" className="hover:underline">Terms</a>
              <a href="#" className="hover:underline">Status</a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};