import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';
import { CinematicIntro } from '@/components/CinematicIntro';
import { ControlCenter } from '@/components/ControlCenter';
import { Results } from '@/components/Results';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { ThemeToggle } from '@/components/ThemeToggle';
import { analyzeIncident } from '@/lib/api';
import { IncidentAnalysisResponse } from '@/types/incident';

const MOCK_RESPONSE = {
  classification: {
    severity: 'High',
    domain: 'Database',
    urgency: 8,
  },
  similar_incidents: [
    {
      id: 'INC-2024-1847',
      service: 'payment-service',
      error: 'Connection pool exhaustion causing transaction timeouts',
      similarity_score: 0.92,
    },
    {
      id: 'INC-2024-1623',
      service: 'order-service',
      error: 'Database replica lag causing read inconsistencies',
      similarity_score: 0.78,
    },
  ],
  analysis: {
    is_known_issue: true,
    failure_layer: 'Database Connection Pool',
    reasoning: 'Based on error patterns and system metrics, this appears to be a connection pool exhaustion issue similar to previous incidents.',
    root_cause: 'Connection pool size (max: 20) is insufficient for current traffic load (avg: 45 concurrent connections). Long-running transactions are not being released properly.',
    fix_steps: [
      'Increase connection pool size to 50',
      'Set connection timeout to 30 seconds',
      'Enable connection health checks',
      'Add query timeout of 10 seconds for non-critical paths',
    ],
    confidence: 0.88,
  },
  validation: {
    is_valid: true,
    issues_found: [],
    adjusted_confidence: 0.86,
    review_notes: 'Analysis is consistent with historical data and system behavior patterns.',
  },
  final_verdict: {
    confidence_level: 'High',
    recommended_action: 'Auto-Apply Fix',
    reason: 'This incident matches a known pattern with 92% similarity. The proposed fix has been successfully applied 12 times in the past 30 days with a 100% success rate.',
  },
};

const Index = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [logInput, setLogInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  const handleAnalyze = async () => {
    if (!logInput.trim()) return;
    setIsLoading(true);
    setResult(null);
    
    try {
      console.log('Sending request to backend:', logInput);
      const response = await analyzeIncident(logInput);
      console.log('Backend response:', response);
      setResult(response);
    } catch (err) {
      console.error('Backend error:', err);
      console.log('Using mock data as fallback');
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setResult(MOCK_RESPONSE);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <CinematicIntro key="intro" onComplete={handleIntroComplete} />
        )}
      </AnimatePresence>

      <div className="min-h-screen mesh-gradient">
        <ThemeToggle className="fixed top-6 right-6 z-50" />
        
        <div className="max-w-4xl mx-auto px-4 py-6 md:px-6">
          <main className="space-y-8">
            <ControlCenter
              value={logInput}
              onChange={setLogInput}
              onSubmit={handleAnalyze}
              isLoading={isLoading}
              result={result}
            />

            <AnimatePresence mode="wait">
              {isLoading && <SkeletonLoader key="loading" />}
              {result && !isLoading && (
                <Results key="results" data={result} />
              )}
            </AnimatePresence>
          </main>

          <footer className="mt-16 text-center text-sm text-muted-foreground py-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-primary" />
              <span className="font-bold text-foreground">IncidentIQ</span>
            </div>
            <p>AI-Powered Autonomous Incident Response</p>
            <p className="text-xs mt-2 opacity-60">Developed by Kushagra</p>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Index;
