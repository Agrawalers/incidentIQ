import { motion } from 'framer-motion';
import { Send, Loader2, Shield, Zap } from 'lucide-react';

import { Textarea } from '@/components/ui/textarea';

interface IncidentInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function IncidentInput({ value, onChange, onSubmit, isLoading }: IncidentInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-8 backdrop-blur-md border border-border/60"
    >
      {/* Header Section */}
      <div className="flex flex-col items-center text-center mb-8">
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
        <p className="text-sm text-muted-foreground/70 mb-6">
          Reasoning, Evidence, and Safety First
        </p>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Incident Log Input
          </h2>
          <span className="text-xs text-muted-foreground">
            {value.length} characters
          </span>
        </div>

        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste an incident log, error message, or alert here…"
          className="min-h-[160px] resize-none bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground transition-all font-mono text-sm"
          disabled={isLoading}
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            ⌘ + Enter to analyze
          </span>
          <Button
            onClick={onSubmit}
            disabled={!value.trim() || isLoading}
            size="lg"
            className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl px-6 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Analyze Incident
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
