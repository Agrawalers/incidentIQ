import { motion } from 'framer-motion';
import { Send, Loader2, Shield, Zap, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ControlCenterProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  result?: any;
}

export function ControlCenter({ value, onChange, onSubmit, isLoading, result }: ControlCenterProps) {
  const [copied, setCopied] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      onSubmit();
    }
  };

  const copyToClipboard = async () => {
    if (!result) return;
    
    const analysisText = `IncidentIQ Analysis Results

Classification:
- Severity: ${result.classification?.severity || 'N/A'}
- Domain: ${result.classification?.domain || 'N/A'}
- Urgency Score: ${result.classification?.urgency || 'N/A'}/10

Similar Incidents:
${result.similar_incidents?.map((incident: any, i: number) => `${i + 1}. ${incident.id} - ${incident.error} (${(incident.similarity_score * 100).toFixed(0)}% match)`).join('\n') || 'None found'}

Analysis:
- Known Issue: ${result.analysis?.is_known_issue ? 'Yes' : 'No'}
- Failure Layer: ${result.analysis?.failure_layer || 'N/A'}
- Root Cause: ${result.analysis?.root_cause || 'N/A'}
- Confidence: ${result.analysis?.confidence ? (result.analysis.confidence * 100).toFixed(0) + '%' : 'N/A'}

Recommended Fix Steps:
${result.analysis?.fix_steps?.map((step: string, i: number) => `${i + 1}. ${step}`).join('\n') || 'No steps provided'}

Validation:
- Status: ${result.validation?.is_valid ? 'Valid' : 'Issues Found'}
- Adjusted Confidence: ${result.validation?.adjusted_confidence ? (result.validation.adjusted_confidence * 100).toFixed(0) + '%' : 'N/A'}
${result.validation?.issues_found?.length > 0 ? '\nIssues Found:\n' + result.validation.issues_found.map((issue: string, i: number) => `${i + 1}. ${issue}`).join('\n') : ''}

Final Verdict:
- Confidence Level: ${result.final_verdict?.confidence_level || 'N/A'}
- Recommended Action: ${result.final_verdict?.recommended_action || 'N/A'}
- Reason: ${result.final_verdict?.reason || 'N/A'}`;
    
    try {
      await navigator.clipboard.writeText(analysisText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto glass-card overflow-hidden"
    >
      {/* Branding Header - Top 30% */}
      <div className="bg-gradient-to-r from-slate-900/20 to-indigo-900/20 p-8 text-center border-b border-white/10">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.4 }}
          className="relative inline-block mb-4"
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

      {/* Input Section - Bottom 70% */}
      <div className="p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Incident Log Input
          </h2>
          <span className="text-xs text-muted-foreground">
            {value.length} characters
          </span>
        </div>

        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste an incident log, error message, or alert here…"
          className="w-full min-h-[160px] p-4 bg-muted/50 border border-border/50 rounded-xl resize-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 text-foreground placeholder:text-muted-foreground transition-all font-mono text-sm"
          disabled={isLoading}
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            ⌘ + Enter to analyze
          </span>
          <div className="flex items-center gap-3">
            {result && (
              <motion.button
                onClick={copyToClipboard}
                whileHover={{ scale: 1.02 }}
                className="gap-2 text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted px-3 py-2 rounded-lg transition-all flex items-center"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Results
                  </>
                )}
              </motion.button>
            )}
            <motion.button
              onClick={onSubmit}
              disabled={!value.trim() || isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl px-6 py-3 font-medium shadow-lg shadow-cyan-500/20 transition-all hover:shadow-xl hover:shadow-cyan-500/30 disabled:opacity-50 disabled:hover:scale-100 flex items-center"
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
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}