import React, { useState, useEffect } from 'react';
import { LearningCard, TestCard } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import Button from '../ui/Button';
import TextArea from '../ui/TextArea';
import Modal from '../ui/Modal';
import Select from '../ui/Select';
import { SparklesIcon } from '../../constants';

interface LearningCardFormProps {
  isOpen: boolean;
  onClose: () => void;
  learningCardToEdit?: LearningCard | null;
  defaultTestCardId?: string; // To pre-fill if creating from a test card
}

const initialFormState: Omit<LearningCard, 'id' | 'date' | 'aiReflectionPrompt'> = {
  relatedTestCardId: '',
  whatWeThought: '',
  whatHappened: '',
  whatWeLearned: '',
  whatWeWillChange: '',
};

const LearningCardForm: React.FC<LearningCardFormProps> = ({ isOpen, onClose, learningCardToEdit, defaultTestCardId }) => {
  const { testCards, addLearningCard, updateLearningCard, apiKeyStatus, generateLearningReflection, getLearningCardById, getHypothesisById } = useAppContext();
  const [formData, setFormData] = useState<Omit<LearningCard, 'id' | 'date'> & {aiReflectionPrompt?: string}>(
    learningCardToEdit || { ...initialFormState, relatedTestCardId: defaultTestCardId }
  );
  const [isReflecting, setIsReflecting] = useState(false);

  useEffect(() => {
    if (learningCardToEdit) {
      setFormData(learningCardToEdit);
    } else {
      let thought = '', happened = '', learned = '';
      if(defaultTestCardId){
        const tc = testCards.find(t => t.id === defaultTestCardId);
        if(tc){
            // Use the destructured getHypothesisById from useAppContext at the top level
            thought = `We believed that ${tc.hypothesisId ? `(Hypothesis: ${getHypothesisById(tc.hypothesisId)?.description.substring(0,50)}...)` : ''} if we ${tc.testDescription}, then ${tc.successCriteria}.`;
            happened = tc.results || '';
            learned = tc.learnings || '';
        }
      }
      setFormData({ ...initialFormState, relatedTestCardId: defaultTestCardId, whatWeThought: thought, whatHappened: happened, whatWeLearned: learned });
    }
  }, [learningCardToEdit, defaultTestCardId, isOpen, testCards, getHypothesisById]); // Corrected dependency array

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (learningCardToEdit) {
      updateLearningCard({ ...learningCardToEdit, ...formData });
    } else {
      addLearningCard(formData); // date and id are set by context
    }
    onClose();
  };
  
  const handleGenerateReflection = async () => {
    if (!learningCardToEdit || !learningCardToEdit.id || apiKeyStatus === 'missing') return;
    setIsReflecting(true);
    await generateLearningReflection(learningCardToEdit.id);
    const updatedCard = getLearningCardById(learningCardToEdit.id);
    if(updatedCard) setFormData(prev => ({...prev, aiReflectionPrompt: updatedCard.aiReflectionPrompt}));
    setIsReflecting(false);
  };

  const testCardOptions = testCards.map(tc => ({ 
      value: tc.id, 
      label: `Test: ${tc.testDescription.substring(0, 50)}... (Metric: ${tc.metric})` 
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={learningCardToEdit ? 'Edit Learning Card' : 'Create New Learning Card'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Link to Test Card (Optional)"
          name="relatedTestCardId"
          options={[{value: '', label: 'None'}, ...testCardOptions]}
          value={formData.relatedTestCardId || ''}
          onChange={handleChange}
          placeholder="Select a Test Card if applicable"
        />
        <TextArea
          label="What We Thought Would Happen"
          name="whatWeThought"
          value={formData.whatWeThought}
          onChange={handleChange}
          rows={3}
          placeholder="Based on our hypothesis/test setup, what did we expect?"
          required
        />
        <TextArea
          label="What Actually Happened"
          name="whatHappened"
          value={formData.whatHappened}
          onChange={handleChange}
          rows={3}
          placeholder="Describe the objective results of the experiment or observation."
          required
        />
        <TextArea
          label="What We Learned"
          name="whatWeLearned"
          value={formData.whatWeLearned}
          onChange={handleChange}
          rows={4}
          placeholder="What insights did we gain? Was our hypothesis validated or invalidated? Why?"
          required
        />
        <TextArea
          label="What We Will Change / Next Steps"
          name="whatWeWillChange"
          value={formData.whatWeWillChange}
          onChange={handleChange}
          rows={3}
          placeholder="Based on these learnings, what will we do next? Pivot? Persevere? Iterate?"
          required
        />

        {learningCardToEdit && apiKeyStatus === 'ok' && (
            <div className="pt-2">
                <Button 
                    type="button" 
                    onClick={handleGenerateReflection} 
                    isAiFeature 
                    isLoading={isReflecting}
                    disabled={isReflecting || !formData.whatWeLearned.trim()}
                    variant="secondary"
                >
                    AI Reflection Prompt
                </Button>
                {formData.aiReflectionPrompt && !isReflecting && (
                    <div className="mt-2 p-3 bg-indigo-50 rounded-md border border-indigo-200">
                        <p className="text-xs font-semibold text-indigo-700">AI Reflection Prompt:</p>
                        <p className="text-xs text-indigo-600 whitespace-pre-wrap">{formData.aiReflectionPrompt}</p>
                    </div>
                )}
            </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">{learningCardToEdit ? 'Save Changes' : 'Create Learning Card'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default LearningCardForm;