import { useState, useEffect } from 'react';

interface ResultsProps {
  data: {
    classification: {
      severity: string;
      domain: string;
      urgency: number;
    };
    similar_incidents: Array<{
      id: string;
      service: string;
      error: string;
      similarity_score: number;
    }>;
    analysis: {
      is_known_issue: boolean;
      failure_layer: string;
      reasoning: string;
      root_cause: string;
      fix_steps: string[];
      confidence: number;
    };
    validation: {
      is_valid: boolean;
      issues_found: string[];
      adjusted_confidence: number;
      review_notes: string;
    };
    final_verdict: {
      confidence_level: string;
      recommended_action: string;
      reason: string;
    };
  };
}

export function Results({ data }: ResultsProps) {
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

  return (
    <div className="space-y-6">
      {/* Vertical Navigation Toolkit - Fixed Position */}
      <div className="fixed top-1/2 -translate-y-1/2 right-6 z-40">
        <div className="relative">
          {/* Glowing background orb */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 rounded-full blur-xl scale-150 animate-pulse"></div>
          
          {/* Navigation container */}
          <div className="relative">
            <div className="flex items-center flex-col gap-0">
              {[
                { id: 'classification', icon: '🔍', label: 'Classify' },
                { id: 'similar', icon: '🔗', label: 'Similar' },
                { id: 'root-cause', icon: '🎯', label: 'Root Cause' },
                { id: 'validation', icon: '✅', label: 'Validate' },
                { id: 'verdict', icon: '⚡', label: 'Verdict' },
              ].map((step, index) => (
                <div key={`nav-${step.id}`}>
                  <button
                    onClick={() => scrollToSection(step.id)}
                    className="group relative flex flex-col items-center gap-2 rounded-xl hover:bg-primary/10 transition-all duration-300 hover:scale-110 hover:rotate-3 p-3"
                  >
                    {/* Icon with glow effect */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                      <div className="relative text-3xl group-hover:scale-125 transition-transform duration-300">
                        {step.icon}
                      </div>
                    </div>
                    
                    {/* Hover glow */}
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-cyan-500/10 group-hover:via-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
                  </button>
                  
                  {/* Connecting line - between icons */}
                  {index < 4 && (
                    <div className="w-0.5 h-6 bg-gradient-to-b from-primary/30 to-primary/60"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Floating particles */}
          <div className="absolute -top-2 -left-2 w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="absolute -top-1 -right-3 w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute -bottom-2 left-1/4 w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      <div 
        id="classification" 
        className="scroll-section glass-card p-6"
      >
        <h3 className="text-lg font-semibold mb-4 text-gradient">Classification</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Severity</span>
            <p className="text-red-400 font-medium capitalize">{data.classification?.severity}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Domain</span>
            <p className="font-medium">{data.classification?.domain}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Urgency Score</span>
            <p className="font-medium">{data.classification?.urgency}/10</p>
          </div>
        </div>
      </div>

      <div 
        id="similar" 
        className="scroll-section glass-card p-6"
      >
        <h3 className="text-lg font-semibold mb-4 text-gradient">Similar Incidents</h3>
        <div className="space-y-3">
          {data.similar_incidents?.length > 0 ? (
            data.similar_incidents.map((incident, i) => (
              <div key={`incident-${i}`} className="p-3 bg-muted/30 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-sm text-primary">{incident.id}</span>
                  {incident.similarity_score && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                      {(incident.similarity_score * 100).toFixed(0)}% match
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-1">{incident.error}</p>
                <p className="text-xs text-blue-400">{incident.service}</p>
              </div>
            ))
          ) : (
            <div className="p-4 bg-muted/20 rounded-lg border border-dashed border-muted-foreground/30">
              <p className="text-sm text-muted-foreground text-center">
                No similar incidents found in historical data.
                <br />
                <span className="text-xs opacity-75">This appears to be a novel incident requiring fresh analysis.</span>
              </p>
            </div>
          )}
        </div>
      </div>

      <div 
        id="root-cause" 
        className="scroll-section glass-card p-6"
      >
        <h3 className="text-lg font-semibold mb-4 text-gradient">Root Cause Analysis</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-sm text-muted-foreground">Known Issue</span>
              <p className="font-medium">{data.analysis?.is_known_issue ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Failure Layer</span>
              <p className="font-medium">{data.analysis?.failure_layer}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">Reasoning:</h4>
            <p className="text-sm text-muted-foreground">{data.analysis?.reasoning}</p>
          </div>
          
          <div className="mb-4">
            <h4 className="font-medium mb-2">Root Cause:</h4>
            <p className="text-sm text-muted-foreground">{data.analysis?.root_cause}</p>
          </div>
          
          {data.analysis?.fix_steps?.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Recommended Fix Steps:</h4>
              <div className="space-y-2">
                {data.analysis.fix_steps.map((step, i) => (
                  <div key={`step-${i}`} className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-sm text-white font-medium flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-4">
            <span className="text-sm text-muted-foreground">Confidence: </span>
            <span className="font-medium">{((data.analysis?.confidence || 0) * 100).toFixed(0)}%</span>
          </div>
        </div>
      </div>

      <div 
        id="validation" 
        className="scroll-section glass-card p-6"
      >
        <h3 className="text-lg font-semibold mb-4 text-gradient">Validation</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-muted-foreground">Status</span>
              <p className={`font-medium ${data.validation?.is_valid ? 'text-green-400' : 'text-red-400'}`}>
                {data.validation?.is_valid ? 'Valid' : 'Issues Found'}
              </p>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Adjusted Confidence</span>
              <p className="font-medium">{((data.validation?.adjusted_confidence || 0) * 100).toFixed(0)}%</p>
            </div>
          </div>
          
          {data.validation?.issues_found?.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Issues Found:</h4>
              <div className="space-y-2">
                {data.validation.issues_found.map((issue, i) => (
                  <div key={`issue-${i}`} className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-muted-foreground">{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {data.validation?.review_notes && (
            <div>
              <h4 className="font-medium mb-2">Review Notes:</h4>
              <p className="text-sm text-muted-foreground">{data.validation.review_notes}</p>
            </div>
          )}
        </div>
      </div>

      <div 
        id="verdict" 
        className="scroll-section glass-card p-6 border-2 border-primary/20"
      >
        <h3 className="text-lg font-semibold mb-4 text-gradient">Final Verdict</h3>
        <div className="space-y-4">
          {data.final_verdict?.confidence_level && data.final_verdict?.recommended_action ? (
            <>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  {data.final_verdict.confidence_level} confidence
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                  {data.final_verdict.recommended_action?.replace('_', ' ')}
                </span>
              </div>
              <p className="text-muted-foreground">{data.final_verdict.reason}</p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No final verdict available</p>
          )}
        </div>
      </div>
    </div>
  );
}