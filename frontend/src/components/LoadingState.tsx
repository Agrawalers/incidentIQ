import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

export function LoadingState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Navigation skeleton */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center">
              <Skeleton className="w-8 h-8 rounded-full" />
              {i < 5 && <Skeleton className="w-8 h-0.5 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      {/* Main verdict skeleton */}
      <div className="glass-card p-8">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="w-14 h-14 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-20 w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>

      {/* Detail cards skeleton */}
      <div className="grid md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <Skeleton className="h-5 w-28" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Animated loading indicator */}
      <motion.div 
        className="text-center py-4"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <p className="text-muted-foreground text-sm">
          AI reasoning in progress...
        </p>
      </motion.div>
    </motion.div>
  );
}
