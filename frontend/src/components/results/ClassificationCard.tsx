import { motion } from 'framer-motion';
import { AlertTriangle, Layers, Gauge } from 'lucide-react';
import { Classification } from '@/types/incident';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface ClassificationCardProps {
  data: Classification;
}

const severityConfig = {
  critical: { color: 'bg-destructive', label: 'Critical' },
  high: { color: 'bg-warning', label: 'High' },
  medium: { color: 'bg-primary', label: 'Medium' },
  low: { color: 'bg-success', label: 'Low' },
};

export function ClassificationCard({ data }: ClassificationCardProps) {
  const severity = severityConfig[data.severity] || severityConfig.medium;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
          <AlertTriangle className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Classification</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Severity */}
        <div className="p-4 rounded-xl bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Severity</span>
          </div>
          <Badge className={`${severity.color} text-white`}>
            {severity.label}
          </Badge>
        </div>

        {/* Domain */}
        <div className="p-4 rounded-xl bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Domain</span>
          </div>
          <p className="text-sm font-medium text-foreground">{data.domain}</p>
        </div>

        {/* Urgency */}
        <div className="p-4 rounded-xl bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <Gauge className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Urgency Score</span>
          </div>
          <div className="space-y-2">
            <Progress value={data.urgency_score * 100} className="h-2" />
            <span className="text-sm font-medium text-foreground">
              {Math.round(data.urgency_score * 100)}%
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
