"use client";

import React, { useState, useEffect } from 'react';
import { PawPrint } from 'lucide-react';
import { cn } from '@/lib/utils';

type ParticlesProps = {
  className?: string;
  quantity?: number;
};

const EMOJIS = ["🐱", "🐶", "🐾", "🐈", "🐕"];

export function Particles({ className, quantity = 30 }: ParticlesProps) {
  const [particles, setParticles] = useState<
    {
      id: number;
      style: React.CSSProperties;
      content: React.ReactNode;
    }[]
  >([]);

  useEffect(() => {
    const newParticles = Array.from({ length: quantity }).map((_, i) => {
      const chosen = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      return {
        id: i,
        style: {
          left: `${Math.random() * 100}%`,
          animationDuration: `${Math.random() * 5 + 8}s`,
          animationDelay: `${Math.random() * 5}s`,
          opacity: Math.random() * 0.2 + 0.1,
          fontSize: `${Math.floor(Math.random() * 20) + 10}px`,
        },
        content: chosen === '🐾' ? <PawPrint /> : chosen,
      };
    });
    setParticles(newParticles);
  }, [quantity]);

  return (
    <div className={cn('w-full h-full overflow-hidden', className)}>
      {particles.map((particle) => (
         <div
          key={particle.id}
          className="particle"
          style={particle.style}
        >
          {particle.content}
        </div>
      ))}
    </div>
  );
}
