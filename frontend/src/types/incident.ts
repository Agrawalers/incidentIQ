export interface SimilarIncident {
  incident_id: string;
  service: string;
  error_summary: string;
  similarity_score: number;
}

export interface RootCauseAnalysis {
  failure_layer: string;
  root_cause: string;
  fix_steps: string[];
  confidence_score: number;
}

export interface ValidationResult {
  status: 'valid' | 'issues_found';
  feedback_points: string[];
  adjusted_confidence: number;
}

export interface Classification {
  severity: 'critical' | 'high' | 'medium' | 'low';
  domain: string;
  urgency_score: number;
}

export interface FinalVerdict {
  confidence_level: 'high' | 'medium' | 'low';
  recommended_action: 'auto_apply_fix' | 'human_review_required';
  reason: string;
}

export interface IncidentAnalysisResponse {
  classification: Classification;
  similar_incidents: SimilarIncident[];
  root_cause_analysis: RootCauseAnalysis;
  validation: ValidationResult;
  final_verdict: FinalVerdict;
}
