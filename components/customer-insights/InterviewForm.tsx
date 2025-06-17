
import React, { useState, useEffect } from 'react';
import { Interview } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import Button from '../ui/Button';
import TextArea from '../ui/TextArea';
import Input from '../ui/Input'; // Assuming you have a standard Input component
import Modal from '../ui/Modal';

interface InterviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  interviewToEdit?: Interview | null;
}

const initialFormState: Omit<Interview, 'id' | 'tags'> & { tagsString?: string } = {
  date: new Date().toISOString().split('T')[0], // Default to today
  intervieweeName: '',
  customerSegment: '',
  keyTakeaways: '',
  tagsString: '', // For comma-separated input
  sentiment: undefined,
  aiSummary: '',
};

const InterviewForm: React.FC<InterviewFormProps> = ({ isOpen, onClose, interviewToEdit }) => {
  const { addInterview, updateInterview, apiKeyStatus, generateInterviewSummary } = useAppContext();
  const [formData, setFormData] = useState(initialFormState);
  const [isSummarizing, setIsSummarizing] = useState(false);

  useEffect(() => {
    if (interviewToEdit) {
      setFormData({
        ...interviewToEdit,
        tagsString: interviewToEdit.tags.join(', '),
      });
    } else {
      setFormData(initialFormState);
    }
  }, [interviewToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (interviewToEdit) {
      const tags = formData.tagsString ? formData.tagsString.split(',').map(tag => tag.trim()).filter(Boolean) : [];
      updateInterview({ ...interviewToEdit, ...formData, tags });
    } else {
      addInterview(formData);
    }
    onClose();
  };
  
  const handleGenerateSummary = async () => {
    if (!interviewToEdit || !interviewToEdit.id || apiKeyStatus === 'missing') return;
    setIsSummarizing(true);
    await generateInterviewSummary(interviewToEdit.id);
    // The context update will trigger a re-render if interviewToEdit is part of displayed list
    // Or, if editing, we might need to refresh formData from context after summary.
    // For now, assume context handles the update propagation.
    setIsSummarizing(false);
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} title={interviewToEdit ? 'Edit Interview' : 'Log New Interview'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Date"
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <Input
          label="Interviewee Name (Optional)"
          name="intervieweeName"
          value={formData.intervieweeName}
          onChange={handleChange}
          placeholder="e.g., Jane Doe"
        />
        <Input
          label="Customer Segment (Optional)"
          name="customerSegment"
          value={formData.customerSegment}
          onChange={handleChange}
          placeholder="e.g., Busy Parents, Early Adopters"
        />
        <TextArea
          label="Key Takeaways & Notes"
          name="keyTakeaways"
          value={formData.keyTakeaways}
          onChange={handleChange}
          rows={6}
          placeholder="Focus on past behaviors, specific situations, problems, workarounds (Mom Test style). What did they say? What did they do?"
          required
        />
        <Input
          label="Tags (comma-separated)"
          name="tagsString"
          value={formData.tagsString}
          onChange={handleChange}
          placeholder="e.g., pain point, quick setup, pricing concern"
        />
         <div className="flex items-center space-x-4">
          <label htmlFor="sentiment" className="block text-sm font-medium text-neutral-dark">Sentiment:</label>
          <select
            name="sentiment"
            id="sentiment"
            value={formData.sentiment || ''}
            onChange={handleChange}
            className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-primary-DEFAULT focus:border-primary-DEFAULT"
          >
            <option value="">N/A</option>
            <option value="positive">Positive</option>
            <option value="neutral">Neutral</option>
            <option value="negative">Negative</option>
          </select>
        </div>

        {interviewToEdit && apiKeyStatus === 'ok' && (
          <div className="pt-2">
            <Button 
              type="button" 
              onClick={handleGenerateSummary} 
              isAiFeature 
              isLoading={isSummarizing}
              disabled={isSummarizing || !formData.keyTakeaways.trim()}
              variant="secondary"
            >
              Generate AI Summary
            </Button>
            {formData.aiSummary && !isSummarizing && (
              <div className="mt-2 p-3 bg-indigo-50 rounded-md border border-indigo-200">
                <p className="text-xs text-indigo-700 whitespace-pre-wrap">{formData.aiSummary}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">{interviewToEdit ? 'Save Changes' : 'Add Interview'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default InterviewForm;
