
import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAppContext } from '../hooks/useAppContext';
import { LearningCard } from '../types';
import LearningCardForm from '../components/learning-iteration/LearningCardForm';
import { ArrowPathIcon, SparklesIcon, CheckCircleIcon, XCircleIcon } from '../constants';

const LearningIterationPage: React.FC = () => {
  const { learningCards, deleteLearningCard, getLearningCardById, getTestCardById, apiKeyStatus, generateLearningReflection } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<LearningCard | null>(null);
  const [reflectingId, setReflectingId] = useState<string | null>(null);

  const openModalForNew = (testCardId?: string) => {
    setCardToEdit(null);
    setIsModalOpen(true);
    // Potentially pass testCardId to prefill LearningCardForm
  };

  const openModalForEdit = (id: string) => {
    const card = getLearningCardById(id);
    if (card) {
      setCardToEdit(card);
      setIsModalOpen(true);
    }
  };

  const handleGenerateReflection = async (id: string) => {
    if (apiKeyStatus === 'missing') {
        alert("API Key is not configured.");
        return;
    }
    setReflectingId(id);
    await generateLearningReflection(id);
    setReflectingId(null);
  };
  
  // Example for Growth Mindset Dashboard: count invalidated hypotheses
  // This would ideally come from the Experimentation module's data.
  // For now, it's a conceptual placeholder.
  const invalidatedHypothesesCount = useAppContext().hypotheses.filter(h => h.status === 'invalidated').length;


  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Learning & Iteration</h1>
          <p className="mt-1 text-gray-700">
            Capture insights, make data-driven decisions, and iterate on your ideas.
          </p>
        </div>
        <Button onClick={() => openModalForNew()} leftIcon={<ArrowPathIcon className="h-5 w-5 mr-2"/>}>
          New Learning Card
        </Button>
      </header>

      {/* Learning Cards Section */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">Learning Cards</h2>
        {learningCards.length === 0 ? (
          <Card>
            <p className="text-center text-gray-800 py-8">
              No learning cards created yet. Capture your insights after each experiment or observation.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {learningCards.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((card) => {
              const relatedTest = card.relatedTestCardId ? getTestCardById(card.relatedTestCardId) : null;
              return (
                <Card key={card.id} title={<span className="text-neutral-dark">Learning Card: {new Date(card.date).toLocaleDateString()}</span>}
                  actions={
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" onClick={() => openModalForEdit(card.id)}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => confirm('Delete this learning card?') && deleteLearningCard(card.id)}>Delete</Button>
                    </div>
                  }
                >
                  <div className="space-y-2 text-sm text-gray-800">
                    {relatedTest && <p><strong className="text-neutral-dark">Related Test:</strong> {relatedTest.testDescription.substring(0,70)}...</p>}
                    <p><strong className="text-neutral-dark">What We Thought:</strong> {card.whatWeThought}</p>
                    <p><strong className="text-neutral-dark">What Happened:</strong> {card.whatHappened}</p>
                    <p><strong className="text-neutral-dark">What We Learned:</strong> {card.whatWeLearned}</p>
                    <p><strong className="text-neutral-dark">What We Will Change:</strong> {card.whatWeWillChange}</p>
                    {apiKeyStatus === 'ok' && (
                        <Button 
                            size="sm" 
                            variant="secondary" 
                            isAiFeature 
                            onClick={() => handleGenerateReflection(card.id)}
                            isLoading={reflectingId === card.id}
                            disabled={reflectingId === card.id || !card.whatWeLearned?.trim()}
                        >
                           {card.aiReflectionPrompt && reflectingId !== card.id ? 'Regenerate' : ''} AI Reflection Prompt
                        </Button>
                    )}
                    {card.aiReflectionPrompt && reflectingId !== card.id && (
                         <div className="mt-2 p-2 bg-indigo-50 rounded-md border border-indigo-100">
                            <p className="text-xs font-semibold text-indigo-700">AI Reflection Prompt:</p>
                            <p className="text-xs text-indigo-600 whitespace-pre-wrap">{card.aiReflectionPrompt}</p>
                        </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>
      
      {isModalOpen && (
        <LearningCardForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          learningCardToEdit={cardToEdit}
        />
      )}

      {/* Placeholder for Pivot/Persevere Decision Assistant */}
      <Card title="Pivot or Persevere? (Decision Assistant - Coming Soon)">
        <p className="text-sm text-gray-800">
          Based on your validated learning, this tool will provide frameworks and AI-powered prompts to help you decide on strategic changes (pivot) or continued iteration (persevere).
        </p>
         <div className="mt-4 p-4 bg-gray-100 rounded flex items-center justify-center text-gray-500">
            AI-driven decision support will appear here.
        </div>
      </Card>
      
      {/* Placeholder for Growth Mindset Dashboard */}
       <Card title="Growth Mindset Dashboard (Conceptual)">
        <p className="text-sm text-gray-800 mb-3">
            Embrace "failures" as learning opportunities. Track your journey of invalidated assumptions and the valuable lessons learned.
        </p>
        <div className="flex items-center space-x-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <XCircleIcon className="h-10 w-10 text-amber-500" />
            <div>
                <p className="text-2xl font-semibold text-amber-700">{invalidatedHypothesesCount}</p>
                <p className="text-sm text-amber-600">Hypotheses Invalidated & Lessons Learned</p>
            </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
            This visualization will grow as you test and learn. (Full feature coming soon)
        </p>
      </Card>
    </div>
  );
};

export default LearningIterationPage;
