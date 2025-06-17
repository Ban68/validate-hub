import React, { useState, useCallback, useEffect } from 'react';
import { ProblemCanvasData } from '../../types';
import Card from '../ui/Card';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { fetchProblemSuggestions, checkInnovatorsBias } from '../../services/geminiService';
import { useAppContext } from '../../hooks/useAppContext';

const ProblemCanvasForm: React.FC = () => {
  const { currentProjectData, updateProblemCanvasData, apiKeyStatus } = useAppContext();
  
  const initialLocalData = currentProjectData || {
    id: 'default-project', // Ensure ID is present
    jobsToBeDone: '',
    pains: '',
    gains: '',
    innovatorsBiasCheckInput: '',
    innovatorsBiasCheckResult: '',
  };
  const [localData, setLocalData] = useState<ProblemCanvasData>(initialLocalData);

  const [loadingStates, setLoadingStates] = useState({
    pains: false,
    gains: false,
    biasCheck: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalData(prev => ({ ...prev, [name]: value }));
  };
  
  const debouncedUpdateAppContext = useCallback(
    (data: ProblemCanvasData) => {
      const timer = setTimeout(() => {
        updateProblemCanvasData(data);
      }, 500);
      return () => clearTimeout(timer);
    },
    [updateProblemCanvasData]
  );

  useEffect(() => {
    // Only call debounced update if localData has actually changed from what context provides for id 'default-project'
    // This comparison helps prevent unnecessary updates if localData is set from currentProjectData
    // and then immediately triggers this effect.
    if (JSON.stringify(localData) !== JSON.stringify(currentProjectData || initialLocalData)) {
        debouncedUpdateAppContext(localData);
    }
  }, [localData, debouncedUpdateAppContext, currentProjectData, initialLocalData]);

  useEffect(() => {
    if (currentProjectData) {
      setLocalData(prevLocalData => {
        // Helper to decide whether to update a field from context or keep local value
        const getValue = (fieldName: keyof ProblemCanvasData, contextValue: string) => {
          // If the field is currently focused, keep the local value
          if (document.activeElement?.getAttribute('name') === fieldName) {
            return prevLocalData[fieldName];
          }
          // Otherwise, update from context if it's different from current local value
          return prevLocalData[fieldName] !== contextValue ? contextValue : prevLocalData[fieldName];
        };

        return {
          ...prevLocalData, // Start with previous local data
          id: currentProjectData.id || 'default-project', // Ensure ID is always present
          jobsToBeDone: getValue('jobsToBeDone', currentProjectData.jobsToBeDone),
          pains: getValue('pains', currentProjectData.pains),
          gains: getValue('gains', currentProjectData.gains),
          innovatorsBiasCheckInput: getValue('innovatorsBiasCheckInput', currentProjectData.innovatorsBiasCheckInput),
          // AI-generated field, should generally take from context if it changes
          innovatorsBiasCheckResult: currentProjectData.innovatorsBiasCheckResult,
        };
      });
    }
  }, [currentProjectData]);


  const handleGetSuggestions = async (suggestionType: 'Pains' | 'Gains') => {
    if (!localData.jobsToBeDone.trim() || apiKeyStatus === 'missing') {
      alert(apiKeyStatus === 'missing' ? "API Key not configured." : "Please describe the 'Job to be Done' first.");
      return;
    }

    setLoadingStates(prev => ({ ...prev, [suggestionType.toLowerCase()]: true }));
    const result = await fetchProblemSuggestions(localData.jobsToBeDone, suggestionType);
    setLoadingStates(prev => ({ ...prev, [suggestionType.toLowerCase()]: false }));

    if (result.error) {
      alert(`Error fetching suggestions: ${result.error}`);
    } else if (result.suggestions && result.suggestions.length > 0) {
      const newContent = result.suggestions.map(s => `- ${s}`).join('\n');
      setLocalData(prev => ({
        ...prev,
        [suggestionType.toLowerCase() as keyof ProblemCanvasData]: `${prev[suggestionType.toLowerCase() as keyof ProblemCanvasData]}\n${newContent}`.trim(),
      }));
    } else {
      alert("No suggestions received. Try rephrasing the Job to be Done.");
    }
  };

  const handleBiasCheck = async () => {
    if (!localData.innovatorsBiasCheckInput.trim() || apiKeyStatus === 'missing') {
       alert(apiKeyStatus === 'missing' ? "API Key not configured." : "Please enter a problem description to check.");
      return;
    }
    setLoadingStates(prev => ({ ...prev, biasCheck: true }));
    const result = await checkInnovatorsBias(localData.innovatorsBiasCheckInput);
    setLoadingStates(prev => ({ ...prev, biasCheck: false }));

    if (result.error) {
      alert(`Error checking bias: ${result.error}`);
    } else if (result.rephrasedProblem) {
      // This directly updates localData and will be picked up by the debounced context update.
      // The context update will then flow back via the other useEffect,
      // which should correctly set innovatorsBiasCheckResult without disturbing other fields.
      setLocalData(prev => ({ ...prev, innovatorsBiasCheckResult: result.rephrasedProblem || "No specific rephrasing provided." }));
    }
  };


  const isApiDisabled = apiKeyStatus === 'missing';

  return (
    <div className="space-y-8">
      <Card title="Customer Problem Space: Problem-First Canvas">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <TextArea
              label="Jobs to Be Done"
              name="jobsToBeDone"
              value={localData.jobsToBeDone}
              onChange={handleChange}
              placeholder="What tasks are customers trying to get done? What problems are they trying to solve?"
              rows={6}
            />
             <p className="text-xs text-gray-700">Describe the core task or goal your customer is trying to achieve. Be specific.</p>
          </div>
          <div className="md:col-span-1 space-y-4">
            <TextArea
              label="Pains"
              name="pains"
              value={localData.pains}
              onChange={handleChange}
              placeholder="What annoys customers before, during, or after getting the job done? (e.g., risks, obstacles, undesired outcomes)"
              rows={6}
            />
            <Button onClick={() => handleGetSuggestions('Pains')} isLoading={loadingStates.pains} size="sm" variant="secondary" isAiFeature disabled={isApiDisabled || !localData.jobsToBeDone.trim()}>
              Get AI Suggestions for Pains
            </Button>
          </div>
          <div className="md:col-span-1 space-y-4">
            <TextArea
              label="Gains"
              name="gains"
              value={localData.gains}
              onChange={handleChange}
              placeholder="What outcomes and benefits do customers desire? (e.g., required, expected, desired, unexpected gains)"
              rows={6}
            />
            <Button onClick={() => handleGetSuggestions('Gains')} isLoading={loadingStates.gains} size="sm" variant="secondary" isAiFeature disabled={isApiDisabled || !localData.jobsToBeDone.trim()}>
              Get AI Suggestions for Gains
            </Button>
          </div>
        </div>
      </Card>

      <Card title="Innovator's Bias Check">
        <p className="mb-4 text-sm text-gray-700">
          Describe the identified problem WITHOUT mentioning your proposed product or service. This helps ensure the problem's existence is independent of your solution.
        </p>
        <TextArea
          label="Your Problem Description (Solution-Free)"
          name="innovatorsBiasCheckInput"
          value={localData.innovatorsBiasCheckInput}
          onChange={handleChange}
          placeholder="e.g., 'Parents struggle to find reliable babysitters on short notice for evening outings.'"
          rows={4}
        />
        <Button onClick={handleBiasCheck} isLoading={loadingStates.biasCheck} className="mt-4" isAiFeature disabled={isApiDisabled || !localData.innovatorsBiasCheckInput.trim()}>
          Check Bias with AI
        </Button>
        {loadingStates.biasCheck && <Spinner size="sm" className="mt-2" />}
        {localData.innovatorsBiasCheckResult && !loadingStates.biasCheck && (
          <div className="mt-4 p-4 bg-primary-DEFAULT/10 rounded-md">
            <h4 className="font-semibold text-primary-dark">AI Feedback:</h4>
            <p className="text-sm text-gray-800 whitespace-pre-wrap">{localData.innovatorsBiasCheckResult}</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProblemCanvasForm;