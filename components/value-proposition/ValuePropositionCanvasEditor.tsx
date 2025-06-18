
import React, { useEffect, useState, useCallback } from 'react';
import { ValuePropositionCanvas } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import TextArea from '../ui/TextArea';
import Card from '../ui/Card';
import Button from '../ui/Button'; 
import { SparklesIcon } from '../../constants'; 

const ValuePropositionCanvasEditor: React.FC = () => {
  const { valueProposition, updateValueProposition, currentProjectData, apiKeyStatus, generateVpMessaging } = useAppContext();
  
  const getInitialCanvasData = useCallback((): ValuePropositionCanvas => {
    let initialVP = valueProposition || {
      id: 'default-vp',
      customerJobs: '',
      customerPains: '',
      customerGains: '',
      productsServices: '',
      painRelievers: '',
      gainCreators: '',
      aiMessagingSuggestions: '',
    };

    if (currentProjectData) {
        initialVP = {
            ...initialVP,
            customerJobs: initialVP.customerJobs || currentProjectData.jobsToBeDone,
            customerPains: initialVP.customerPains || currentProjectData.pains,
            customerGains: initialVP.customerGains || currentProjectData.gains,
        };
    }
    return initialVP;
  }, [valueProposition, currentProjectData]);

  const [canvasData, setCanvasData] = useState<ValuePropositionCanvas>(getInitialCanvasData());
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const initialData = getInitialCanvasData();
     setCanvasData(prevLocalData => {
        const getValue = (fieldName: keyof ValuePropositionCanvas, contextValue: string) => {
          if (document.activeElement?.getAttribute('name') === fieldName) {
            return prevLocalData[fieldName] as string;
          }
          return prevLocalData[fieldName] !== contextValue ? contextValue : prevLocalData[fieldName] as string;
        };
        
        const newAiSuggestions = initialData.aiMessagingSuggestions;

        return {
          ...prevLocalData,
          id: initialData.id,
          customerJobs: getValue('customerJobs', initialData.customerJobs),
          customerPains: getValue('customerPains', initialData.customerPains),
          customerGains: getValue('customerGains', initialData.customerGains),
          productsServices: getValue('productsServices', initialData.productsServices),
          painRelievers: getValue('painRelievers', initialData.painRelievers),
          gainCreators: getValue('gainCreators', initialData.gainCreators),
          aiMessagingSuggestions: newAiSuggestions, 
        };
    });
  }, [valueProposition, currentProjectData, getInitialCanvasData]);


  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCanvasData(prev => ({ ...prev, [name]: value } as ValuePropositionCanvas));
  };
  
  const debouncedUpdateAppContext = useCallback(
    (data: ValuePropositionCanvas) => {
      const timer = setTimeout(() => {
        updateValueProposition(data);
      }, 500);
      return () => clearTimeout(timer);
    },
    [updateValueProposition]
  );

  useEffect(() => {
    if (JSON.stringify(canvasData) !== JSON.stringify(valueProposition || getInitialCanvasData())) {
        debouncedUpdateAppContext(canvasData);
    }
  }, [canvasData, debouncedUpdateAppContext, valueProposition, getInitialCanvasData]);

  const handleGenerateMessaging = async () => {
    if (!canvasData || !canvasData.id || apiKeyStatus === 'missing') {
      alert(apiKeyStatus === 'missing' ? "API Key is not configured." : "Canvas data is not available.");
      return;
    }
    setIsGenerating(true);
    await generateVpMessaging(canvasData.id);
    setIsGenerating(false);
  };

  if (!canvasData) {
    return <Card><p>Loading Value Proposition Canvas...</p></Card>;
  }

  return (
    <div className="space-y-6">
      <Card title="Value Proposition Canvas">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          {/* Customer Profile Side */}
          <div className="space-y-4 p-3 sm:p-4 border border-blue-200 rounded-lg bg-blue-50">
            <h3 className="text-lg sm:text-xl font-semibold text-blue-700 text-center mb-3">Customer Profile</h3>
            <TextArea
              label="Customer Jobs"
              name="customerJobs"
              value={canvasData.customerJobs}
              onChange={handleChange}
              placeholder="What tasks are customers trying to perform? What problems are they trying to solve? (Can be synced from Problem Discovery)"
              rows={4} 
              className="bg-white text-gray-800 text-sm"
            />
            <TextArea
              label="Pains"
              name="customerPains"
              value={canvasData.customerPains}
              onChange={handleChange}
              placeholder="What annoys your customers? What are their negative experiences, risks, and obstacles related to their jobs? (Can be synced from Problem Discovery)"
              rows={4}
              className="bg-white text-gray-800 text-sm"
            />
            <TextArea
              label="Gains"
              name="customerGains"
              value={canvasData.customerGains}
              onChange={handleChange}
              placeholder="What outcomes and benefits do your customers desire? What would make them happy? (Can be synced from Problem Discovery)"
              rows={4}
              className="bg-white text-gray-800 text-sm"
            />
          </div>

          {/* Value Map Side */}
          <div className="space-y-4 p-3 sm:p-4 border border-green-200 rounded-lg bg-green-50">
            <h3 className="text-lg sm:text-xl font-semibold text-green-700 text-center mb-3">Value Map</h3>
            <TextArea
              label="Products & Services"
              name="productsServices"
              value={canvasData.productsServices}
              onChange={handleChange}
              placeholder="What products and services do you offer that help customers get their jobs done?"
              rows={4}
              className="bg-white text-gray-800 text-sm"
            />
            <TextArea
              label="Pain Relievers"
              name="painRelievers"
              value={canvasData.painRelievers}
              onChange={handleChange}
              placeholder="How do your products/services alleviate customer pains?"
              rows={4}
              className="bg-white text-gray-800 text-sm"
            />
            <TextArea
              label="Gain Creators"
              name="gainCreators"
              value={canvasData.gainCreators}
              onChange={handleChange}
              placeholder="How do your products/services create customer gains and outcomes they desire?"
              rows={4}
              className="bg-white text-gray-800 text-sm"
            />
          </div>
        </div>
      </Card>
      
      <Card title="AI-Powered Messaging (Beta)">
          <p className="text-sm text-gray-700 mb-3">
              Based on your canvas, let AI help you craft benefit-oriented messaging.
          </p>
          <Button 
            onClick={handleGenerateMessaging} 
            isAiFeature
            isLoading={isGenerating}
            disabled={apiKeyStatus === 'missing' || isGenerating}
            className="w-full sm:w-auto"
          >
            Generate Messaging Snippets
          </Button>
          {apiKeyStatus === 'missing' && <p className="text-xs text-red-500 mt-1">API Key not configured.</p>}
          
          {isGenerating && <div className="mt-3"><TextArea label="AI Suggestions:" value="Generating..." rows={4} readOnly className="bg-gray-100 text-gray-800"/></div>}
          
          {canvasData.aiMessagingSuggestions && !isGenerating && (
            <div className="mt-4 p-4 bg-primary-DEFAULT/10 rounded-md">
                <h4 className="font-semibold text-primary-dark">AI Messaging Suggestions:</h4>
                <p className="text-sm text-gray-800 whitespace-pre-wrap">{canvasData.aiMessagingSuggestions}</p>
            </div>
          )}
      </Card>
    </div>
  );
};

export default ValuePropositionCanvasEditor;
