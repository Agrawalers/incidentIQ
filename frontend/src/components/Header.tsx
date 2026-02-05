import { motion } from 'framer-motion';
import { Shield, Zap } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-8 mb-6 relative"
    >
      {/* Theme toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="relative mb-4"
        >
          <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-amber-500"
          >
            <Zap className="w-3 h-3 text-white" />
          </motion.div>
        </motion.div>

        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          IncidentIQ
        </h1>
        <p className="text-lg text-muted-foreground font-medium mb-1">
          Autonomous Incident Response AI Agent
        </p>
        <p className="text-sm text-muted-foreground/70">
          Reasoning, Evidence, and Safety First
        </p>
      </div>
    </motion.header>
  );
}
