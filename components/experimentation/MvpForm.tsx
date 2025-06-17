
import React, { useState, useEffect } from 'react';
import { MVP, Hypothesis } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import TextArea from '../ui/TextArea';
import Modal from '../ui/Modal';
import Select from '../ui/Select'; // Assuming you have a Select component

interface MvpFormProps {
  isOpen: boolean;
  onClose: () => void;
  mvpToEdit?: MVP | null;
}

const initialFormState: Omit<MVP, 'id' | 'status' | 'linkedHypothesisIds'> = {
  name: '',
  type: 'landing page',
  description: '',
  metricsToTrack: '',
  feedbackSummary: '',
};

const MvpForm: React.FC<MvpFormProps> = ({ isOpen, onClose, mvpToEdit }) => {
  const { hypotheses, addMvp, updateMvp } = useAppContext();
  const [formData, setFormData] = useState<Omit<MVP, 'id'> & {linkedHypothesisIdsString?: string}>(
      mvpToEdit ? {...mvpToEdit, linkedHypothesisIdsString: mvpToEdit.linkedHypothesisIds.join(',')} : { ...initialFormState, status: 'ideation', linkedHypothesisIds: [], linkedHypothesisIdsString: '' }
  );

  useEffect(() => {
    if (mvpToEdit) {
      setFormData({...mvpToEdit, linkedHypothesisIdsString: mvpToEdit.linkedHypothesisIds.join(',')});
    } else {
      setFormData({ ...initialFormState, status: 'ideation', linkedHypothesisIds: [], linkedHypothesisIdsString: ''});
    }
  }, [mvpToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleHypothesisLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setFormData(prev => ({ ...prev, linkedHypothesisIdsString: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const linkedHypothesisIds = formData.linkedHypothesisIdsString ? formData.linkedHypothesisIdsString.split(',').map(id => id.trim()).filter(Boolean) : [];
    
    const dataToSave = {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        metricsToTrack: formData.metricsToTrack,
        feedbackSummary: formData.feedbackSummary,
        linkedHypothesisIds,
        status: formData.status
    };

    if (mvpToEdit) {
      updateMvp({ ...mvpToEdit, ...dataToSave });
    } else {
      // status will be set by context for new items
      const { status, ...restOfData } = dataToSave as MVP; // Exclude status for add
      addMvp(restOfData);
    }
    onClose();
  };

  const mvpTypeOptions = [
    { value: 'landing page', label: 'Landing Page' },
    { value: 'interactive mockup', label: 'Interactive Mockup' },
    { value: 'concierge', label: 'Concierge MVP' },
    { value: 'facade', label: 'Facade/Wizard of Oz MVP' },
    { value: 'video', label: 'Video MVP' },
    { value: 'other', label: 'Other' },
  ];

  const statusOptions = [
    { value: 'ideation', label: 'Ideation' },
    { value: 'building', label: 'Building' },
    { value: 'testing', label: 'Testing' },
    { value: 'completed', label: 'Completed' },
  ];
  
  const hypothesisOptionsText = hypotheses.map(h => `ID: ${h.id} - ${h.description.substring(0,50)}...`).join('\n');


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mvpToEdit ? 'Edit MVP' : 'Create New MVP'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="MVP Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g., 'Early Sign-up Landing Page', 'Concierge Language Tutoring'"
          required
        />
        <Select
          label="MVP Type"
          name="type"
          options={mvpTypeOptions}
          value={formData.type}
          onChange={handleChange}
        />
        <TextArea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          placeholder="Describe the MVP. What will it do? What's the minimum to learn?"
          required
        />
         <div>
            <Input
                label="Link to Hypotheses (Comma-separated IDs)"
                name="linkedHypothesisIdsString"
                value={formData.linkedHypothesisIdsString}
                onChange={handleHypothesisLinkChange}
                placeholder="e.g., id1, id2"
            />
            <details className="text-xs text-gray-500 mt-1">
                <summary>Available Hypothesis IDs</summary>
                <pre className="bg-gray-100 p-2 rounded max-h-32 overflow-auto">{hypothesisOptionsText || "No hypotheses created yet."}</pre>
            </details>
        </div>
        <TextArea
          label="Key Metrics to Track"
          name="metricsToTrack"
          value={formData.metricsToTrack}
          onChange={handleChange}
          rows={2}
          placeholder="e.g., 'Number of sign-ups', 'Time spent on page', 'Completion rate of core task'"
        />
        {mvpToEdit && (
            <>
                <Select
                    label="Status"
                    name="status"
                    options={statusOptions}
                    value={formData.status}
                    onChange={handleChange}
                />
                <TextArea
                    label="Feedback Summary"
                    name="feedbackSummary"
                    value={formData.feedbackSummary || ''}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Summarize key feedback received for this MVP."
                />
            </>
        )}
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">{mvpToEdit ? 'Save Changes' : 'Create MVP'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default MvpForm;
