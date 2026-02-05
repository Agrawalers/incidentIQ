import { motion } from 'framer-motion';
import { Search, CheckCircle2 } from 'lucide-react';
import { RootCauseAnalysis } from '@/types/incident';
import { Progress } from '@/components/ui/progress';

interface RootCauseCardProps {
  data: RootCauseAnalysis;
}

export function RootCauseCard({ data }: RootCauseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
          <Search className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Root Cause Analysis</h3>
      </div>

      <div className="space-y-4">
        {/* Failure Layer */}
        <div className="p-4 rounded-xl bg-muted/50">
          <span className="text-xs text-muted-foreground uppercase tracking-wider">
            Failure Layer
          </span>
          <p className="text-sm font-medium text-foreground mt-1">
            {data.failure_layer}
          </p>
        </div>

        {/* Root Cause */}
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20">
          <span className="text-xs text-destructive uppercase tracking-wider">
            Root Cause Identified
          </span>
          <p className="text-sm text-foreground mt-1 leading-relaxed">
            {data.root_cause}
          </p>
        </div>

        {/* Fix Steps */}
        <div>
          <span className="text-sm font-medium text-foreground mb-3 block">
            Recommended Fix Steps
          </span>
          <div className="space-y-2">
            {data.fix_steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
              >
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">{step}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Confidence */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Analysis Confidence</span>
            <span className="text-sm font-medium text-foreground">
              {Math.round(data.confidence_score * 100)}%
            </span>
          </div>
          <Progress value={data.confidence_score * 100} className="h-2" />
        </div>
      </div>
    </motion.div>
  );
}
