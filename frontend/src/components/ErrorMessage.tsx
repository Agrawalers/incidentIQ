import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-6 border-destructive/50"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-destructive/10">
          <AlertCircle className="w-6 h-6 text-destructive" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Analysis Failed
          </h3>
          <p className="text-muted-foreground mb-4">
            {message}
          </p>
          <Button
            variant="outline"
            onClick={onRetry}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
