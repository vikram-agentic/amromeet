import React from 'react';
import { motion } from 'framer-motion';
import { CalendarWidget } from '../components/CalendarWidget';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { Layout } from '../components/Layout';

export const Home = () => {
  return (
    <Layout>
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-amro-500/30 bg-amro-500/10 text-amro-600 dark:text-amro-400 text-xs font-bold tracking-widest uppercase mb-6">
              The Next Gen Scheduling
            </span>
            <h1 className="text-6xl md:text-8xl font-display font-bold text-slate-900 dark:text-white tracking-tighter mb-8">
              Scheduling on <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amro-500 to-purple-600">Autopilot.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
              Experience the ultra-premium booking platform. 
              Seamless Google Meet integration, minimalistic design, and exclusive aesthetics.
            </p>
            
            <div className="flex flex-col md:flex-row justify-center gap-4">
              <Link to="/dashboard">
                <button className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-full font-bold text-lg hover:scale-105 transition-transform shadow-2xl shadow-purple-500/20">
                  Get Started Free
                </button>
              </Link>
              <button className="px-8 py-4 bg-transparent border border-slate-300 dark:border-white/20 text-slate-900 dark:text-white rounded-full font-bold text-lg hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                View Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-white/50 dark:bg-white/5 backdrop-blur-sm border-y border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
           <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl hover:translate-y-[-5px] transition-transform">
              <div className="w-12 h-12 bg-amro-100 dark:bg-amro-900/30 rounded-xl flex items-center justify-center text-amro-600 dark:text-amro-400 mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-4">Lightning Fast</h3>
              <p className="text-slate-500 dark:text-slate-400">Zero latency booking experience powered by edge networks and optimized React rendering.</p>
           </div>
           <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl hover:translate-y-[-5px] transition-transform">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
                <Shield size={24} />
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-4">Enterprise Secure</h3>
              <p className="text-slate-500 dark:text-slate-400">Bank-grade encryption for all your data. We prioritize privacy and security above all else.</p>
           </div>
           <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl hover:translate-y-[-5px] transition-transform">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                <Globe size={24} />
              </div>
              <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-4">Global Sync</h3>
              <p className="text-slate-500 dark:text-slate-400">Automatic timezone detection and multi-calendar synchronization to prevent double bookings.</p>
           </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="py-32 px-6">
         <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
               <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4">Try it right now.</h2>
               <p className="text-slate-600 dark:text-slate-400">Interact with the live widget below.</p>
            </div>
            
            <div className="relative z-10">
               <div className="absolute inset-0 bg-amro-500/20 blur-[100px] -z-10 rounded-full" />
               <CalendarWidget />
            </div>
         </div>
      </section>
    </div>
    </Layout>
  );
};