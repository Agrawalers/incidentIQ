import { motion } from 'framer-motion';
import { History, ExternalLink } from 'lucide-react';
import { SimilarIncident } from '@/types/incident';

interface SimilarIncidentsCardProps {
  data: SimilarIncident[];
}

export function SimilarIncidentsCard({ data }: SimilarIncidentsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600">
          <History className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Similar Incidents</h3>
      </div>

      <div className="space-y-3">
        {data.map((incident, index) => (
          <motion.div
            key={incident.incident_id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-mono font-medium text-primary">
                    {incident.incident_id}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted-foreground/20 text-muted-foreground">
                    {incident.service}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {incident.error_summary}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-lg font-bold text-foreground">
                    {Math.round(incident.similarity_score * 100)}%
                  </span>
                  <p className="text-xs text-muted-foreground">match</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
