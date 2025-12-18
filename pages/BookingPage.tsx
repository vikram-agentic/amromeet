import React, { useEffect, useState } from 'react';
import { CalendarWidget } from '../components/CalendarWidget';
import { useSearchParams } from 'react-router-dom';
import { useTheme } from '../utils/theme';

export const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const { toggleTheme, theme } = useTheme();
  const [targetTheme, setTargetTheme] = useState<'light' | 'dark' | null>(null);

  useEffect(() => {
    const urlTheme = searchParams.get('theme') as 'light' | 'dark' | null;

    if (urlTheme) {
      setTargetTheme(urlTheme);
      if (urlTheme !== theme) {
        toggleTheme();
      }
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 flex flex-col items-center justify-center transition-colors duration-300">
      {/* Logo - Non-clickable when embedded */}
      <div className="mb-12 font-display font-bold text-3xl tracking-tighter pointer-events-none select-none">
        <span className="gradient-text">AMRO</span><span className="text-amro-500">MEET</span>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-5xl">
        {/* Calendar Widget */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
          <CalendarWidget />
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-12 text-center text-muted-foreground text-sm">
        Powered by <span className="font-bold text-foreground">Amromeet</span>
      </div>
    </div>
  );
};