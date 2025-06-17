import React, { useState, useEffect } from 'react';
import { TestCard, Hypothesis } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';
import Button from '../ui/Button';
import TextArea from '../ui/TextArea';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import Select from '../ui/Select';

interface TestCardFormProps {
  isOpen: boolean;
  onClose: () => void;
  testCardToEdit?: TestCard | null;
  defaultHypothesisId?: string;
}

const initialFormState: Omit<TestCard, 'id' | 'status'> = {
  hypothesisId: '',
  testDescription: '',
  metric: '',
  successCriteria: '',
  results: '',
  learnings: '',
};

const TestCardForm: React.FC<TestCardFormProps> = ({ isOpen, onClose, testCardToEdit, defaultHypothesisId }) => {
  const { hypotheses, addTestCard, updateTestCard } = useAppContext();
  const [formData, setFormData] = useState<Omit<TestCard, 'id'>>(
    testCardToEdit || { ...initialFormState, hypothesisId: defaultHypothesisId || '', status: 'planned' }
  );

  useEffect(() => {
    if (testCardToEdit) {
      setFormData(testCardToEdit);
    } else {
      setFormData({ ...initialFormState, hypothesisId: defaultHypothesisId || '', status: 'planned' });
    }
  }, [testCardToEdit, defaultHypothesisId, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.hypothesisId) {
        alert("Please select a hypothesis to link this test card to.");
        return;
    }
    if (testCardToEdit) {
      updateTestCard({ ...testCardToEdit, ...formData });
    } else {
      // Status is set by context on add
      const { status, ...restOfData } = formData as TestCard; // Exclude status for add
      addTestCard(restOfData);
    }
    onClose();
  };

  const hypothesisOptions = hypotheses.map(h => ({ value: h.id, label: h.description.substring(0, 100) + (h.description.length > 100 ? '...' : '') }));
  const statusOptions = [
    { value: 'planned', label: 'Planned' },
    { value: 'running', label: 'Running' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={testCardToEdit ? 'Edit Test Card' : 'Create New Test Card'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Link to Hypothesis"
          name="hypothesisId"
          options={hypothesisOptions}
          value={formData.hypothesisId}
          onChange={handleChange}
          required
          placeholder="Select a hypothesis"
        />
        <TextArea
          label="Test Description"
          name="testDescription"
          value={formData.testDescription}
          onChange={handleChange}
          rows={3}
          placeholder="How will you test this hypothesis? e.g., 'Run a Facebook ad campaign targeting [segment] with [value prop] leading to a signup landing page.'"
          required
        />
        <Input
          label="Metric to Measure"
          name="metric"
          value={formData.metric}
          onChange={handleChange}
          placeholder="What key metric will indicate success/failure? e.g., 'Click-through rate (CTR)', 'Conversion rate on landing page'."
          required
        />
        <TextArea
          label="Success Criteria (Pass/Fail)"
          name="successCriteria"
          value={formData.successCriteria}
          onChange={handleChange}
          rows={2}
          placeholder="What specific result will validate/invalidate the hypothesis? e.g., 'Achieve a CTR of >2%', 'Secure 50 signups within 1 week.'"
          required
        />
        {testCardToEdit && (
          <>
            <Select
              label="Status"
              name="status"
              options={statusOptions}
              value={(formData as TestCard).status}
              onChange={handleChange}
            />
            <TextArea
              label="Results"
              name="results"
              value={formData.results || ''}
              onChange={handleChange}
              rows={3}
              placeholder="What happened when you ran the test? Be objective."
            />
            <TextArea
              label="Learnings"
              name="learnings"
              value={formData.learnings || ''}
              onChange={handleChange}
              rows={3}
              placeholder="What did you learn from the results? How does this impact your hypothesis?"
            />
          </>
        )}
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">{testCardToEdit ? 'Save Changes' : 'Create Test Card'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default TestCardForm;
