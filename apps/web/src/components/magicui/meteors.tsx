'use client';

import type React from 'react';
import { useEffect, useState } from 'react';

import { cn } from '@lamp/ui/lib/utils';

interface MeteorsProps {
  number?: number;
}

const Meteors = ({ number = 20 }: MeteorsProps) => {
  const [meteorStyles, setMeteorStyles] = useState<React.CSSProperties[]>([]);

  useEffect(() => {
    const styles = [...new Array(number)].map(() => ({
      top: -5,
      left: `${Math.floor(Math.random() * window.innerWidth)}px`,
      animationDelay: `${Math.random() * 1 + 0.2}s`,
      animationDuration: `${Math.floor(Math.random() * 8 + 2)}s`,
    }));
    setMeteorStyles(styles);
  }, [number]);

  return (
    <>
      {[...meteorStyles].map((style, idx) => (
        // Meteor Head
        <span
          key={idx}
          className={cn(
            'pointer-events-none absolute top-1/2 left-1/2 size-0.5 rotate-[215deg] animate-meteor rounded-full bg-slate-500 shadow-[0_0_0_1px_#ffffff10]'
          )}
          style={style}
        >
          {/* Meteor Tail */}
          <div className="-z-10 -translate-y-1/2 pointer-events-none absolute top-1/2 h-px w-[50px] bg-gradient-to-r from-slate-500 to-transparent" />
        </span>
      ))}
    </>
  );
};

export { Meteors };
