import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Brain, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IntroAnimationProps {
  onComplete: () => void;
}

const features = [
  { icon: Brain, text: 'AI-Powered Analysis', delay: 1.5 },
  { icon: Zap, text: 'Instant Root Cause Detection', delay: 2 },
  { icon: CheckCircle, text: 'Safety-First Automation', delay: 2.5 },
];

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  // Auto-transition after animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4500); // Auto-transition after 4.5 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 overflow-hidden"
    >
      {/* Mesh gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />
      
      {/* Skip button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute top-6 right-6 z-10"
      >
        <Button
          variant="ghost"
          onClick={onComplete}
          className="text-slate-400 hover:text-white hover:bg-white/10 backdrop-blur-sm"
        >
          Skip intro
        </Button>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', duration: 1, bounce: 0.4 }}
          className="relative mb-8"
        >
          <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-2xl shadow-cyan-500/30 backdrop-blur-xl">
            <Shield className="w-16 h-16 text-white" />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            className="absolute -bottom-2 -right-2 p-2 rounded-full bg-amber-500 shadow-lg"
          >
            <Zap className="w-5 h-5 text-white" />
          </motion.div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-5xl md:text-6xl font-bold text-white mb-4 text-center"
        >
          IncidentIQ
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="text-xl text-slate-300 mb-12 text-center"
        >
          Autonomous Incident Response AI Agent
        </motion.p>

        {/* Features */}
        <div className="flex flex-col gap-4 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: feature.delay }}
              className="flex items-center gap-3 text-slate-300"
            >
              <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                <feature.icon className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-lg">{feature.text}</span>
            </motion.div>
          ))}
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="text-slate-400 text-center italic"
        >
          "Reasoning, Evidence, and Safety First"
        </motion.p>

        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 3.5, duration: 1 }}
          className="mt-8 w-48 h-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full origin-left"
        />
      </div>
    </motion.div>
  );
}
