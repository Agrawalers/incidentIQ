import { IncidentAnalysisResponse } from '@/types/incident';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function analyzeIncident(log: string): Promise<IncidentAnalysisResponse> {
  const response = await fetch(`${API_BASE_URL}/analyze-incident`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ log }),
  });

  if (!response.ok) {
    throw new Error(`Analysis failed: ${response.statusText}`);
  }

  return response.json();
}
