export interface Improvement {
  before: string;
  after: string;
  explanation: string;
}

export interface AnalysisResult {
  overallScore: number;
  hookStrength: number;
  youUsageCount: number;
  painPointClarity: number;
  ctaStrength: number;
  improvements: Improvement[];
}

export interface HistoryItem {
  id: string;
  title: string;
  scriptText: string;
  analysis: AnalysisResult;
  timestamp: string;
}
