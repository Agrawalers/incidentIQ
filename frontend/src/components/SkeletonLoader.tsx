import { motion } from 'framer-motion';

export function SkeletonLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Navigation Skeleton */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-center gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-8 h-8 bg-muted/50 rounded-full animate-pulse" />
              <div className="w-12 h-2 bg-muted/30 rounded mt-1 animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Results Skeletons */}
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="glass-card p-6 space-y-4"
        >
          <div className="h-6 bg-gradient-to-r from-muted/50 to-muted/30 rounded animate-pulse w-1/4" />
          <div className="space-y-3">
            <div className="h-4 bg-muted/40 rounded animate-pulse w-full" />
            <div className="h-4 bg-muted/40 rounded animate-pulse w-3/4" />
            <div className="h-4 bg-muted/40 rounded animate-pulse w-1/2" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((j) => (
              <div key={j} className="space-y-2">
                <div className="h-3 bg-muted/30 rounded animate-pulse w-full" />
                <div className="h-4 bg-muted/50 rounded animate-pulse w-2/3" />
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}