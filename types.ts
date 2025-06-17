
export interface ProblemCanvasData {
  id: string;
  jobsToBeDone: string;
  pains: string;
  gains: string;
  innovatorsBiasCheckInput: string;
  innovatorsBiasCheckResult: string;
}

// Customer Insights
export interface Interview {
  id: string;
  date: string; // ISO string for date input
  intervieweeName: string;
  customerSegment: string;
  keyTakeaways: string; // Mom Test focused notes
  tags: string[]; // e.g., "pain point", "gain", "feature request"
  sentiment?: 'positive' | 'negative' | 'neutral';
  aiSummary?: string; // AI generated summary
}

// Experimentation
export interface Hypothesis {
  id: string;
  description: string; // e.g., "Customer segment X experiences problem Y"
  status: 'pending' | 'testing' | 'validated' | 'invalidated';
  createdAt: string; // ISO string
  aiCritique?: string; // AI feedback on hypothesis clarity/testability
}

export interface TestCard {
  id: string;
  hypothesisId: string; // Link to Hypothesis
  testDescription: string; // How we will test it
  metric: string; // What we will measure
  successCriteria: string; // What indicates pass/fail
  results?: string; // What happened
  learnings?: string; // What we learned, could be pre-filled for LearningCard
  status: 'planned' | 'running' | 'completed';
}

export interface MVP {
  id: string;
  name: string;
  type: 'landing page' | 'interactive mockup' | 'concierge' | 'facade' | 'video' | 'other';
  description: string;
  linkedHypothesisIds: string[]; // Link to Hypotheses it tests
  metricsToTrack: string; // Key metrics for this MVP
  status: 'ideation' | 'building' | 'testing' | 'completed';
  feedbackSummary?: string; // Summary of feedback gathered for this MVP
}

// Value Proposition
export interface ValuePropositionCanvas {
  id: string; // Typically one per project
  // Customer Profile - data can be synced or copied from ProblemCanvasData
  customerJobs: string;
  customerPains: string;
  customerGains: string;
  // Value Map
  productsServices: string;
  painRelievers: string;
  gainCreators: string;
  aiMessagingSuggestions?: string;
}

// Business Model
export type BusinessModelBlockType =
  | 'keyPartners'
  | 'keyActivities'
  | 'keyResources'
  | 'valuePropositions' // This would ideally link to or display the VP module's output
  | 'customerRelationships'
  | 'channels'
  | 'customerSegments'
  | 'costStructure'
  | 'revenueStreams';

export interface BusinessModelBlockData {
  content: string;
  financialHypotheses?: string;
}

export interface BusinessModelCanvasData {
  id: string; // Typically one per project
  blocks: Record<BusinessModelBlockType, BusinessModelBlockData>;
}

export interface FermiAssumption {
  id: string;
  label: string;
  value: string; // Use string to allow for ranges or text, parse to number for calcs
}
export interface FermiEstimation {
  id: string;
  name: string;
  assumptions: FermiAssumption[];
  calculationLogic: string; // e.g., "A * B / C" or more descriptive logic
  estimatedOutcome: string; // e.g., "Estimated annual revenue: $100,000"
  aiViabilityAssessment?: string;
}

// Learning & Iteration
export interface LearningCard {
  id: string;
  date: string; // ISO string
  relatedTestCardId?: string; // Optional: Link to TestCard
  whatWeThought: string;
  whatHappened: string;
  whatWeLearned: string;
  whatWeWillChange: string;
  aiReflectionPrompt?: string; // AI prompt to deepen reflection
}

export interface AppContextType {
  projectName: string;
  updateProjectName: (newName: string) => void;
  currentProjectData: ProblemCanvasData | null;
  updateProblemCanvasData: (data: Partial<ProblemCanvasData>) => void;
  apiKeyStatus: 'ok' | 'missing' | 'checking';

  // Customer Insights
  interviews: Interview[];
  addInterview: (interview: Omit<Interview, 'id' | 'tags'> & { tagsString?: string }) => void;
  updateInterview: (interview: Interview) => void;
  deleteInterview: (interviewId: string) => void;
  getInterviewById: (interviewId: string) => Interview | undefined;
  generateInterviewSummary: (interviewId: string) => Promise<void>;


  // Experimentation
  hypotheses: Hypothesis[];
  addHypothesis: (hypothesis: Omit<Hypothesis, 'id' | 'createdAt' | 'status'>) => void;
  updateHypothesis: (hypothesis: Hypothesis) => void;
  deleteHypothesis: (hypothesisId: string) => void;
  getHypothesisById: (hypothesisId: string) => Hypothesis | undefined;
  critiqueHypothesis: (hypothesisId: string) => Promise<void>;


  testCards: TestCard[];
  addTestCard: (testCard: Omit<TestCard, 'id' | 'status'>) => void;
  updateTestCard: (testCard: TestCard) => void;
  deleteTestCard: (testCardId: string) => void;
  getTestCardById: (testCardId: string) => TestCard | undefined;

  mvps: MVP[];
  addMvp: (mvp: Omit<MVP, 'id' | 'status'>) => void;
  updateMvp: (mvp: MVP) => void;
  deleteMvp: (mvpId: string) => void;
  getMvpById: (mvpId: string) => MVP | undefined;

  // Value Proposition
  valueProposition: ValuePropositionCanvas | null;
  updateValueProposition: (data: Partial<ValuePropositionCanvas>) => void;
  generateVpMessaging: (canvasId: string) => Promise<void>;


  // Business Model
  businessModel: BusinessModelCanvasData | null;
  updateBusinessModelBlock: (blockType: BusinessModelBlockType, data: Partial<BusinessModelBlockData>) => void;

  fermiEstimations: FermiEstimation[];
  addFermiEstimation: (estimation: Omit<FermiEstimation, 'id' | 'assumptions'> & {assumptionsString?: string}) => void;
  updateFermiEstimation: (estimation: FermiEstimation) => void;
  deleteFermiEstimation: (estimationId: string) => void;
  getFermiEstimationById: (estimationId: string) => FermiEstimation | undefined;
  assessFermiViability: (estimationId: string) => Promise<void>;


  // Learning & Iteration
  learningCards: LearningCard[];
  addLearningCard: (learningCard: Omit<LearningCard, 'id' | 'date'>) => void;
  updateLearningCard: (learningCard: LearningCard) => void;
  deleteLearningCard: (learningCardId: string) => void;
  getLearningCardById: (learningCardId: string) => LearningCard | undefined;
  generateLearningReflection: (learningCardId: string) => Promise<void>;
}

// Navigation and Icon types (already existing)
export interface NavItem {
  name: string;
  path: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
  subItems?: NavItem[];
}

// Gemini API related types (already existing)
export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
}

export interface Candidate {
  groundingMetadata?: GroundingMetadata;
}
