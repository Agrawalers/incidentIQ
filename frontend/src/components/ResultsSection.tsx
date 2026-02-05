import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IncidentAnalysisResponse } from '@/types/incident';
import { ClassificationCard } from './results/ClassificationCard';
import { SimilarIncidentsCard } from './results/SimilarIncidentsCard';
import { RootCauseCard } from './results/RootCauseCard';
import { ValidationCard } from './results/ValidationCard';
import { FinalVerdictCard } from './results/FinalVerdictCard';

interface ResultsSectionProps {
  data: IncidentAnalysisResponse;
}

const steps = [
  { id: 'classification', label: 'Classification', number: 1 },
  { id: 'similar', label: 'Similar', number: 2 },
  { id: 'root-cause', label: 'Root Cause', number: 3 },
  { id: 'validation', label: 'Validation', number: 4 },
  { id: 'verdict', label: 'Verdict', number: 5 },
];

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const elementPosition = element.offsetTop;
    window.scrollTo({
      top: elementPosition - 100,
      behavior: 'smooth'
    });
  }
};

export function ResultsSection({ data }: ResultsSectionProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    const analysisText = `IncidentIQ Analysis Results

Classification:
- Severity: ${data.classification.severity}
- Domain: ${data.classification.domain}
- Urgency Score: ${data.classification.urgency_score}

Root Cause:
${data.root_cause_analysis.root_cause}

Recommended Actions:
${data.root_cause_analysis.fix_steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

Final Verdict: ${data.final_verdict.recommended_action}
Confidence: ${data.final_verdict.confidence_level}

Reason: ${data.final_verdict.reason}`;
    
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Navigation menu */}
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-4 sticky top-4 z-20"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center gap-2 flex-wrap flex-1">
            {steps.map((step, i) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => scrollToSection(step.id)}
                  className="flex flex-col items-center group cursor-pointer transition-transform hover:scale-105"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white text-sm font-bold flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cyan-500/30 transition-shadow">
                    {step.number}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 hidden md:block group-hover:text-foreground transition-colors">
                    {step.label}
                  </span>
                </button>
                {i < steps.length - 1 && (
                  <div className="w-8 md:w-12 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 mx-1" />
                )}
              </div>
            ))}
          </div>
          <Button
            onClick={copyToClipboard}
            variant="ghost"
            size="sm"
            className="ml-4 gap-2 text-muted-foreground hover:text-foreground"
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
          </Button>
        </div>
      </motion.nav>

      {/* Cards */}
      <div className="space-y-6">
        <div id="classification" className="scroll-section">
          <ClassificationCard data={data.classification} />
        </div>
        <div id="similar" className="scroll-section">
          <SimilarIncidentsCard data={data.similar_incidents} />
        </div>
        <div id="root-cause" className="scroll-section">
          <RootCauseCard data={data.root_cause_analysis} />
        </div>
        <div id="validation" className="scroll-section">
          <ValidationCard data={data.validation} />
        </div>
        <div id="verdict" className="scroll-section">
          <FinalVerdictCard data={data.final_verdict} />
        </div>
      </div>
    </motion.div>
  );
}
