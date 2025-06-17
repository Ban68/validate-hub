
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  ProblemCanvasData, AppContextType, Interview, Hypothesis, TestCard, MVP,
  ValuePropositionCanvas, BusinessModelCanvasData, BusinessModelBlockType,
  FermiEstimation, LearningCard, BusinessModelBlockData, FermiAssumption
} from '../types';
import { generateContent } from '../services/geminiService'; // Assuming this is the path

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper for generating unique IDs
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substring(2, 9);

// Helper for localStorage
const useLocalStorage = <T,>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

const getDefaultBusinessModel = (): BusinessModelCanvasData => ({
  id: 'default-bmc',
  blocks: {
    keyPartners: { content: '', financialHypotheses: '' },
    keyActivities: { content: '', financialHypotheses: '' },
    keyResources: { content: '', financialHypotheses: '' },
    valuePropositions: { content: '', financialHypotheses: '' }, // Should ideally link to VP module
    customerRelationships: { content: '', financialHypotheses: '' },
    channels: { content: '', financialHypotheses: '' },
    customerSegments: { content: '', financialHypotheses: '' },
    costStructure: { content: '', financialHypotheses: '' },
    revenueStreams: { content: '', financialHypotheses: '' },
  }
});


export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projectName, setProjectName] = useLocalStorage<string>('validatehub-projectName', "My Awesome Idea");
  const [currentProjectData, setCurrentProjectData] = useLocalStorage<ProblemCanvasData | null>('validatehub-problemCanvas', {
    id: 'default-project',
    jobsToBeDone: '',
    pains: '',
    gains: '',
    innovatorsBiasCheckInput: '',
    innovatorsBiasCheckResult: '',
  });
  const [apiKeyStatus, setApiKeyStatus] = useState<'checking' | 'ok' | 'missing'>('checking');

  // New states for each module, persisted in localStorage
  const [interviews, setInterviews] = useLocalStorage<Interview[]>('validatehub-interviews', []);
  const [hypotheses, setHypotheses] = useLocalStorage<Hypothesis[]>('validatehub-hypotheses', []);
  const [testCards, setTestCards] = useLocalStorage<TestCard[]>('validatehub-testCards', []);
  const [mvps, setMvps] = useLocalStorage<MVP[]>('validatehub-mvps', []);
  const [valueProposition, setValueProposition] = useLocalStorage<ValuePropositionCanvas | null>('validatehub-valueProposition', {
    id: 'default-vp', customerJobs: '', customerPains: '', customerGains: '', productsServices: '', painRelievers: '', gainCreators: '',
  });
  const [businessModel, setBusinessModel] = useLocalStorage<BusinessModelCanvasData | null>('validatehub-businessModel', getDefaultBusinessModel());
  const [fermiEstimations, setFermiEstimations] = useLocalStorage<FermiEstimation[]>('validatehub-fermiEstimations', []);
  const [learningCards, setLearningCards] = useLocalStorage<LearningCard[]>('validatehub-learningCards', []);


  useEffect(() => {
    if (process.env.API_KEY && process.env.API_KEY.trim() !== '') {
      setApiKeyStatus('ok');
    } else {
      console.warn("Gemini API Key (process.env.API_KEY) is not set or is empty.");
      setApiKeyStatus('missing');
    }
  }, []);

  const updateProjectName = useCallback((newName: string) => {
    setProjectName(newName);
  }, [setProjectName]);

  const updateProblemCanvasData = useCallback((data: Partial<ProblemCanvasData>) => {
    setCurrentProjectData(prev => ({ ...(prev || { id: 'default-project', jobsToBeDone: '', pains: '', gains: '', innovatorsBiasCheckInput: '', innovatorsBiasCheckResult: '' }), ...data }));
  }, [setCurrentProjectData]);

  // CRUD for Interviews
  const addInterview = useCallback((interviewData: Omit<Interview, 'id' | 'tags'> & { tagsString?: string }) => {
    const tags = interviewData.tagsString ? interviewData.tagsString.split(',').map(tag => tag.trim()).filter(Boolean) : [];
    setInterviews(prev => [...prev, { ...interviewData, id: generateId(), tags }]);
  }, [setInterviews]);
  const updateInterview = useCallback((updatedInterview: Interview) => {
    setInterviews(prev => prev.map(i => i.id === updatedInterview.id ? updatedInterview : i));
  }, [setInterviews]);
  const deleteInterview = useCallback((id: string) => {
    setInterviews(prev => prev.filter(i => i.id !== id));
  }, [setInterviews]);
  const getInterviewById = useCallback((id: string) => interviews.find(i => i.id === id), [interviews]);
  const generateInterviewSummary = useCallback(async (interviewId: string) => {
    const interview = interviews.find(i => i.id === interviewId);
    if (!interview || apiKeyStatus === 'missing') return;
    const prompt = `Summarize the key insights, pains, and gains from this interview:
    Date: ${interview.date}
    Interviewee: ${interview.intervieweeName}
    Segment: ${interview.customerSegment}
    Notes: ${interview.keyTakeaways}
    Tags: ${interview.tags.join(', ')}
    Provide a concise summary.`;
    const result = await generateContent<{ summary: string }>(prompt, false);
    if (result.text) {
      updateInterview({ ...interview, aiSummary: result.text });
    }
  }, [interviews, updateInterview, apiKeyStatus]);


  // CRUD for Hypotheses
  const addHypothesis = useCallback((hypothesisData: Omit<Hypothesis, 'id' | 'createdAt' | 'status'>) => {
    setHypotheses(prev => [...prev, { ...hypothesisData, id: generateId(), createdAt: new Date().toISOString(), status: 'pending' }]);
  }, [setHypotheses]);
  const updateHypothesis = useCallback((updatedHypothesis: Hypothesis) => {
    setHypotheses(prev => prev.map(h => h.id === updatedHypothesis.id ? updatedHypothesis : h));
  }, [setHypotheses]);
  const deleteHypothesis = useCallback((id: string) => {
    setHypotheses(prev => prev.filter(h => h.id !== id));
  }, [setHypotheses]);
  const getHypothesisById = useCallback((id: string) => hypotheses.find(h => h.id === id), [hypotheses]);
  const critiqueHypothesis = useCallback(async (hypothesisId: string) => {
    const hypothesis = hypotheses.find(h => h.id === hypothesisId);
    if (!hypothesis || apiKeyStatus === 'missing') return;
    const prompt = `Critique the following hypothesis for clarity, testability, and potential biases: "${hypothesis.description}". Suggest improvements if any.`;
    const result = await generateContent<string>(prompt, false);
    if (result.text) {
      updateHypothesis({ ...hypothesis, aiCritique: result.text });
    }
  }, [hypotheses, updateHypothesis, apiKeyStatus]);

  // CRUD for TestCards
  const addTestCard = useCallback((testCardData: Omit<TestCard, 'id' | 'status'>) => {
    setTestCards(prev => [...prev, { ...testCardData, id: generateId(), status: 'planned' }]);
  }, [setTestCards]);
  const updateTestCard = useCallback((updatedTestCard: TestCard) => {
    setTestCards(prev => prev.map(tc => tc.id === updatedTestCard.id ? updatedTestCard : tc));
  }, [setTestCards]);
  const deleteTestCard = useCallback((id: string) => {
    setTestCards(prev => prev.filter(tc => tc.id !== id));
  }, [setTestCards]);
  const getTestCardById = useCallback((id: string) => testCards.find(tc => tc.id === id), [testCards]);

  // CRUD for MVPs
  const addMvp = useCallback((mvpData: Omit<MVP, 'id' | 'status'>) => {
    setMvps(prev => [...prev, { ...mvpData, id: generateId(), status: 'ideation' }]);
  }, [setMvps]);
  const updateMvp = useCallback((updatedMvp: MVP) => {
    setMvps(prev => prev.map(m => m.id === updatedMvp.id ? updatedMvp : m));
  }, [setMvps]);
  const deleteMvp = useCallback((id: string) => {
    setMvps(prev => prev.filter(m => m.id !== id));
  }, [setMvps]);
  const getMvpById = useCallback((id: string) => mvps.find(m => m.id === id), [mvps]);

  // Value Proposition
  const updateValueProposition = useCallback((data: Partial<ValuePropositionCanvas>) => {
    setValueProposition(prev => ({ ...(prev || { id: 'default-vp', customerJobs: '', customerPains: '', customerGains: '', productsServices: '', painRelievers: '', gainCreators: '' }), ...data }));
  }, [setValueProposition]);
  const generateVpMessaging = useCallback(async (canvasId: string) => {
    if (!valueProposition || valueProposition.id !== canvasId || apiKeyStatus === 'missing') return;
    const prompt = `Based on this Value Proposition Canvas:
    Customer Jobs: ${valueProposition.customerJobs}
    Pains: ${valueProposition.customerPains}
    Gains: ${valueProposition.customerGains}
    Products/Services: ${valueProposition.productsServices}
    Pain Relievers: ${valueProposition.painRelievers}
    Gain Creators: ${valueProposition.gainCreators}
    Generate 3-5 benefit-oriented messaging snippets for marketing.`;
    const result = await generateContent<string>(prompt, false);
    if (result.text) {
      updateValueProposition({ ...valueProposition, aiMessagingSuggestions: result.text });
    }
  }, [valueProposition, updateValueProposition, apiKeyStatus]);


  // Business Model
  const updateBusinessModelBlock = useCallback((blockType: BusinessModelBlockType, data: Partial<BusinessModelBlockData>) => {
    setBusinessModel(prev => {
      const current = prev || getDefaultBusinessModel();
      return {
        ...current,
        blocks: {
          ...current.blocks,
          [blockType]: { ...current.blocks[blockType], ...data },
        },
      };
    });
  }, [setBusinessModel]);


  // Fermi Estimations
  const addFermiEstimation = useCallback((estimationData: Omit<FermiEstimation, 'id' | 'assumptions'> & {assumptionsString?: string}) => {
    // Basic parsing of assumptions string: "label1:value1,label2:value2"
    const parsedAssumptions: FermiAssumption[] = estimationData.assumptionsString
        ? estimationData.assumptionsString.split(',').map(s => {
            const parts = s.split(':');
            return { id: generateId(), label: parts[0]?.trim() || 'New Assumption', value: parts[1]?.trim() || '0' };
          }).filter(a => a.label)
        : [];
    setFermiEstimations(prev => [...prev, { ...estimationData, id: generateId(), assumptions: parsedAssumptions }]);
  }, [setFermiEstimations]);
  const updateFermiEstimation = useCallback((updatedEstimation: FermiEstimation) => {
    setFermiEstimations(prev => prev.map(fe => fe.id === updatedEstimation.id ? updatedEstimation : fe));
  }, [setFermiEstimations]);
  const deleteFermiEstimation = useCallback((id: string) => {
    setFermiEstimations(prev => prev.filter(fe => fe.id !== id));
  }, [setFermiEstimations]);
  const getFermiEstimationById = useCallback((id: string) => fermiEstimations.find(fe => fe.id === id), [fermiEstimations]);
  const assessFermiViability = useCallback(async (estimationId: string) => {
    const estimation = fermiEstimations.find(f => f.id === estimationId);
    if (!estimation || apiKeyStatus === 'missing') return;
    const assumptionsText = estimation.assumptions.map(a => `${a.label}: ${a.value}`).join('; ');
    const prompt = `Assess the potential viability based on this Fermi estimation:
    Name: ${estimation.name}
    Assumptions: ${assumptionsText}
    Calculation Logic: ${estimation.calculationLogic}
    Estimated Outcome: ${estimation.estimatedOutcome}
    Provide a brief commentary on the viability and key sensitivities.`;
    const result = await generateContent<string>(prompt, false);
    if (result.text) {
      updateFermiEstimation({ ...estimation, aiViabilityAssessment: result.text });
    }
  }, [fermiEstimations, updateFermiEstimation, apiKeyStatus]);


  // Learning Cards
  const addLearningCard = useCallback((learningCardData: Omit<LearningCard, 'id' | 'date'>) => {
    setLearningCards(prev => [...prev, { ...learningCardData, id: generateId(), date: new Date().toISOString() }]);
  }, [setLearningCards]);
  const updateLearningCard = useCallback((updatedLearningCard: LearningCard) => {
    setLearningCards(prev => prev.map(lc => lc.id === updatedLearningCard.id ? updatedLearningCard : lc));
  }, [setLearningCards]);
  const deleteLearningCard = useCallback((id: string) => {
    setLearningCards(prev => prev.filter(lc => lc.id !== id));
  }, [setLearningCards]);
  const getLearningCardById = useCallback((id: string) => learningCards.find(lc => lc.id === id), [learningCards]);
  const generateLearningReflection = useCallback(async (learningCardId: string) => {
    const card = learningCards.find(lc => lc.id === learningCardId);
    if (!card || apiKeyStatus === 'missing') return;
    const prompt = `Based on this learning card:
    What we thought: ${card.whatWeThought}
    What happened: ${card.whatHappened}
    What we learned: ${card.whatWeLearned}
    What we will change: ${card.whatWeWillChange}
    Provide a short reflective prompt or question to deepen the user's insight or consider next steps.`;
    const result = await generateContent<string>(prompt, false);
    if (result.text) {
      updateLearningCard({ ...card, aiReflectionPrompt: result.text });
    }
  }, [learningCards, updateLearningCard, apiKeyStatus]);


  return (
    <AppContext.Provider value={{
      projectName, updateProjectName,
      currentProjectData, updateProblemCanvasData, apiKeyStatus,
      interviews, addInterview, updateInterview, deleteInterview, getInterviewById, generateInterviewSummary,
      hypotheses, addHypothesis, updateHypothesis, deleteHypothesis, getHypothesisById, critiqueHypothesis,
      testCards, addTestCard, updateTestCard, deleteTestCard, getTestCardById,
      mvps, addMvp, updateMvp, deleteMvp, getMvpById,
      valueProposition, updateValueProposition, generateVpMessaging,
      businessModel, updateBusinessModelBlock,
      fermiEstimations, addFermiEstimation, updateFermiEstimation, deleteFermiEstimation, getFermiEstimationById, assessFermiViability,
      learningCards, addLearningCard, updateLearningCard, deleteLearningCard, getLearningCardById, generateLearningReflection,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
