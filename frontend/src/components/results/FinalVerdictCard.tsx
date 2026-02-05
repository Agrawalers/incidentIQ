import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gavel, Zap, UserCheck, ChevronRight, Copy, Check } from 'lucide-react';
import { FinalVerdict } from '@/types/incident';
import { Button } from '@/components/ui/button';

interface FinalVerdictCardProps {
  data: FinalVerdict;
}

const confidenceConfig = {
  high: {
    color: 'from-emerald-500 to-emerald-600',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    bgLight: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    label: 'High Confidence',
  },
  medium: {
    color: 'from-amber-500 to-amber-600',
    textColor: 'text-amber-600 dark:text-amber-400',
    bgLight: 'bg-amber-50 dark:bg-amber-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    label: 'Medium Confidence',
  },
  low: {
    color: 'from-red-500 to-red-600',
    textColor: 'text-red-600 dark:text-red-400',
    bgLight: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    label: 'Low Confidence',
  },
};

export function FinalVerdictCard({ data }: FinalVerdictCardProps) {
  const [copied, setCopied] = useState(false);
  const config = confidenceConfig[data.confidence_level];
  const isAutoApply = data.recommended_action === 'auto_apply_fix';

  const handleCopy = async () => {
    const text = `
Final Verdict: ${config.label}
Recommended Action: ${isAutoApply ? 'Auto-Apply Fix' : 'Human Review Required'}
Reason: ${data.reason}
    `.trim();

    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className={`glass-card p-8 border-2 ${config.border}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            initial={{ rotate: -20 }}
            animate={{ rotate: 0 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className={`p-3 rounded-xl bg-gradient-to-br ${config.color}`}
          >
            <Gavel className="w-6 h-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-foreground">Final Verdict</h3>
            <p className={`text-sm font-medium ${config.textColor}`}>
              {config.label}
            </p>
          </div>
        </div>

        {/* Copy button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="rounded-full hover:bg-muted"
        >
          {copied ? (
            <Check className="w-4 h-4 text-emerald-500" />
          ) : (
            <Copy className="w-4 h-4 text-muted-foreground" />
          )}
        </Button>
      </div>

      {/* Action Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className={`p-6 rounded-xl mb-6 ${
          isAutoApply 
            ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20 border border-emerald-200 dark:border-emerald-800' 
            : 'bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 border border-amber-200 dark:border-amber-800'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${isAutoApply ? 'bg-emerald-500' : 'bg-amber-500'}`}>
            {isAutoApply ? (
              <Zap className="w-6 h-6 text-white" />
            ) : (
              <UserCheck className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="flex-1">
            <p className={`text-lg font-bold ${isAutoApply ? 'text-emerald-800 dark:text-emerald-200' : 'text-amber-800 dark:text-amber-200'}`}>
              {isAutoApply ? 'Auto-Apply Fix Recommended' : 'Human Review Required'}
            </p>
            <p className={`text-sm ${isAutoApply ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
              {isAutoApply
                ? 'This incident can be safely resolved automatically'
                : 'Manual verification is recommended before proceeding'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Reasoning */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-foreground mb-2">AI Reasoning</h4>
        <p className="text-muted-foreground leading-relaxed">
          {data.reason}
        </p>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          className={`gap-2 text-white rounded-xl px-6 shadow-lg transition-transform hover:scale-105 ${
            isAutoApply 
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-emerald-500/20' 
              : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-amber-500/20'
          }`}
        >
          {isAutoApply ? 'Apply Fix Now' : 'Start Review'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
