
import React, { useState, useEffect } from 'react';
import { Hypothesis } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import Button from '../ui/Button';
import TextArea from '../ui/TextArea';
import Modal from '../ui/Modal';
import Select from '../ui/Select'; // Assuming you have a Select component

interface HypothesisFormProps {
  isOpen: boolean;
  onClose: () => void;
  hypothesisToEdit?: Hypothesis | null;
}

const initialFormState: Omit<Hypothesis, 'id' | 'createdAt' | 'status' | 'aiCritique'> = {
  description: '',
};

const HypothesisForm: React.FC<HypothesisFormProps> = ({ isOpen, onClose, hypothesisToEdit }) => {
  const { addHypothesis, updateHypothesis, apiKeyStatus, critiqueHypothesis } = useAppContext();
  const [formData, setFormData] = useState<Omit<Hypothesis, 'id' | 'createdAt'> & {aiCritique?: string}>(
    hypothesisToEdit || { ...initialFormState, status: 'pending' }
  );
  const [isCritiquing, setIsCritiquing] = useState(false);


  useEffect(() => {
    if (hypothesisToEdit) {
      setFormData({
        description: hypothesisToEdit.description,
        status: hypothesisToEdit.status,
        aiCritique: hypothesisToEdit.aiCritique,
      });
    } else {
      setFormData({ ...initialFormState, status: 'pending' });
    }
  }, [hypothesisToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hypothesisToEdit) {
      updateHypothesis({ ...hypothesisToEdit, description: formData.description, status: formData.status, aiCritique: formData.aiCritique });
    } else {
      addHypothesis({ description: formData.description }); // status and createdAt are set by context
    }
    onClose();
  };

  const handleCritique = async () => {
    if (!hypothesisToEdit || !hypothesisToEdit.id || apiKeyStatus === 'missing') return;
    setIsCritiquing(true);
    await critiqueHypothesis(hypothesisToEdit.id);
    // Refresh formData if critique modifies it directly in context
    const updatedHypo = useAppContext().getHypothesisById(hypothesisToEdit.id);
    if(updatedHypo) setFormData(prev => ({...prev, aiCritique: updatedHypo.aiCritique}));
    setIsCritiquing(false);
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'testing', label: 'Testing' },
    { value: 'validated', label: 'Validated' },
    { value: 'invalidated', label: 'Invalidated' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={hypothesisToEdit ? 'Edit Hypothesis' : 'Create New Hypothesis'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextArea
          label="Hypothesis Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
          placeholder="e.g., 'Parents of toddlers (customer segment) struggle to find (problem) engaging educational activities for rainy days (context) and will pay for (value) a curated subscription box (solution type).' Clearly state your assumption."
          required
        />
        {hypothesisToEdit && (
          <Select
            label="Status"
            name="status"
            options={statusOptions}
            value={formData.status}
            onChange={handleChange}
          />
        )}
        
        {hypothesisToEdit && apiKeyStatus === 'ok' && (
            <div className="pt-2">
                <Button 
                    type="button" 
                    onClick={handleCritique} 
                    isAiFeature 
                    isLoading={isCritiquing}
                    disabled={isCritiquing || !formData.description.trim()}
                    variant="secondary"
                >
                    AI Critique Hypothesis
                </Button>
                {formData.aiCritique && !isCritiquing && (
                    <div className="mt-2 p-3 bg-indigo-50 rounded-md border border-indigo-200">
                        <p className="text-xs font-semibold text-indigo-700">AI Critique:</p>
                        <p className="text-xs text-indigo-600 whitespace-pre-wrap">{formData.aiCritique}</p>
                    </div>
                )}
            </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">{hypothesisToEdit ? 'Save Changes' : 'Create Hypothesis'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default HypothesisForm;
