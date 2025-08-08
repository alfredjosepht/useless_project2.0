"use client";

import React, { useState, useEffect } from 'react';
import { PawPrint } from 'lucide-react';
import { cn } from '@/lib/utils';

type ParticlesProps = {
  className?: string;
  quantity?: number;
};

export function Particles({ className, quantity = 30 }: ParticlesProps) {
  const [particles, setParticles] = useState<
    {
      id: number;
      style: React.CSSProperties;
    }[]
  >([]);

  useEffect(() => {
    const newParticles = Array.from({ length: quantity }).map((_, i) => ({
      id: i,
      style: {
        left: `${Math.random() * 100}%`,
        animationDuration: `${Math.random() * 5 + 5}s`,
        animationDelay: `${Math.random() * 5}s`,
        opacity: Math.random() * 0.2 + 0.1,
        fontSize: `${Math.floor(Math.random() * 20) + 10}px`,
      },
    }));
    setParticles(newParticles);
  }, [quantity]);

  return (
    <div className={cn('w-full h-full overflow-hidden', className)}>
      {particles.map((particle) => (
        <PawPrint
          key={particle.id}
          className="particle text-primary/30"
          style={particle.style}
        />
      ))}
    </div>
  );
}
