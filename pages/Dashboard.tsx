import React from 'react';
import { Copy, Code, ExternalLink, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard = () => {
  const embedCode = `<iframe src="${window.location.origin}/#/book/demo-user" width="100%" height="700" frameborder="0"></iframe>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    alert('Embed code copied!');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your event types and integration settings.</p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
           <button className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center gap-2">
             <Settings size={18} /> Settings
           </button>
           <button className="px-4 py-2 rounded-lg bg-amro-500 text-white font-medium hover:bg-amro-600 transition-colors">
             + New Event Type
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Event Type Card */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex-1">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="w-3 h-3 rounded-full bg-amro-500" />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Strategic Discovery Call</h3>
                 </div>
                 <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">30 min • Google Meet • 1-on-1</p>
                 <Link to="/book/demo-user" className="text-amro-600 dark:text-amro-400 text-sm font-medium hover:underline flex items-center gap-1">
                    View Booking Page <ExternalLink size={14} />
                 </Link>
              </div>
              <div className="flex items-center gap-4">
                 <div className="text-center px-4 py-2 bg-slate-50 dark:bg-black rounded-lg border border-slate-100 dark:border-slate-800">
                    <span className="block text-2xl font-bold text-slate-900 dark:text-white">12</span>
                    <span className="text-xs text-slate-500 uppercase">Bookings</span>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-amro-500"></div>
                  </label>
              </div>
           </div>

           {/* More mock cards */}
           <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm opacity-60">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-3 h-3 rounded-full bg-purple-500" />
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white">Quarterly Review</h3>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm">60 min • Zoom • Group</p>
           </div>
        </div>

        {/* Integration Sidebar */}
        <div className="bg-slate-900 dark:bg-white/5 rounded-2xl p-6 text-white border border-slate-800 dark:border-white/10">
          <div className="flex items-center gap-2 mb-6">
            <Code className="text-amro-500" />
            <h2 className="text-lg font-bold">Embed Widget</h2>
          </div>
          <p className="text-slate-400 text-sm mb-4">
            Copy the code below to integrate the Amromeet booking widget directly into your own website.
          </p>
          
          <div className="relative group">
            <pre className="bg-black/50 p-4 rounded-lg overflow-x-auto text-xs font-mono text-slate-300 border border-white/10">
              {embedCode}
            </pre>
            <button 
              onClick={copyToClipboard}
              className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors text-white opacity-0 group-hover:opacity-100"
            >
              <Copy size={14} />
            </button>
          </div>
          
          <div className="mt-8">
             <h3 className="text-sm font-bold mb-3 text-slate-200">API Status</h3>
             <div className="flex items-center gap-2 text-xs text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Google Meet API Connected
             </div>
             <p className="text-xs text-slate-500 mt-2">
               Service Account: agenticailtd@...
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};