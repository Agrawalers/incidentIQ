import { motion } from 'framer-motion';
import { ShieldCheck, ShieldX, CheckCircle, XCircle } from 'lucide-react';
import { ValidationResult } from '@/types/incident';

interface ValidationCardProps {
  data: ValidationResult;
}

export function ValidationCard({ data }: ValidationCardProps) {
  const isValid = data.status === 'valid';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${isValid ? 'from-emerald-500 to-green-600' : 'from-red-500 to-rose-600'}`}>
          {isValid ? (
            <ShieldCheck className="w-5 h-5 text-white" />
          ) : (
            <ShieldX className="w-5 h-5 text-white" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Safety Validation</h3>
          <span className={`text-sm font-medium ${isValid ? 'text-success' : 'text-destructive'}`}>
            {isValid ? 'All Checks Passed' : 'Issues Found'}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {data.feedback_points.map((point, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
          >
            {isValid ? (
              <CheckCircle className="w-4 h-4 text-success mt-0.5 shrink-0" />
            ) : (
              <XCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
            )}
            <span className="text-sm text-muted-foreground">{point}</span>
          </motion.div>
        ))}
      </div>

      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Adjusted Confidence</span>
          <span className="text-lg font-bold text-foreground">
            {Math.round(data.adjusted_confidence * 100)}%
          </span>
        </div>
      </div>
    </motion.div>
  );
}
